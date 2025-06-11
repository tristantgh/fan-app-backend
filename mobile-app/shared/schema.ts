import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real, uuid, varchar, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Custom TypeScript interfaces
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface UserPreferences {
  emailNotifications: boolean;
  newReleaseAlerts: boolean;
  tourAlerts: boolean;
  merchandiseAlerts: boolean;
  newsletterSubscription: boolean;
  darkMode: boolean;
  language: string;
}

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  profileImageUrl: text("profile_image_url"),
  bio: text("bio"),
  isAdmin: boolean("is_admin").default(false),
  isModerator: boolean("is_moderator").default(false),
  isVerified: boolean("is_verified").default(false),
  verificationToken: text("verification_token"),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  membershipTier: text("membership_tier").default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("inactive"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  shippingAddresses: jsonb("shipping_addresses").$type<ShippingAddress[]>(),
  preferences: jsonb("preferences").$type<UserPreferences>(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  location: true,
  profileImageUrl: true,
  bio: true,
  membershipTier: true,
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  username: text("username").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  isModerator: boolean("is_moderator").default(false),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  username: true,
  content: true,
  isModerator: true,
});

// Announcements table
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: timestamp("date").defaultNow(),
  category: text("category").notNull(),
  isPinned: boolean("is_pinned").default(false),
});

export const insertAnnouncementSchema = createInsertSchema(announcements).pick({
  title: true,
  content: true,
  category: true,
  isPinned: true,
});

// Merchandise table
export const merchItems = pgTable("merch_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  inStock: boolean("in_stock").default(true),
  addedDate: timestamp("added_date").defaultNow(),
  sortOrder: integer("sort_order").default(0),
  isLimited: boolean("is_limited").default(false),
});

export const insertMerchItemSchema = createInsertSchema(merchItems).pick({
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  category: true,
  inStock: true,
  sortOrder: true,
  isLimited: true,
});

// Shows/Concerts table
export const shows = pgTable("shows", {
  id: serial("id").primaryKey(),
  venue: text("venue").notNull(),
  location: text("location").notNull(),
  date: timestamp("date").notNull(),
  imageUrl: text("image_url").notNull(),
  ticketUrl: text("ticket_url").notNull(),
  ticketStatus: text("ticket_status").notNull(),
  region: text("region").notNull(),
  description: text("description"),
});

export const insertShowSchema = createInsertSchema(shows).pick({
  venue: true,
  location: true,
  date: true,
  imageUrl: true,
  ticketUrl: true,
  ticketStatus: true,
  region: true,
  description: true,
});

// Behind the scenes content
export const btsContent = pgTable("bts_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  date: timestamp("date").defaultNow(),
  videoUrl: text("video_url"),
  fullContent: text("full_content"),
});

export const insertBtsContentSchema = createInsertSchema(btsContent).pick({
  title: true,
  description: true,
  category: true,
  imageUrl: true,
  videoUrl: true,
  fullContent: true,
});

// Unreleased music
export const unreleasedTracks = pgTable("unreleased_tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  audioUrl: text("audio_url").notNull(),
  duration: real("duration").notNull(),
  category: text("category").notNull(),
  releaseStatus: text("release_status").notNull(),
  createdDate: timestamp("created_date").defaultNow(),
});

export const insertUnreleasedTrackSchema = createInsertSchema(unreleasedTracks).pick({
  title: true,
  description: true,
  audioUrl: true,
  duration: true,
  category: true,
  releaseStatus: true,
});

// Discount codes
export const discountCodes = pgTable("discount_codes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  code: text("code").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  expiryDate: timestamp("expiry_date").notNull(),
  discountAmount: text("discount_amount").notNull(),
  minimumPurchase: real("minimum_purchase"),
});

export const insertDiscountCodeSchema = createInsertSchema(discountCodes).pick({
  title: true,
  code: true,
  type: true,
  description: true,
  expiryDate: true,
  discountAmount: true,
  minimumPurchase: true,
});

// Leaderboard data
export const leaderboardItems = pgTable("leaderboard_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  username: text("username").notNull(),
  type: text("type").notNull(), // "merch", "streams", "shows", "referrals"
  value: real("value").notNull(),
  timeframe: text("timeframe").notNull(), // "all-time", "this-month", "this-week"
});

export const insertLeaderboardItemSchema = createInsertSchema(leaderboardItems).pick({
  userId: true,
  username: true,
  type: true,
  value: true,
  timeframe: true,
});

// Support tickets
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  orderId: text("order_id"),
  status: text("status").default("open").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).pick({
  email: true,
  subject: true,
  category: true,
  description: true,
  orderId: true,
});

// Membership perks
export const perks = pgTable("perks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull(),
  membershipTier: text("membership_tier").notNull(),
  isFeatured: boolean("is_featured").default(false),
});

export const insertPerkSchema = createInsertSchema(perks).pick({
  title: true,
  description: true,
  iconName: true,
  membershipTier: true,
  isFeatured: true,
});

// Membership tiers
export const membershipTiers = pgTable("membership_tiers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  period: text("period").notNull(),
  description: text("description").notNull(),
  features: jsonb("features").notNull().$type<string[]>(),
  isPopular: boolean("is_popular").default(false),
});

export const insertMembershipTierSchema = createInsertSchema(membershipTiers).pick({
  id: true,
  name: true,
  price: true,
  period: true,
  description: true,
  features: true,
  isPopular: true,
});

// Resources
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: text("file_size").notNull(),
  category: text("category").notNull(),
  isFeatured: boolean("is_featured").default(false),
  thumbnailUrl: text("thumbnail_url"),
});

export const insertResourceSchema = createInsertSchema(resources).pick({
  title: true,
  description: true,
  fileUrl: true,
  fileType: true,
  fileSize: true,
  category: true,
  isFeatured: true,
  thumbnailUrl: true,
});

// E-commerce: Shopping Cart
export const carts = pgTable("carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  status: text("status").default("active").notNull(), // active, abandoned, completed
});

export const insertCartSchema = createInsertSchema(carts).pick({
  userId: true,
  sessionId: true,
  status: true,
});

// E-commerce: Cart Items
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: uuid("cart_id").notNull().references(() => carts.id, { onDelete: 'cascade' }),
  productId: integer("product_id").notNull().references(() => merchItems.id),
  quantity: integer("quantity").notNull().default(1),
  size: text("size"),
  color: text("color"),
  addedAt: timestamp("added_at").defaultNow(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  cartId: true,
  productId: true,
  quantity: true,
  size: true,
  color: true,
});

// E-commerce: Product Variants (sizes, colors)
export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => merchItems.id, { onDelete: 'cascade' }),
  size: text("size"),
  color: text("color"),
  sku: text("sku").notNull().unique(),
  price: real("price").notNull(),
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url"),
});

export const insertProductVariantSchema = createInsertSchema(productVariants).pick({
  productId: true,
  size: true,
  color: true,
  sku: true,
  price: true,
  stock: true,
  imageUrl: true,
});

// E-commerce: Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  email: text("email").notNull(),
  totalAmount: real("total_amount").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled
  shippingAddress: jsonb("shipping_address").notNull(),
  billingAddress: jsonb("billing_address").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, completed, failed, refunded
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  discountCode: text("discount_code"),
  discountAmount: real("discount_amount").default(0),
  shippingCost: real("shipping_cost").default(0),
  taxAmount: real("tax_amount").default(0),
  trackingNumber: text("tracking_number"),
  notes: text("notes"),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  email: true,
  totalAmount: true,
  status: true,
  shippingAddress: true,
  billingAddress: true,
  paymentMethod: true,
  paymentStatus: true,
  discountCode: true,
  discountAmount: true,
  shippingCost: true,
  taxAmount: true,
  trackingNumber: true,
  notes: true,
});

// E-commerce: Order Items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: integer("product_id").notNull().references(() => merchItems.id),
  variantId: integer("variant_id").references(() => productVariants.id),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
  name: text("name").notNull(),
  size: text("size"),
  color: text("color"),
  subtotal: real("subtotal").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  variantId: true,
  quantity: true,
  price: true,
  name: true,
  size: true,
  color: true,
  subtotal: true,
});

// User Streaming Platform Connections
export const streamingAccounts = pgTable("streaming_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  platform: text("platform").notNull(), // spotify, apple_music, tidal, etc.
  accountId: text("account_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  lastSynced: timestamp("last_synced"),
  isActive: boolean("is_active").default(true),
  username: text("username"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStreamingAccountSchema = createInsertSchema(streamingAccounts).pick({
  userId: true,
  platform: true,
  accountId: true,
  accessToken: true,
  refreshToken: true,
  tokenExpiry: true,
  isActive: true,
  username: true,
});

// User Streaming Activity
export const streamingActivity = pgTable("streaming_activity", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  streamingAccountId: integer("streaming_account_id").references(() => streamingAccounts.id),
  trackName: text("track_name").notNull(),
  artistName: text("artist_name").notNull(),
  platform: text("platform").notNull(),
  playCount: integer("play_count").notNull(),
  lastPlayed: timestamp("last_played"),
  totalPlayTime: integer("total_play_time"), // in seconds
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// Types for export
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

export type InsertMerchItem = z.infer<typeof insertMerchItemSchema>;
export type MerchItem = typeof merchItems.$inferSelect;

export type InsertShow = z.infer<typeof insertShowSchema>;
export type Show = typeof shows.$inferSelect;

export type InsertBtsContent = z.infer<typeof insertBtsContentSchema>;
export type BtsContent = typeof btsContent.$inferSelect;

export type InsertUnreleasedTrack = z.infer<typeof insertUnreleasedTrackSchema>;
export type UnreleasedTrack = typeof unreleasedTracks.$inferSelect;

export type InsertDiscountCode = z.infer<typeof insertDiscountCodeSchema>;
export type DiscountCode = typeof discountCodes.$inferSelect;

export type InsertLeaderboardItem = z.infer<typeof insertLeaderboardItemSchema>;
export type LeaderboardItem = typeof leaderboardItems.$inferSelect;

export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;

export type InsertPerk = z.infer<typeof insertPerkSchema>;
export type Perk = typeof perks.$inferSelect;

export type InsertMembershipTier = z.infer<typeof insertMembershipTierSchema>;
export type MembershipTier = typeof membershipTiers.$inferSelect;

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

// E-commerce types
export type InsertCart = z.infer<typeof insertCartSchema>;
export type Cart = typeof carts.$inferSelect;

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export type InsertProductVariant = z.infer<typeof insertProductVariantSchema>;
export type ProductVariant = typeof productVariants.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// Streaming platform integration types
export type InsertStreamingAccount = z.infer<typeof insertStreamingAccountSchema>;
export type StreamingAccount = typeof streamingAccounts.$inferSelect;

export type StreamingActivity = typeof streamingActivity.$inferSelect;
