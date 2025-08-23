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
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
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
