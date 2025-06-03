import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { CategoryFilter, LineFilter, SortOption } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products with optional filters
  app.get("/api/products", async (req, res) => {
    try {
      const { category, line, sort, search, colors, materials } = req.query;

      const filters: any = {};

      if (category && typeof category === "string") {
        const parsed = CategoryFilter.safeParse(category);
        if (parsed.success) {
          filters.category = parsed.data;
        }
      }

      if (line && typeof line === "string") {
        const parsed = LineFilter.safeParse(line);
        if (parsed.success) {
          filters.line = parsed.data;
        }
      }

      if (sort && typeof sort === "string") {
        const parsed = SortOption.safeParse(sort);
        if (parsed.success) {
          filters.sort = parsed.data;
        }
      }

      if (search && typeof search === "string") {
        filters.search = search;
      }

      if (colors && typeof colors === "string") {
        filters.colors = colors.split(",");
      }

      if (materials && typeof materials === "string") {
        filters.materials = materials.split(",");
      }

      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get single product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const productId = parseInt(id);

      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const product = await storage.getProductById(productId);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });



  // Get saved items for session
  app.get("/api/saved-items", async (req, res) => {
    try {
      const sessionId = req.sessionID || "anonymous";
      const savedItems = await storage.getSavedItems(sessionId);
      res.json(savedItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch saved items" });
    }
  });

  // Save item
  app.post("/api/saved-items", async (req, res) => {
    try {
      const { productId } = req.body;

      if (!productId || typeof productId !== "number") {
        return res.status(400).json({ message: "Product ID is required" });
      }

      const sessionId = req.sessionID || "anonymous";

      // Check if product exists
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Check if already saved
      const isAlreadySaved = await storage.isItemSaved(sessionId, productId);
      if (isAlreadySaved) {
        return res.status(409).json({ message: "Item already saved" });
      }

      const savedItem = await storage.saveItem(sessionId, productId);
      res.status(201).json(savedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to save item" });
    }
  });

  // Remove saved item
  app.delete("/api/saved-items/:productId", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const sessionId = req.sessionID || "anonymous";
      await storage.removeSavedItem(sessionId, productId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove saved item" });
    }
  });

  // Check if item is saved
  app.get("/api/saved-items/:productId/status", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const sessionId = req.sessionID || "anonymous";
      const isSaved = await storage.isItemSaved(sessionId, productId);
      res.json({ isSaved });
    } catch (error) {
      res.status(500).json({ message: "Failed to check saved status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}