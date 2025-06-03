import { pgTable, text, serial, integer, boolean, decimal } from "drizzle-orm/pg-core";
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
});

export const savedItems = pgTable("saved_items", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  sessionId: text("session_id").notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertSavedItemSchema = createInsertSchema(savedItems).omit({
  id: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertSavedItem = z.infer<typeof insertSavedItemSchema>;
export type SavedItem = typeof savedItems.$inferSelect;

// Filter and sort enums
export const CategoryFilter = z.enum(["shoes", "clothing", "accessories", "bags", "jewelry"]);
export const LineFilter = z.enum(["gucci-re-web", "ophidia", "gg-canvas", "staffa", "chroma"]);
export const SortOption = z.enum(["newest", "price-low", "price-high", "popular"]);

export type CategoryFilter = z.infer<typeof CategoryFilter>;
export type LineFilter = z.infer<typeof LineFilter>;
export type SortOption = z.infer<typeof SortOption>;
