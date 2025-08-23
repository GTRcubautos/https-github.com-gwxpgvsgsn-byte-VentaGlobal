import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  userType: text("user_type").notNull().default("retail"), // retail, wholesale, admin
  points: integer("points").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // electronics, cars, motorcycles
  retailPrice: decimal("retail_price", { precision: 10, scale: 2 }).notNull(),
  wholesalePrice: decimal("wholesale_price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  specs: jsonb("specs"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  items: jsonb("items").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(), // card, zelle, paypal
  status: text("status").notNull().default("pending"), // pending, completed, cancelled
  pointsEarned: integer("points_earned").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const rewardsConfig = pgTable("rewards_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pointsPerVisit: integer("points_per_visit").notNull().default(10),
  pointsPerPurchase: integer("points_per_purchase").notNull().default(50),
  pointsPerShare: integer("points_per_share").notNull().default(25),
  pointValue: decimal("point_value", { precision: 5, scale: 3 }).notNull().default("0.01"),
  isActive: boolean("is_active").notNull().default(true),
});

export const gameResults = pgTable("game_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  gameType: text("game_type").notNull(), // trivia, roulette, puzzle
  pointsEarned: integer("points_earned").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const campaignConfig = pgTable("campaign_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  platform: text("platform").notNull().default("youtube"),
  dailyBudget: decimal("daily_budget", { precision: 8, scale: 2 }).notNull(),
  targetAudience: text("target_audience").notNull(),
  status: text("status").notNull().default("active"), // active, paused, completed
  metrics: jsonb("metrics"),
  isAutomated: boolean("is_automated").notNull().default(false),
  scheduleTime: text("schedule_time"), // cron format
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Social Media Posts
export const socialPosts = pgTable("social_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull(), // facebook, instagram, twitter, whatsapp
  content: text("content").notNull(),
  mediaUrls: jsonb("media_urls"),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  status: text("status").notNull().default("draft"), // draft, scheduled, published, failed
  engagement: jsonb("engagement"), // likes, shares, comments
  campaignId: varchar("campaign_id").references(() => campaignConfig.id),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Customer Relationship Management
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  address: jsonb("address"),
  preferences: jsonb("preferences"),
  segment: text("segment").default("regular"), // vip, regular, wholesale
  lifetimeValue: decimal("lifetime_value", { precision: 10, scale: 2 }).default("0.00"),
  lastContactDate: timestamp("last_contact_date"),
  source: text("source"), // website, social, referral
  notes: text("notes"),
  tags: jsonb("tags"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Security Logs
export const securityLogs = pgTable("security_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(), // login, logout, failed_login, data_access
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  location: text("location"),
  risk_level: text("risk_level").default("low"), // low, medium, high
  details: jsonb("details"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Payment Processing
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id),
  customerId: varchar("customer_id").references(() => customers.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  method: text("method").notNull(), // card, zelle, paypal, stripe
  status: text("status").notNull().default("pending"), // pending, completed, failed, refunded
  transactionId: text("transaction_id"),
  gatewayResponse: jsonb("gateway_response"),
  fees: decimal("fees", { precision: 8, scale: 2 }).default("0.00"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Inventory Management
export const inventory = pgTable("inventory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id),
  sku: text("sku").notNull().unique(),
  quantity: integer("quantity").notNull().default(0),
  reservedQuantity: integer("reserved_quantity").notNull().default(0),
  minStockLevel: integer("min_stock_level").default(10),
  maxStockLevel: integer("max_stock_level").default(1000),
  location: text("location"),
  lastRestocked: timestamp("last_restocked"),
  supplier: text("supplier"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Analytics & Metrics
export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metric: text("metric").notNull(), // page_views, conversions, revenue, cart_abandonment
  value: decimal("value", { precision: 15, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  dimensions: jsonb("dimensions"), // additional context data
  source: text("source"), // web, mobile, api
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Website Configuration
export const siteConfig = pgTable("site_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  category: text("category").default("general"), // general, security, payments, social
  isPublic: boolean("is_public").default(false),
  description: text("description"),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertRewardsConfigSchema = createInsertSchema(rewardsConfig).omit({
  id: true,
});

export const insertGameResultSchema = createInsertSchema(gameResults).omit({
  id: true,
  createdAt: true,
});

export const insertCampaignConfigSchema = createInsertSchema(campaignConfig).omit({
  id: true,
  createdAt: true,
});

export const insertSocialPostSchema = createInsertSchema(socialPosts).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
});

export const insertSecurityLogSchema = createInsertSchema(securityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  updatedAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

export const insertSiteConfigSchema = createInsertSchema(siteConfig).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type RewardsConfig = typeof rewardsConfig.$inferSelect;
export type InsertRewardsConfig = z.infer<typeof insertRewardsConfigSchema>;

export type GameResult = typeof gameResults.$inferSelect;
export type InsertGameResult = z.infer<typeof insertGameResultSchema>;

export type CampaignConfig = typeof campaignConfig.$inferSelect;
export type InsertCampaignConfig = z.infer<typeof insertCampaignConfigSchema>;

export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type SecurityLog = typeof securityLogs.$inferSelect;
export type InsertSecurityLog = z.infer<typeof insertSecurityLogSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;

export type SiteConfig = typeof siteConfig.$inferSelect;
export type InsertSiteConfig = z.infer<typeof insertSiteConfigSchema>;
