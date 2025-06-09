import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  line: text("line"),
  imageUrl: text("image_url").notNull(),
  altImageUrl: text("alt_image_url"),
  description: text("description"),
  inStock: boolean("in_stock").default(true),
  stock: integer("stock").default(0),
  lowStockThreshold: integer("low_stock_threshold").default(10),
  sizes: text("sizes"), // JSON array of sizes
  colors: text("colors"), // JSON array of colors
  materials: text("materials"), // JSON array of materials
  images: text("images"), // JSON array of image URLs
  coverImageIndex: integer("cover_image_index").default(0),
  hasVariants: boolean("has_variants").default(false),
});

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  sku: text("sku").notNull().unique(),
  size: text("size"),
  color: text("color"),
  material: text("material"),
  price: decimal("price", { precision: 10, scale: 2 }),
  stock: integer("stock").default(0),
  lowStockThreshold: integer("low_stock_threshold").default(10),
  isActive: boolean("is_active").default(true),
});

export const discounts = pgTable("discounts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'percentage', 'fixed_amount'
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  applicationType: text("application_type").notNull(), // 'product', 'category', 'global'
  targetProductIds: text("target_product_ids"), // JSON array for specific products
  targetCategories: text("target_categories"), // JSON array for categories
  minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }),
  maxDiscountAmount: decimal("max_discount_amount", { precision: 10, scale: 2 }),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  discountId: integer("discount_id").references(() => discounts.id).notNull(),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  trackingNumber: text("tracking_number"),
  logisticsProvider: text("logistics_provider"), // delhivery, shiprocket, etc.
  deliveryStatus: text("delivery_status"), // in_progress, shipped, out_for_delivery, delivered, failed
  estimatedDelivery: text("estimated_delivery"),
  actualDelivery: text("actual_delivery"),
  shippingAddress: text("shipping_address"), // JSON object
  billingAddress: text("billing_address"), // JSON object
  paymentMethod: text("payment_method"),
  items: text("items"), // JSON array of order items
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  variantId: integer("variant_id").references(() => productVariants.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  size: text("size"),
  color: text("color"),
});

export const deliveryTracking = pgTable("delivery_tracking", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  status: text("status").notNull(),
  location: text("location"),
  timestamp: text("timestamp").notNull(),
  description: text("description"),
  logisticsProvider: text("logistics_provider"),
  trackingData: text("tracking_data"), // Raw API response JSON
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // order_update, low_stock, new_order
  title: text("title").notNull(),
  message: text("message").notNull(),
  userId: text("user_id"), // null for admin notifications
  isRead: boolean("is_read").default(false),
  data: text("data"), // JSON object with additional data
  createdAt: text("created_at").notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // complaint, inquiry, suggestion, exchange
  priority: text("priority").notNull().default("medium"), // low, medium, high
  status: text("status").notNull().default("unresolved"), // unresolved, in_progress, resolved
  orderId: text("order_id"),
  responses: text("responses"), // JSON array of responses
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const salesReports = pgTable("sales_reports", {
  id: serial("id").primaryKey(),
  reportType: text("report_type").notNull(), // 'daily', 'weekly', 'monthly'
  reportDate: text("report_date").notNull(),
  totalSales: decimal("total_sales", { precision: 10, scale: 2 }).notNull(),
  totalOrders: integer("total_orders").notNull(),
  totalCustomers: integer("total_customers").notNull(),
  averageOrderValue: decimal("average_order_value", { precision: 10, scale: 2 }).notNull(),
  topSellingProducts: text("top_selling_products"), // JSON array
  categoryBreakdown: text("category_breakdown"), // JSON object
  createdAt: text("created_at").notNull(),
});

export const savedItems = pgTable("saved_items", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  sessionId: text("session_id").notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertProductVariantSchema = createInsertSchema(productVariants).omit({
  id: true,
});

export const insertSavedItemSchema = createInsertSchema(savedItems).omit({
  id: true,
});

export const insertDiscountSchema = createInsertSchema(discounts).omit({
  id: true,
});

export const insertCouponSchema = createInsertSchema(coupons).omit({
  id: true,
});

export const insertSalesReportSchema = createInsertSchema(salesReports).omit({
  id: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProductVariant = z.infer<typeof insertProductVariantSchema>;
export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertSavedItem = z.infer<typeof insertSavedItemSchema>;
export type SavedItem = typeof savedItems.$inferSelect;
export type InsertDiscount = z.infer<typeof insertDiscountSchema>;
export type Discount = typeof discounts.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Coupon = typeof coupons.$inferSelect;
export type InsertSalesReport = z.infer<typeof insertSalesReportSchema>;
export type SalesReport = typeof salesReports.$inferSelect;

// Filter and sort enums
export const CategoryFilter = z.enum([
  "shoes",
  "clothing",
  "accessories",
  "bags",
  "jewelry",
]);
export const LineFilter = z.enum([
  "gucci-re-web",
  "ophidia",
  "gg-canvas",
  "staffa",
  "chroma",
]);
export const SortOption = z.enum([
  "newest",
  "price-low",
  "price-high",
  "popular",
]);

export type CategoryFilter = z.infer<typeof CategoryFilter>;
export type LineFilter = z.infer<typeof LineFilter>;
export type SortOption = z.infer<typeof SortOption>;
