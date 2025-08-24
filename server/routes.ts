import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertGameResultSchema, insertRewardsConfigSchema, insertCampaignConfigSchema, insertSocialPostSchema, insertContentTemplateSchema } from "@shared/schema";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Orders routes
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      
      // For card payments, we'll handle confirmation via Stripe webhooks
      // For now, allow orders to be created in pending status
      
      const order = await storage.createOrder(orderData);
      
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

  app.get("/api/admin/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
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

  const httpServer = createServer(app);
  return httpServer;
}
