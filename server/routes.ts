import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { CategoryFilter, LineFilter, SortOption } from "@shared/schema";
import { z } from "zod";

function generateProductDetails(product: any) {
  const category = product.category?.toLowerCase() || '';
  const name = product.name?.toLowerCase() || '';
  
  // Base details structure
  const details: any = {
    description: "",
    specifications: [],
    materials: [],
    sizeGuide: null
  };

  // Generate description based on product type
  if (category.includes('shoes')) {
    details.description = `Crafted with meticulous attention to detail, the ${product.name} combines luxury with comfort. These premium shoes feature exceptional craftsmanship and timeless design elements that embody modern sophistication.`;
    details.specifications = [
      "Premium leather construction",
      "Cushioned insole for comfort",
      "Durable rubber outsole",
      "Available in multiple sizes",
      "Professional craftsmanship"
    ];
    details.sizeGuide = {
      fitType: "True to Size",
      recommendation: "We recommend ordering your usual size. If between sizes, size up for comfort."
    };
  } else if (category.includes('jewelry')) {
    details.description = `The ${product.name} showcases exquisite artistry and premium materials. Each piece is carefully crafted to create a statement accessory that complements any sophisticated wardrobe.`;
    details.specifications = [
      "High-quality metal construction",
      "Polished finish",
      "Secure fastening mechanism",
      "Comes with luxury packaging",
      "Handcrafted details"
    ];
  } else if (category.includes('bags')) {
    details.description = `Combining functionality with luxury, the ${product.name} is designed for the modern individual. This premium accessory features thoughtful compartments and superior materials.`;
    details.specifications = [
      "Premium leather or canvas construction",
      "Multiple compartments",
      "Durable hardware",
      "Comfortable handles/straps",
      "Interior lining"
    ];
  } else if (category.includes('clothing')) {
    details.description = `The ${product.name} represents the perfect fusion of comfort and style. Made from premium materials with attention to fit and finish, this piece elevates any wardrobe.`;
    details.specifications = [
      "Premium fabric composition",
      "Tailored fit",
      "Quality construction",
      "Care instructions included",
      "Available in multiple sizes"
    ];
    details.sizeGuide = {
      fitType: "Regular Fit",
      recommendation: "Consult our size chart for best fit. Between sizes? Size up for a relaxed fit."
    };
  } else {
    details.description = `The ${product.name} exemplifies luxury and quality. Meticulously crafted with premium materials and exceptional attention to detail.`;
    details.specifications = [
      "Premium materials",
      "Expert craftsmanship",
      "Quality construction",
      "Luxury finishing",
      "Comes with authentication"
    ];
  }

  // Generate materials sections
  details.materials = [
    {
      id: "materials",
      title: "Materials & Care",
      content: generateMaterialsContent(category, name)
    },
    {
      id: "shipping",
      title: "Shipping & Returns",
      content: "Free shipping on orders over $500. Standard delivery takes 3-5 business days. Express delivery available. Returns accepted within 30 days of purchase in original condition."
    },
    {
      id: "authenticity",
      title: "Authenticity & Quality",
      content: "Each item comes with a certificate of authenticity. Our quality assurance process ensures every product meets our luxury standards. Handcrafted by skilled artisans using traditional techniques."
    }
  ];

  return details;
}

function generateMaterialsContent(category: string, name: string): string {
  if (category.includes('shoes')) {
    return "Crafted from premium leather with rubber sole. Clean with soft cloth. Store in dust bag when not in use. Avoid exposure to excessive moisture.";
  } else if (category.includes('jewelry')) {
    return "Made from high-quality metals with precious stone accents. Clean with jewelry cloth. Store separately to avoid scratching. Avoid contact with perfumes and chemicals.";
  } else if (category.includes('bags')) {
    return "Premium leather construction with fabric lining. Clean with leather conditioner. Store stuffed with tissue paper. Avoid prolonged exposure to direct sunlight.";
  } else if (category.includes('clothing')) {
    return "Premium fabric blend. Dry clean only. Store on padded hangers. Iron on low heat if needed. Follow care label instructions.";
  }
  return "Premium materials with luxury finishing. Follow specific care instructions provided with the product. Professional cleaning recommended.";
}

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

      // Track recently viewed
      const sessionId = req.sessionID || "anonymous";
      await storage.addRecentlyViewed(sessionId, productId);

      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Get product details by ID
  app.get("/api/products/:id/details", async (req, res) => {
    try {
      const { id } = req.params;
      const productId = parseInt(id);

      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      // Generate dynamic product details based on product ID and category
      const product = await storage.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const details = generateProductDetails(product);
      res.json(details);
    } catch (error) {
      console.error("Error fetching product details:", error);
      res.status(500).json({ error: "Failed to fetch product details" });
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

  // Get recently viewed items for session
  app.get("/api/recently-viewed", async (req, res) => {
    try {
      const sessionId = req.sessionID || "anonymous";
      const recentlyViewed = await storage.getRecentlyViewed(sessionId);
      res.json(recentlyViewed);
    } catch (error) {
      console.error("Error fetching recently viewed:", error);
      res.status(500).json({ error: "Failed to fetch recently viewed items" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}