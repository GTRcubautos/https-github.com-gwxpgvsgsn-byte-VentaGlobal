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
  platforms: jsonb("platforms").notNull(), // Array of platform IDs
  dailyBudget: decimal("daily_budget", { precision: 8, scale: 2 }).notNull(),
  targetAudience: text("target_audience").notNull(),
  status: text("status").notNull().default("active"), // active, paused, completed
  automationType: text("automation_type").notNull().default("manual"), // scheduled, triggered, content_based, manual
  contentTemplate: text("content_template"),
  triggers: jsonb("triggers"), // Automation triggers
  schedule: jsonb("schedule"), // Schedule settings
  metrics: jsonb("metrics"),
  isAutomated: boolean("is_automated").notNull().default(false),
  scheduleTime: text("schedule_time"), // cron format
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Social Media Posts
export const socialPosts = pgTable("social_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platforms: jsonb("platforms").notNull(), // Array of platform IDs
  content: text("content").notNull(),
  hashtags: jsonb("hashtags"), // Array of hashtags
  mentions: jsonb("mentions"), // Array of mentions
  mediaUrls: jsonb("media_urls"),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  status: text("status").notNull().default("draft"), // draft, scheduled, published, failed, publishing
  postType: text("post_type").notNull().default("manual"), // manual, automated, template, recurring
  automation: jsonb("automation"), // Automation settings
  engagement: jsonb("engagement"), // likes, shares, comments, views
  campaignId: varchar("campaign_id").references(() => campaignConfig.id),
  templateId: varchar("template_id"),
  productId: varchar("product_id").references(() => products.id),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Content Templates for automated posting
export const contentTemplates = pgTable("content_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // product, promotion, news, engagement
  content: text("content").notNull(),
  variables: jsonb("variables").notNull(), // Array of variable names
  platforms: jsonb("platforms").notNull(), // Array of platform IDs
  mediaRequired: boolean("media_required").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
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

// Wholesale codes management
export const wholesaleCodes = pgTable("wholesale_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at"),
  maxUses: integer("max_uses"),
  currentUses: integer("current_uses").default(0).notNull(),
  discountPercent: integer("discount_percent").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Inventory management
export const inventoryItems = pgTable("inventory_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(), // 'cars', 'motorcycles', 'electronics'
  sku: varchar("sku", { length: 100 }).unique(),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }).notNull(),
  retailPrice: decimal("retail_price", { precision: 10, scale: 2 }).notNull(),
  wholesalePrice: decimal("wholesale_price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0).notNull(),
  minStock: integer("min_stock").default(0).notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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

export const insertContentTemplateSchema = createInsertSchema(contentTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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

export const insertWholesaleCodeSchema = createInsertSchema(wholesaleCodes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
  createdAt: true,
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

export type ContentTemplate = typeof contentTemplates.$inferSelect;
export type InsertContentTemplate = z.infer<typeof insertContentTemplateSchema>;

export type WholesaleCode = typeof wholesaleCodes.$inferSelect;
export type InsertWholesaleCode = z.infer<typeof insertWholesaleCodeSchema>;

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;

// Sistema de Consentimientos y Políticas de Privacidad
export const userConsents = pgTable("user_consents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  email: varchar("email"),
  consentType: varchar("consent_type").notNull(), // privacy_policy, terms_service, cookies, marketing
  consentVersion: varchar("consent_version").notNull(),
  granted: boolean("granted").default(false),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  grantedAt: timestamp("granted_at").defaultNow(),
  revokedAt: timestamp("revoked_at"),
});

// Respaldos de Datos
export const dataBackups = pgTable("data_backups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  backupType: varchar("backup_type").notNull(), // full, incremental, user_data
  status: varchar("status").default("pending"), // pending, in_progress, completed, failed
  filePath: varchar("file_path"),
  fileSize: integer("file_size"),
  checksum: varchar("checksum"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  expiresAt: timestamp("expires_at"),
});

// Configuración de Privacidad del Usuario
export const userPrivacySettings = pgTable("user_privacy_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").unique().notNull().references(() => users.id),
  allowMarketing: boolean("allow_marketing").default(false),
  allowAnalytics: boolean("allow_analytics").default(true),
  allowCookies: boolean("allow_cookies").default(true),
  dataRetentionDays: integer("data_retention_days").default(365),
  allowDataExport: boolean("allow_data_export").default(true),
  allowDataDeletion: boolean("allow_data_deletion").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Seguridad Financiera y Transacciones
export const transactionSecurity = pgTable("transaction_security", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id),
  userId: varchar("user_id").references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD"),
  paymentMethod: varchar("payment_method"),
  riskScore: integer("risk_score").default(0), // 0-100
  fraudFlags: text("fraud_flags").array(),
  ipAddress: varchar("ip_address"),
  location: varchar("location"),
  deviceFingerprint: varchar("device_fingerprint"),
  status: varchar("status").default("pending"), // pending, approved, rejected, under_review
  reviewedBy: varchar("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Límites de Transacciones
export const transactionLimits = pgTable("transaction_limits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  userType: varchar("user_type").default("retail"), // retail, wholesale, vip
  dailyLimit: decimal("daily_limit", { precision: 10, scale: 2 }).default("1000.00"),
  monthlyLimit: decimal("monthly_limit", { precision: 10, scale: 2 }).default("10000.00"),
  singleTransactionLimit: decimal("single_transaction_limit", { precision: 10, scale: 2 }).default("500.00"),
  currentDailySpent: decimal("current_daily_spent", { precision: 10, scale: 2 }).default("0.00"),
  currentMonthlySpent: decimal("current_monthly_spent", { precision: 10, scale: 2 }).default("0.00"),
  lastResetDate: timestamp("last_reset_date").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Políticas de Privacidad y Términos (versiones)
export const privacyPolicies = pgTable("privacy_policies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  version: varchar("version").notNull().unique(),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  isActive: boolean("is_active").default(false),
  effectiveDate: timestamp("effective_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Solicitudes de datos (GDPR compliance)
export const dataRequests = pgTable("data_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  requestType: varchar("request_type").notNull(), // export, delete, update
  status: varchar("status").default("pending"), // pending, processing, completed, rejected
  requestData: jsonb("request_data"),
  responseData: jsonb("response_data"),
  processedBy: varchar("processed_by"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas de inserción para las nuevas tablas
export const insertUserConsentSchema = createInsertSchema(userConsents).omit({
  id: true,
  grantedAt: true,
});

export const insertDataBackupSchema = createInsertSchema(dataBackups).omit({
  id: true,
  createdAt: true,
});

export const insertUserPrivacySettingsSchema = createInsertSchema(userPrivacySettings).omit({
  id: true,
  updatedAt: true,
});

export const insertTransactionSecuritySchema = createInsertSchema(transactionSecurity).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionLimitSchema = createInsertSchema(transactionLimits).omit({
  id: true,
  lastResetDate: true,
  updatedAt: true,
});

export const insertPrivacyPolicySchema = createInsertSchema(privacyPolicies).omit({
  id: true,
  createdAt: true,
});

export const insertDataRequestSchema = createInsertSchema(dataRequests).omit({
  id: true,
  createdAt: true,
});

// Tipos para las nuevas tablas
export type UserConsent = typeof userConsents.$inferSelect;
export type InsertUserConsent = z.infer<typeof insertUserConsentSchema>;

export type DataBackup = typeof dataBackups.$inferSelect;
export type InsertDataBackup = z.infer<typeof insertDataBackupSchema>;

export type UserPrivacySettings = typeof userPrivacySettings.$inferSelect;
export type InsertUserPrivacySettings = z.infer<typeof insertUserPrivacySettingsSchema>;

export type TransactionSecurity = typeof transactionSecurity.$inferSelect;
export type InsertTransactionSecurity = z.infer<typeof insertTransactionSecuritySchema>;

export type TransactionLimit = typeof transactionLimits.$inferSelect;
export type InsertTransactionLimit = z.infer<typeof insertTransactionLimitSchema>;

export type PrivacyPolicy = typeof privacyPolicies.$inferSelect;
export type InsertPrivacyPolicy = z.infer<typeof insertPrivacyPolicySchema>;

export type DataRequest = typeof dataRequests.$inferSelect;
export type InsertDataRequest = z.infer<typeof insertDataRequestSchema>;
