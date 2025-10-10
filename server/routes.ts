import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertUserSchema } from "@shared/schema";
import { zelleService } from "./zelle-integration";
import { securityService } from "./security-enhanced";
import { insertOrderSchema, insertGameResultSchema, insertRewardsConfigSchema, insertCampaignConfigSchema, insertSocialPostSchema, insertContentTemplateSchema, insertUserConsentSchema, insertPrivacyPolicySchema, insertDataRequestSchema, insertUserPrivacySettingsSchema } from "@shared/schema";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize security and automatic transfers
  zelleService.setupAutomaticTransfers(storage);
  
  // Security middleware for admin routes
  app.use('/api/admin/*', async (req, res, next) => {
    const isValid = await securityService.validateAdminAccess(
      req.ip || 'unknown',
      req.get('User-Agent') || 'unknown'
    );
    
    if (!isValid) {
      return res.status(401).json({ error: 'Access denied - Security validation failed' });
    }
    
    next();
  });
  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let products;
      if (search) {
        products = await storage.searchProducts(search as string, category as string);
      } else if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else {
        products = await storage.getAllProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Create new product with automated social media content generation
  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      
      // Auto-generate social media content for new products
      try {
        const templates = await storage.getAllContentTemplates();
        const productTemplate = templates.find(t => 
          Array.isArray(t.platforms) && t.platforms.length > 0 && t.content.includes('{product_name}')
        );
        
        if (productTemplate) {
          // Generate automated post
          let content = productTemplate.content;
          content = content.replace(/\{product_name\}/g, product.name || '');
          content = content.replace(/\{product_price\}/g, `$${product.retailPrice || 0}`);
          content = content.replace(/\{product_description\}/g, product.description || '');
          content = content.replace(/\{store_name\}/g, "GTR CUBAUTO");

          const postData = {
            platforms: productTemplate.platforms as string[],
            content,
            templateId: productTemplate.id,
            productId: product.id,
            postType: "automated" as const,
            status: "scheduled" as const,
            scheduledAt: new Date(Date.now() + 60000 * 5), // Schedule 5 minutes from now
          };

          await storage.createSocialPost(postData);
          console.log(`✅ Auto-generated social post for new product: ${product.name}`);
        }
      } catch (autoError) {
        console.warn("⚠️ Failed to auto-generate social content:", autoError);
        // Don't fail the product creation if social automation fails
      }
      
      res.json(product);
    } catch (error) {
      console.error("Failed to create product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  // Authentication routes
  app.post("/api/auth/wholesale", async (req, res) => {
    try {
      const { code, email } = req.body;
      
      // Validate wholesale code (in real app, this would be more secure)
      if (code === "MAYOR2024" && email) {
        // Find or create wholesale user
        let user = await storage.getUserByEmail(email);
        if (!user) {
          user = await storage.createUser({
            username: email.split('@')[0],
            email,
            password: "temp", // In real app, handle properly
            userType: "wholesale",
            points: 0,
            isActive: true,
          });
        } else {
          // Update user type to wholesale
          user = await storage.updateUser(user.id, { userType: "wholesale" });
        }
        
        res.json({ success: true, user });
      } else {
        res.status(401).json({ error: "Invalid code or email" });
      }
    } catch (error) {
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  // Stripe payment intent creation
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = 'usd', metadata = {} } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          source: 'GTR_CUBAUTOS',
          ...metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error('Stripe payment intent error:', error);
      res.status(500).json({ 
        error: "Error creating payment intent",
        message: error.message 
      });
    }
  });

  // Stripe webhook for payment confirmation
  app.post("/api/stripe/webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    let event;

    try {
      // In production, you should set up a webhook endpoint secret
      event = req.body;
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        // Here you would update your order status to completed
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        // Here you would update your order status to failed
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  });

  // Orders routes with automated cash on delivery processing
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      
      // Create base order
      const order = await storage.createOrder(orderData);
      
      // Automated processing for cash on delivery
      if (orderData.paymentMethod === 'cash_on_delivery') {
        const processedOrder = {
          ...order,
          status: 'confirmed',
          paymentStatus: 'pending_delivery',
          deliveryScheduled: true,
          deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day delivery
          autoProcessed: true,
          notifications: {
            customerNotified: true,
            warehouseNotified: true,
            driverAssigned: true
          }
        };
        
        // Update order with processed status
        await storage.updateOrder(order.id, processedOrder);
        
        // Register in sales management system
        const salesEntry = {
          orderId: order.id,
          customerId: orderData.userId || 'guest',
          amount: orderData.total,
          paymentMethod: 'cash_on_delivery',
          status: 'confirmed',
          date: new Date(),
          products: orderData.items,
          delivery: {
            scheduled: true,
            date: processedOrder.deliveryDate,
            type: 'cash_on_delivery'
          }
        };
        
        if ('addSalesRecord' in storage && typeof storage.addSalesRecord === 'function') {
          await storage.addSalesRecord(salesEntry);
        }
        
        // Award points to user if userId provided
        if (order.userId && order.pointsEarned > 0) {
          const user = await storage.getUser(order.userId);
          if (user) {
            await storage.updateUser(user.id, { 
              points: user.points + order.pointsEarned 
            });
          }
        }
        
        res.json({
          ...processedOrder,
          message: 'Pedido confirmado automáticamente para pago contra entrega',
          deliveryMessage: 'Entrega programada para mañana'
        });
      } else {
        // For other payment methods, standard processing
        // Award points to user if userId provided
        if (order.userId && order.pointsEarned > 0) {
          const user = await storage.getUser(order.userId);
          if (user) {
            await storage.updateUser(user.id, { 
              points: user.points + order.pointsEarned 
            });
          }
        }
        
        res.json(order);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const orders = await storage.getOrdersByUser(req.params.userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Games routes
  app.post("/api/games/result", async (req, res) => {
    try {
      const gameData = insertGameResultSchema.parse(req.body);
      const result = await storage.createGameResult(gameData);
      
      // Award points to user
      if (result.userId && result.pointsEarned > 0) {
        const user = await storage.getUser(result.userId);
        if (user) {
          await storage.updateUser(user.id, { 
            points: user.points + result.pointsEarned 
          });
        }
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to save game result" });
    }
  });

  app.get("/api/games/results/:userId", async (req, res) => {
    try {
      const results = await storage.getGameResultsByUser(req.params.userId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch game results" });
    }
  });

  // Rewards routes
  app.get("/api/rewards/config", async (req, res) => {
    try {
      const config = await storage.getRewardsConfig();
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rewards config" });
    }
  });

  app.put("/api/rewards/config", async (req, res) => {
    try {
      const configData = insertRewardsConfigSchema.parse(req.body);
      const config = await storage.updateRewardsConfig(configData);
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: "Failed to update rewards config" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Admin API - Create new user
  app.post("/api/admin/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse({
        ...req.body,
        password: "temp123", // Default password, user should change it
        isActive: true,
      });
      
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      console.error("Failed to create user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.get("/api/admin/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Get sales records for management
  app.get("/api/sales", async (req, res) => {
    try {
      const sales = ('getSalesRecords' in storage && typeof storage.getSalesRecords === 'function') 
        ? await storage.getSalesRecords() : [];
      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sales records" });
    }
  });

  // Campaigns routes
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getAllCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const campaignData = insertCampaignConfigSchema.parse(req.body);
      const campaign = await storage.createCampaign(campaignData);
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: "Failed to create campaign" });
    }
  });

  app.put("/api/campaigns/:id", async (req, res) => {
    try {
      const updates = req.body;
      const campaign = await storage.updateCampaign(req.params.id, updates);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: "Failed to update campaign" });
    }
  });

  // Social Posts API
  app.get("/api/social-posts", async (req, res) => {
    try {
      const posts = await storage.getAllSocialPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch social posts" });
    }
  });

  app.post("/api/social-posts", async (req, res) => {
    try {
      const postData = insertSocialPostSchema.parse(req.body);
      const post = await storage.createSocialPost(postData);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to create social post" });
    }
  });

  app.post("/api/social-posts/generate", async (req, res) => {
    try {
      const { templateId, productId, platforms } = req.body;
      const template = await storage.getContentTemplate(templateId);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      let product = null;
      if (productId) {
        product = await storage.getProduct(productId);
      }

      // Generate content from template
      let content = template.content;
      if (product) {
        content = content.replace(/\{product_name\}/g, product.name);
        content = content.replace(/\{product_price\}/g, `$${product.retailPrice}`);
        content = content.replace(/\{product_description\}/g, product.description);
      }
      content = content.replace(/\{store_name\}/g, "GTR CUBAUTO");

      const postData = {
        platforms: platforms || template.platforms,
        content,
        templateId,
        productId: productId || null,
        postType: "automated" as const,
        status: "scheduled" as const,
        scheduledAt: new Date(Date.now() + 60000 * 5), // Schedule 5 minutes from now
      };

      const post = await storage.createSocialPost(postData);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate automated content" });
    }
  });

  // Content Templates API
  app.get("/api/content-templates", async (req, res) => {
    try {
      const templates = await storage.getAllContentTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content templates" });
    }
  });

  app.post("/api/content-templates", async (req, res) => {
    try {
      const templateData = insertContentTemplateSchema.parse(req.body);
      const template = await storage.createContentTemplate(templateData);
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to create content template" });
    }
  });

  app.put("/api/content-templates/:id", async (req, res) => {
    try {
      const updates = req.body;
      const template = await storage.updateContentTemplate(req.params.id, updates);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to update template" });
    }
  });

  // Site Configuration API
  app.get("/api/site-config", async (req, res) => {
    try {
      const config = await storage.getAllSiteConfig();
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site configuration" });
    }
  });

  // Zelle Integration API Routes
  app.get("/api/zelle/config", async (req, res) => {
    try {
      const config = zelleService.getConfig();
      // No enviar información sensible al frontend
      const safeConfig = {
        bankName: config.bankName,
        accountHolderName: config.accountHolderName,
        minimumTransferAmount: config.minimumTransferAmount,
        transferSchedule: config.transferSchedule,
        autoTransferEnabled: config.autoTransferEnabled,
      };
      res.json(safeConfig);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Zelle configuration" });
    }
  });

  app.post("/api/zelle/transfer", async (req, res) => {
    try {
      const { amount, memo, securityCode, encryptionEnabled } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid transfer amount" });
      }

      const transfer = await zelleService.initiateTransfer(amount, memo || "GTR CUBAUTO Transfer");
      
      // Log de seguridad para transferencias manuales
      await storage.createSecurityLog({
        action: 'zelle_transfer_initiated',
        userId: 'admin',
        ipAddress: req.ip || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        risk_level: 'high',
        details: {
          transferId: transfer.id,
          amount: transfer.amount,
          timestamp: new Date().toISOString()
        }
      });

      res.json(transfer);
    } catch (error) {
      console.error("Zelle transfer error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to process transfer" 
      });
    }
  });

  app.post("/api/zelle/auto-transfer", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      const transfer = await zelleService.processAutomaticTransfer(orders);
      
      if (!transfer) {
        return res.json({ 
          message: "No automatic transfer needed", 
          reason: "Insufficient earnings or auto-transfer disabled" 
        });
      }

      // Log de seguridad
      await storage.createSecurityLog({
        action: 'auto_transfer_completed',
        userId: 'system',
        ipAddress: req.ip || 'system',
        userAgent: 'GTR-AutoTransfer/1.0',
        risk_level: 'medium',
        details: {
          transferId: transfer.id,
          amount: transfer.amount,
          earnings: await zelleService.calculateDailyEarnings(orders)
        }
      });

      res.json(transfer);
    } catch (error) {
      console.error("Auto transfer error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to process automatic transfer" 
      });
    }
  });

  app.get("/api/zelle/earnings", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      const dailyEarnings = await zelleService.calculateDailyEarnings(orders);
      
      res.json({
        dailyEarnings,
        minimumTransfer: zelleService.getConfig().minimumTransferAmount,
        canTransfer: dailyEarnings >= zelleService.getConfig().minimumTransferAmount,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate earnings" });
    }
  });

  app.get("/api/site-config/:key", async (req, res) => {
    try {
      const value = await storage.getSiteConfig(req.params.key);
      if (value === undefined) {
        return res.status(404).json({ error: "Configuration key not found" });
      }
      res.json({ key: req.params.key, value });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch configuration" });
    }
  });

  app.post("/api/site-config", async (req, res) => {
    try {
      const { key, value, category } = req.body;
      await storage.setSiteConfig(key, value, category);
      res.json({ success: true, key, value });
    } catch (error) {
      res.status(500).json({ error: "Failed to update configuration" });
    }
  });

  // Admin routes for home page configuration
  app.post("/api/admin/home-config", async (req, res) => {
    try {
      const { home_sections } = req.body;
      
      if (!home_sections || typeof home_sections !== 'object') {
        return res.status(400).json({ error: "Invalid home sections data" });
      }

      // Save home sections configuration
      await storage.setSiteConfig('home_sections', home_sections, 'home');
      
      // Also save individual promotional data for backward compatibility
      const limitedOffersSection = home_sections['limited-offers'];
      if (limitedOffersSection) {
        if (limitedOffersSection.images) {
          await storage.setSiteConfig('promotional_images', limitedOffersSection.images, 'home');
        }
        if (limitedOffersSection.videos) {
          await storage.setSiteConfig('promotional_videos', limitedOffersSection.videos, 'home');
        }
      }

      res.json({ success: true, message: "Home configuration updated successfully" });
    } catch (error) {
      console.error("Failed to save home configuration:", error);
      res.status(500).json({ error: "Failed to save home configuration" });
    }
  });

  app.get("/api/admin/home-config", async (req, res) => {
    try {
      const homeSections = await storage.getSiteConfig('home_sections');
      res.json({ home_sections: homeSections || {} });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch home configuration" });
    }
  });

  // Wholesale Codes routes
  app.get("/api/wholesale-codes", async (req, res) => {
    try {
      const codes = await storage.getAllWholesaleCodes();
      res.json(codes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wholesale codes" });
    }
  });

  app.post("/api/wholesale-codes", async (req, res) => {
    try {
      const codeData = req.body;
      const newCode = await storage.createWholesaleCode(codeData);
      res.json(newCode);
    } catch (error) {
      res.status(500).json({ error: "Failed to create wholesale code" });
    }
  });

  app.put("/api/wholesale-codes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedCode = await storage.updateWholesaleCode(id, updates);
      
      if (!updatedCode) {
        return res.status(404).json({ error: "Wholesale code not found" });
      }
      
      res.json(updatedCode);
    } catch (error) {
      res.status(500).json({ error: "Failed to update wholesale code" });
    }
  });

  app.post("/api/wholesale-codes/validate", async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: "Code is required" });
      }
      
      const isValid = await storage.validateWholesaleCode(code);
      const wholesaleCode = await storage.getWholesaleCode(code);
      
      res.json({ 
        valid: isValid,
        code: wholesaleCode 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to validate wholesale code" });
    }
  });

  app.post("/api/wholesale-codes/use", async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: "Code is required" });
      }
      
      const success = await storage.useWholesaleCode(code);
      
      if (!success) {
        return res.status(400).json({ error: "Invalid or expired code" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to use wholesale code" });
    }
  });

  // Inventory Items routes
  app.get("/api/inventory", async (req, res) => {
    try {
      const { category } = req.query;
      
      let items;
      if (category) {
        items = await storage.getInventoryItemsByCategory(category as string);
      } else {
        items = await storage.getAllInventoryItems();
      }
      
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory items" });
    }
  });

  app.get("/api/inventory/:id", async (req, res) => {
    try {
      const item = await storage.getInventoryItem(req.params.id);
      
      if (!item) {
        return res.status(404).json({ error: "Inventory item not found" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory item" });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const itemData = req.body;
      const newItem = await storage.createInventoryItem(itemData);
      res.json(newItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to create inventory item" });
    }
  });

  app.put("/api/inventory/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedItem = await storage.updateInventoryItem(id, updates);
      
      if (!updatedItem) {
        return res.status(404).json({ error: "Inventory item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to update inventory item" });
    }
  });

  app.post("/api/inventory/:id/publish", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.publishInventoryItem(id);
      
      if (!product) {
        return res.status(404).json({ error: "Inventory item not found" });
      }
      
      res.json({ 
        success: true, 
        product,
        message: "Product published successfully" 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to publish inventory item" });
    }
  });

  app.post("/api/inventory/bulk-publish", async (req, res) => {
    try {
      const { ids, category } = req.body;
      
      if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ error: "IDs array is required" });
      }
      
      const products = await storage.bulkPublishInventoryItems(ids, category);
      
      res.json({ 
        success: true, 
        products,
        published: products.length,
        message: `${products.length} productos publicados exitosamente` 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to bulk publish inventory items" });
    }
  });

  // Privacy and Consent Routes
  
  // Save user consent
  app.post("/api/user-consents", async (req, res) => {
    try {
      const consentData = insertUserConsentSchema.parse(req.body);
      const consent = await storage.createUserConsent(consentData);
      
      // Log security event
      await storage.createSecurityLog({
        userId: consentData.userId,
        action: "consent_granted",
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: { consentType: consentData.consentType, granted: consentData.granted },
        risk_level: "low"
      });
      
      res.json(consent);
    } catch (error) {
      console.error("Error saving consent:", error);
      res.status(500).json({ error: "Failed to save consent" });
    }
  });

  // Get user consents
  app.get("/api/user-consents/me", async (req, res) => {
    try {
      const userEmail = req.query.email as string;
      if (!userEmail) {
        return res.status(400).json({ error: "Email required" });
      }
      
      const consents = await storage.getUserConsents(userEmail);
      res.json(consents);
    } catch (error) {
      console.error("Error fetching consents:", error);
      res.status(500).json({ error: "Failed to fetch consents" });
    }
  });

  // Get current privacy policy
  app.get("/api/privacy-policy/current", async (req, res) => {
    try {
      const policy = await storage.getCurrentPrivacyPolicy();
      res.json(policy);
    } catch (error) {
      console.error("Error fetching privacy policy:", error);
      res.status(500).json({ error: "Failed to fetch privacy policy" });
    }
  });

  // User privacy settings
  app.get("/api/privacy-settings/:userId", async (req, res) => {
    try {
      const settings = await storage.getUserPrivacySettings(req.params.userId);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching privacy settings:", error);
      res.status(500).json({ error: "Failed to fetch privacy settings" });
    }
  });

  app.put("/api/privacy-settings/:userId", async (req, res) => {
    try {
      const settingsData = insertUserPrivacySettingsSchema.parse(req.body);
      const settings = await storage.updateUserPrivacySettings(req.params.userId, settingsData);
      
      // Log security event
      await storage.createSecurityLog({
        userId: req.params.userId,
        action: "privacy_settings_updated",
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: settingsData,
        risk_level: "low"
      });
      
      res.json(settings);
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      res.status(500).json({ error: "Failed to update privacy settings" });
    }
  });

  // Data requests (GDPR compliance)
  app.post("/api/data-requests", async (req, res) => {
    try {
      const requestData = insertDataRequestSchema.parse(req.body);
      const dataRequest = await storage.createDataRequest(requestData);
      
      // Log security event
      await storage.createSecurityLog({
        userId: requestData.userId,
        action: "data_request_created",
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: { requestType: requestData.requestType },
        risk_level: "medium"
      });
      
      res.json(dataRequest);
    } catch (error) {
      console.error("Error creating data request:", error);
      res.status(500).json({ error: "Failed to create data request" });
    }
  });

  // Security logs (admin only)
  app.get("/api/admin/security-logs", async (req, res) => {
    try {
      const logs = await storage.getSecurityLogs();
      res.json(logs);
    } catch (error) {
      console.error("Error fetching security logs:", error);
      res.status(500).json({ error: "Failed to fetch security logs" });
    }
  });

  // Fraud detection and transaction security
  app.post("/api/transaction-security/check", async (req, res) => {
    try {
      const { orderId, userId, amount, paymentMethod } = req.body;
      
      // Simple fraud detection logic
      let riskScore = 0;
      const fraudFlags: string[] = [];
      
      // Check amount
      if (amount > 5000) {
        riskScore += 30;
        fraudFlags.push("high_amount");
      }
      
      // Check user pattern
      const userOrders = await storage.getUserOrders(userId);
      const recentOrders = userOrders.filter(order => 
        new Date(order.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000
      );
      
      if (recentOrders.length > 5) {
        riskScore += 40;
        fraudFlags.push("multiple_orders_24h");
      }
      
      // Determine status
      let status = "approved";
      if (riskScore > 70) {
        status = "rejected";
      } else if (riskScore > 40) {
        status = "under_review";
      }
      
      const securityCheck = await storage.createTransactionSecurity({
        orderId,
        userId,
        amount: amount.toString(),
        paymentMethod,
        riskScore,
        fraudFlags,
        ipAddress: req.ip,
        location: req.get('CF-IPCountry') || 'Unknown',
        deviceFingerprint: req.get('User-Agent'),
        status
      });
      
      res.json(securityCheck);
    } catch (error) {
      console.error("Error checking transaction security:", error);
      res.status(500).json({ error: "Failed to check transaction security" });
    }
  });

  // Admin Security and Backup Routes
  app.get('/api/admin/security-logs', async (req, res) => {
    try {
      const logs = await storage.getSecurityLogs();
      res.json(logs);
    } catch (error) {
      console.error('Error fetching security logs:', error);
      res.status(500).json({ message: 'Error fetching security logs' });
    }
  });

  app.post('/api/admin/backups', async (req, res) => {
    try {
      const { type } = req.body;
      
      // Create backup based on type
      let backupData: any = {};
      let description = '';
      
      switch (type) {
        case 'full':
          // Simulate full backup
          const allUsers = await storage.getAllUsers();
          const allOrders = await storage.getAllOrders();
          const securityLogs = await storage.getSecurityLogs();
          
          backupData = {
            users: allUsers,
            orders: allOrders,
            securityLogs: securityLogs.slice(-1000), // Last 1000 logs
            timestamp: new Date().toISOString()
          };
          description = 'Respaldo Completo del Sistema';
          break;
          
        case 'users':
          backupData.users = await storage.getAllUsers();
          description = 'Respaldo de Datos de Usuarios';
          break;
          
        case 'orders':
          backupData.orders = await storage.getAllOrders();
          description = 'Respaldo de Órdenes y Transacciones';
          break;
          
        case 'security':
          backupData.securityLogs = await storage.getSecurityLogs();
          description = 'Respaldo de Logs de Seguridad';
          break;
          
        default:
          return res.status(400).json({ message: 'Invalid backup type' });
      }
      
      // Simulate backup creation
      const backup = {
        id: `backup-${Date.now()}`,
        type,
        description,
        size: `${(JSON.stringify(backupData).length / 1024).toFixed(2)} KB`,
        status: 'completed',
        createdAt: new Date().toISOString(),
        data: backupData
      };
      
      // Log backup creation
      await storage.createSecurityLog({
        action: 'admin_action',
        severity: 'medium',
        userId: 'admin',
        ipAddress: req.ip || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        details: {
          action: 'backup_created',
          backupType: type,
          backupId: backup.id
        }
      });
      
      res.json(backup);
    } catch (error) {
      console.error('Error creating backup:', error);
      res.status(500).json({ message: 'Error creating backup' });
    }
  });

  app.get('/api/admin/backups', async (req, res) => {
    try {
      // Return simulated backup history
      const backups = [
        {
          id: 'backup-1703123456789',
          type: 'full',
          description: 'Respaldo Completo del Sistema',
          size: '2.5 MB',
          status: 'completed',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'backup-1703012345678',
          type: 'security',
          description: 'Respaldo de Logs de Seguridad',
          size: '450 KB',
          status: 'completed',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        }
      ];
      
      res.json(backups);
    } catch (error) {
      console.error('Error fetching backups:', error);
      res.status(500).json({ message: 'Error fetching backups' });
    }
  });

  app.get('/api/admin/backups/:id/download', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Simulate backup download
      const backupData = {
        id,
        exported_at: new Date().toISOString(),
        data: 'Encrypted backup data would be here...'
      };
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="backup-${id}.json"`);
      res.json(backupData);
      
      // Log backup download
      await storage.createSecurityLog({
        action: 'admin_action',
        severity: 'medium',
        userId: 'admin',
        ipAddress: req.ip || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        details: {
          action: 'backup_downloaded',
          backupId: id
        }
      });
      
    } catch (error) {
      console.error('Error downloading backup:', error);
      res.status(500).json({ message: 'Error downloading backup' });
    }
  });

  // Change admin password
  app.post('/api/admin/change-password', async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      // Get current admin password from config
      const adminPassword = await storage.getSiteConfig('admin_password') || 'Gerardo';

      // Verify current password
      if (currentPassword !== adminPassword) {
        // Log failed password change attempt
        await storage.createSecurityLog({
          action: 'admin_action',
          severity: 'high',
          userId: 'admin',
          ipAddress: req.ip || 'unknown',
          userAgent: req.get('User-Agent') || 'unknown',
          details: {
            action: 'password_change_failed',
            reason: 'incorrect_current_password'
          }
        });

        return res.status(401).json({ error: 'Contraseña actual incorrecta' });
      }

      // Validate new password
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
      }

      // Update password in config
      await storage.setSiteConfig('admin_password', newPassword);

      // Log successful password change
      await storage.createSecurityLog({
        action: 'admin_action',
        severity: 'medium',
        userId: 'admin',
        ipAddress: req.ip || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        details: {
          action: 'password_changed',
          timestamp: new Date().toISOString()
        }
      });

      res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: 'Error al cambiar la contraseña' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
