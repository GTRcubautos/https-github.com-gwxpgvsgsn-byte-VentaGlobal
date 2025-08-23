import { 
  type User, type InsertUser,
  type Product, type InsertProduct,
  type Order, type InsertOrder,
  type RewardsConfig, type InsertRewardsConfig,
  type GameResult, type InsertGameResult,
  type CampaignConfig, type InsertCampaignConfig
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Products
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getAllProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;
  searchProducts(query: string, category?: string): Promise<Product[]>;

  // Orders
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;

  // Rewards
  getRewardsConfig(): Promise<RewardsConfig | undefined>;
  updateRewardsConfig(config: InsertRewardsConfig): Promise<RewardsConfig>;
  createGameResult(result: InsertGameResult): Promise<GameResult>;
  getGameResultsByUser(userId: string): Promise<GameResult[]>;

  // Campaigns
  getCampaignConfig(id: string): Promise<CampaignConfig | undefined>;
  getAllCampaigns(): Promise<CampaignConfig[]>;
  createCampaign(campaign: InsertCampaignConfig): Promise<CampaignConfig>;
  updateCampaign(id: string, updates: Partial<CampaignConfig>): Promise<CampaignConfig | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private products: Map<string, Product> = new Map();
  private orders: Map<string, Order> = new Map();
  private rewardsConfig: RewardsConfig | null = null;
  private gameResults: Map<string, GameResult> = new Map();
  private campaigns: Map<string, CampaignConfig> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize rewards config
    this.rewardsConfig = {
      id: randomUUID(),
      pointsPerVisit: 10,
      pointsPerPurchase: 50,
      pointsPerShare: 25,
      pointValue: "0.01",
      isActive: true,
    };

    // Initialize sample products
    const sampleProducts: InsertProduct[] = [
      {
        name: "Smartphone Premium",
        description: "Latest flagship smartphone with advanced features",
        category: "electronics",
        retailPrice: "299.99",
        wholesalePrice: "249.99",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        specs: { brand: "TechBrand", storage: "128GB", ram: "8GB" },
        isActive: true,
      },
      {
        name: "Laptop Gaming",
        description: "High-performance gaming laptop",
        category: "electronics",
        retailPrice: "899.99",
        wholesalePrice: "749.99",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        specs: { processor: "Intel i7", gpu: "RTX 3060", ram: "16GB" },
        isActive: true,
      },
      {
        name: "Auto Deportivo 2023",
        description: "Sleek sports car with V8 engine",
        category: "cars",
        retailPrice: "45999.00",
        wholesalePrice: "42999.00",
        imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        specs: { engine: "V8", horsepower: "450HP", transmission: "Automatic" },
        isActive: true,
      },
      {
        name: "Moto Deportiva 600cc",
        description: "High-performance sport motorcycle",
        category: "motorcycles",
        retailPrice: "12999.00",
        wholesalePrice: "11499.00",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        specs: { displacement: "600cc", horsepower: "120HP", gears: "6" },
        isActive: true,
      },
    ];

    sampleProducts.forEach(product => {
      const id = randomUUID();
      this.products.set(id, { ...product, id, createdAt: new Date() });
    });

    // Initialize sample campaign
    const sampleCampaign: InsertCampaignConfig = {
      name: "Productos Tecnológicos 2024",
      platform: "youtube",
      dailyBudget: "100.00",
      targetAudience: "Tecnología",
      status: "active",
      metrics: { views: 12450, ctr: 3.2, conversions: 45 },
    };

    const campaignId = randomUUID();
    this.campaigns.set(campaignId, { ...sampleCampaign, id: campaignId, createdAt: new Date() });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Product methods
  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => 
      product.category === category && product.isActive
    );
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.isActive);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id, createdAt: new Date() };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async searchProducts(query: string, category?: string): Promise<Product[]> {
    const products = Array.from(this.products.values()).filter(product => product.isActive);
    
    return products.filter(product => {
      const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) ||
                          (product.description && product.description.toLowerCase().includes(query.toLowerCase()));
      const matchesCategory = !category || product.category === category;
      
      return matchesQuery && matchesCategory;
    });
  }

  // Order methods
  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { ...insertOrder, id, createdAt: new Date() };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...updates };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  // Rewards methods
  async getRewardsConfig(): Promise<RewardsConfig | undefined> {
    return this.rewardsConfig || undefined;
  }

  async updateRewardsConfig(config: InsertRewardsConfig): Promise<RewardsConfig> {
    const id = this.rewardsConfig?.id || randomUUID();
    this.rewardsConfig = { ...config, id };
    return this.rewardsConfig;
  }

  async createGameResult(insertResult: InsertGameResult): Promise<GameResult> {
    const id = randomUUID();
    const result: GameResult = { ...insertResult, id, createdAt: new Date() };
    this.gameResults.set(id, result);
    return result;
  }

  async getGameResultsByUser(userId: string): Promise<GameResult[]> {
    return Array.from(this.gameResults.values()).filter(result => result.userId === userId);
  }

  // Campaign methods
  async getCampaignConfig(id: string): Promise<CampaignConfig | undefined> {
    return this.campaigns.get(id);
  }

  async getAllCampaigns(): Promise<CampaignConfig[]> {
    return Array.from(this.campaigns.values());
  }

  async createCampaign(insertCampaign: InsertCampaignConfig): Promise<CampaignConfig> {
    const id = randomUUID();
    const campaign: CampaignConfig = { ...insertCampaign, id, createdAt: new Date() };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async updateCampaign(id: string, updates: Partial<CampaignConfig>): Promise<CampaignConfig | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const updatedCampaign = { ...campaign, ...updates };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }
}

export const storage = new MemStorage();
