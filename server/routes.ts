import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertGameResultSchema, insertRewardsConfigSchema, insertCampaignConfigSchema } from "@shared/schema";

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

  // Orders routes
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
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

  const httpServer = createServer(app);
  return httpServer;
}
