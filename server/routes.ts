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
  const server = createServer(app);

  // Get all products with optional filters
  app.get("/api/products", async (req, res) => {
    try {
      const { category, line, sort, search, colors, materials, limit, offset } = req.query;

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

      // Parse pagination parameters
      const limitNum = limit ? parseInt(limit as string) : undefined;
      const offsetNum = offset ? parseInt(offset as string) : 0;

      const result = await storage.getProducts(filters, limitNum, offsetNum);
      res.json(result);
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

  // Get materials and care information
  app.get("/api/materials-care", async (req, res) => {
    try {
      const materialsData = [
        {
          id: "materials",
          title: "MATERIALS AND CARE",
          content: "LUV VELENCIA products are made with carefully selected materials. Please handle with care for longer product life.\n\n• Protect from direct light, heat and rain. Should it become wet, dry it immediately with a soft cloth\n• Fill shoe with tissue paper to help maintain the shape and absorb humidity, then store in the provided flannel bag and box\n• Clean with a soft, dry cloth or brush"
        },
        {
          id: "shipping",
          title: "SHIPPING & RETURNS INFO",
          content: "A signature will be required upon delivery.\nReturns may be made by mail or in store within 30 days."
        },
        {
          id: "payment",
          title: "PAYMENT OPTIONS",
          content: "We accept all major credit cards, PayPal, and LUV VENCENCIA gift cards.\nSplit payments available with qualifying payment methods."
        },
        {
          id: "packaging",
          title: "LUV VENCENCIA PACKAGING",
          content: "All items come in signature LUV VENCENCIA packaging including a flannel bag and box."
        }
      ];

      res.json(materialsData);
    } catch (error) {
      console.error("Error fetching materials care data:", error);
      res.status(500).json({ error: "Failed to fetch materials care data" });
    }
  });

  // Get specific material care info by ID
  app.get("/api/materials-care/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const materialsData = [
        {
          id: "materials",
          title: "MATERIALS AND CARE",
          content: "LUV VELENCIA products are made with carefully selected materials. Please handle with care for longer product life.\n\n• Protect from direct light, heat and rain. Should it become wet, dry it immediately with a soft cloth\n• Fill shoe with tissue paper to help maintain the shape and absorb humidity, then store in the provided flannel bag and box\n• Clean with a soft, dry cloth or brush"
        },
        {
          id: "shipping",
          title: "SHIPPING & RETURNS INFO",
          content: "A signature will be required upon delivery.\nReturns may be made by mail or in store within 30 days."
        },
        {
          id: "payment",
          title: "PAYMENT OPTIONS",
          content: "We accept all major credit cards, PayPal, and LUV VENCENCIA gift cards.\nSplit payments available with qualifying payment methods."
        },
        {
          id: "packaging",
          title: "LUV VENCENCIA PACKAGING",
          content: "All items come in signature LUV VENCENCIA packaging including a flannel bag and box."
        }
      ];

      const item = materialsData.find(item => item.id === id);

      if (!item) {
        return res.status(404).json({ error: "Material care info not found" });
      }

      res.json(item);
    } catch (error) {
      console.error("Error fetching material care info:", error);
      res.status(500).json({ error: "Failed to fetch material care info" });
    }
  });

  // Get size guide data
  app.get("/api/size-guide/:category", async (req, res) => {
    try {
      const { category } = req.params; // 'mens' or 'womens'

      const sizeData = {
        mens: {
          bottoms: [
            { size: "XXS", it: "42", us: "26", jeans: "26-29", waist: "67/26.4", hips: "87/34.2" },
            { size: "XS", it: "44", us: "30", jeans: "30-31", waist: "71/28", hips: "91/35.8" },
            { size: "S", it: "46", us: "32", jeans: "32-33", waist: "75/29.5", hips: "95/37.4" },
            { size: "M", it: "48", us: "34", jeans: "34-35", waist: "79/31.1", hips: "99/39" },
            { size: "L", it: "50", us: "36", jeans: "36-37", waist: "83/32.7", hips: "103/40.5" },
            { size: "XL", it: "52", us: "38", jeans: "38-39", waist: "87/34.2", hips: "107/42.1" },
            { size: "XXL", it: "54", us: "40", jeans: "40-41", waist: "91/35.8", hips: "111/43.7" },
            { size: "XXXL", it: "56", us: "42", jeans: "42-43", waist: "95/37.4", hips: "115/45.3" },
            { size: "-", it: "58", us: "44", jeans: "44-45", waist: "99/39", hips: "119/46.8" },
            { size: "-", it: "60", us: "46", jeans: "46", waist: "103/40.5", hips: "123/48.4" },
            { size: "-", it: "62", us: "50", jeans: "-", waist: "107/42.1", hips: "127/50" },
            { size: "-", it: "64", us: "50", jeans: "-", waist: "111/43.7", hips: "131/51.6" },
          ],
          tops: [
            { size: "XXS", it: "42", shoulders: "44/17.3", chest: "86/33.8" },
            { size: "XS", it: "44", shoulders: "45/17.7", chest: "90/35.4" },
            { size: "S", it: "46", shoulders: "46/18.1", chest: "94/37" },
            { size: "M", it: "48", shoulders: "47/18.5", chest: "98/38.6" },
            { size: "L", it: "50", shoulders: "48/18.9", chest: "102/40.2" },
            { size: "XL", it: "52", shoulders: "49/19.3", chest: "106/41.7" },
            { size: "XXL", it: "54", shoulders: "50/19.7", chest: "110/43.3" },
            { size: "XXXL", it: "56", shoulders: "51/20.1", chest: "114/44.9" },
            { size: "-", it: "58", shoulders: "52/20.5", chest: "118/46.5" },
            { size: "-", it: "60", shoulders: "53/20.9", chest: "122/48" },
            { size: "-", it: "62", shoulders: "54/21.3", chest: "126/49.6" },
            { size: "-", it: "64", shoulders: "55/21.6", chest: "130/51.1" },
          ],
        },
        womens: {
          bottoms: [
            { size: "XXS", it: "38", us: "00", jeans: "24", waist: "63/24.8", hips: "83/32.7" },
            { size: "XS", it: "40", us: "0", jeans: "25", waist: "67/26.4", hips: "87/34.3" },
            { size: "S", it: "42", us: "2", jeans: "26", waist: "71/28", hips: "91/35.8" },
            { size: "M", it: "44", us: "6", jeans: "28", waist: "75/29.5", hips: "95/37.4" },
            { size: "L", it: "46", us: "10", jeans: "30", waist: "79/31.1", hips: "99/39" },
            { size: "XL", it: "48", us: "12", jeans: "32", waist: "83/32.7", hips: "103/40.5" },
          ],
          tops: [
            { size: "XXS", it: "38", shoulders: "35/13.8", chest: "78/30.7" },
            { size: "XS", it: "40", shoulders: "36/14.2", chest: "82/32.3" },
            { size: "S", it: "42", shoulders: "37/14.6", chest: "86/33.9" },
            { size: "M", it: "44", shoulders: "38/15", chest: "90/35.4" },
            { size: "L", it: "46", shoulders: "39/15.4", chest: "94/37" },
            { size: "XL", it: "48", shoulders: "40/15.7", chest: "98/38.6" },
          ],
        },
      };

      const measuringTips = {
        general: [
          "The size charts display sizes based on body measurements.",
          "Use our measuring tips and refer to the sketches below to determine your size.",
        ],
        bottoms: [
          "Stand straight on a flat surface with your heel against a wall.",
          "Measure around the narrowest part of your waist.",
          "Measure around the fullest part of your hips.",
          "For jeans, refer to the waist measurement in inches.",
        ],
        tops: [
          "Measure across the back from shoulder seam to shoulder seam.",
          "Measure around the fullest part of your chest.",
          "Keep the measuring tape parallel to the floor.",
          "Take measurements over undergarments or close-fitting clothing.",
        ],
      };

      if (!sizeData[category as keyof typeof sizeData]) {
        return res.status(400).json({ error: "Invalid category. Must be 'mens' or 'womens'" });
      }

      res.json({
        sizeData: sizeData[category as keyof typeof sizeData],
        measuringTips
      });
    } catch (error) {
      console.error("Error fetching size guide data:", error);
      res.status(500).json({ error: "Failed to fetch size guide data" });
    }
  });

  // Get search suggestions
  app.get("/api/search-suggestions", async (req, res) => {
    try {
      const suggestions = {
        trending: [
          { query: "Shirt", icon: "search" },
          { query: "Pant", icon: "search" },
          { query: "T-shirt", icon: "search" }
        ],
        newIn: [
          { query: "Giallo", category: "new" },
          { query: "Women", category: "new" }
        ],
        featured: [
          { query: "Lido Collection", category: "collection" }
        ]
      };

      res.json(suggestions);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      res.status(500).json({ error: "Failed to fetch search suggestions" });
    }
  });

  // Get all saved items for user
  app.get("/api/saved-items", async (req, res) => {
    try {
      // Mock saved items data - in real app this would come from database
      const savedItems = [
        {
          id: 1,
          name: "GG Denim Sneakers",
          price: 890.0,
          image: "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1746033325/835220_XDDCY_4452_001_100_0000_Light-Washed-denim-shirt-with-GG-insert.jpg",
          category: "Shoes",
          savedDate: "2025-01-10",
        },
        {
          id: 2,
          name: "Washed Denim Shirt with GG Insert",
          price: 2250.0,
          image: "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1746033325/835220_XDDCY_4452_001_100_0000_Light-Washed-denim-shirt-with-GG-insert.jpg",
          category: "Ready-to-Wear",
          savedDate: "2025-01-08",
        },
        {
          id: 3,
          name: "Gucci Staffa Long Pendant Necklace",
          price: 1890.0,
          image: "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1746033325/835220_XDDCY_4452_001_100_0000_Light-Washed-denim-shirt-with-GG-insert.jpg",
          category: "Jewelry",
          savedDate: "2025-01-05",
        },
      ];

      res.json(savedItems);
    } catch (error) {
      console.error("Error fetching saved items:", error);
      res.status(500).json({ error: "Failed to fetch saved items" });
    }
  });

  // Remove saved item
  app.delete("/api/saved-items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      // In real app, this would remove from database
      console.log(`Removing saved item ${id}`);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing saved item:", error);
      res.status(500).json({ error: "Failed to remove saved item" });
    }
  });

  // Get user profile
  app.get("/api/user/profile", async (req, res) => {
    try {
      // Mock user profile data
      const userProfile = {
        firstName: "Google",
        lastName: "User",
        email: "user@gmail.com",
        phone: "+1 (555) 123-4567",
        dateOfBirth: "1990-01-01",
        address: "123 Main St, New York, NY 10001",
        memberSince: "2024",
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          newsletter: true,
        },
      };

      res.json(userProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });

  // Update user profile
  app.put("/api/user/profile", async (req, res) => {
    try {
      const updates = req.body;
      // In real app, this would update database
      console.log("Updating user profile:", updates);
      res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Failed to update user profile" });
    }
  });

  // Get user orders
  app.get("/api/user/orders", async (req, res) => {
    try {
      // Mock orders data
      const orders = [
        {
          id: "ORD-2024-001",
          date: "2024-12-15",
          status: "delivered",
          total: 2890.0,
          items: [
            {
              name: "GG Denim Sneakers",
              price: 890.0,
              quantity: 1,
              image: "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1746033325/835220_XDDCY_4452_001_100_0000_Light-Washed-denim-shirt-with-GG-insert.jpg",
            },
            {
              name: "Wool Cashmere Sweater",
              price: 2000.0,
              quantity: 1,
              image: "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1746033325/835220_XDDCY_4452_001_100_0000_Light-Washed-denim-shirt-with-GG-insert.jpg",
            },
          ],
          tracking: "LV123456789",
          estimatedDelivery: "2024-12-20",
        },
        {
          id: "ORD-2024-002",
          date: "2024-12-10",
          status: "shipped",
          total: 1890.0,
          items: [
            {
              name: "Leather Handbag",
              price: 1890.0,
              quantity: 1,
              image: "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1746033325/835220_XDDCY_4452_001_100_0000_Light-Washed-denim-shirt-with-GG-insert.jpg",
            },
          ],
          tracking: "LV987654321",
          estimatedDelivery: "2024-12-18",
        },
      ];

      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ error: "Failed to fetch user orders" });
    }
  });

  // Get user addresses
  app.get("/api/user/addresses", async (req, res) => {
    try {
      // Mock addresses data
      const addresses = [
        {
          id: 1,
          type: "home",
          isDefault: true,
          firstName: "John",
          lastName: "Doe",
          address: "123 Main Street",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
          phone: "+1 (555) 123-4567",
        },
        {
          id: 2,
          type: "work",
          isDefault: false,
          firstName: "John",
          lastName: "Doe",
          address: "456 Business Ave",
          city: "New York",
          state: "NY",
          zipCode: "10002",
          country: "United States",
          phone: "+1 (555) 987-6543",
        },
      ];

      res.json(addresses);
    } catch (error) {
      console.error("Error fetching user addresses:", error);
      res.status(500).json({ error: "Failed to fetch user addresses" });
    }
  });

  // Add user address
  app.post("/api/user/addresses", async (req, res) => {
    try {
      const addressData = req.body;
      // In real app, this would save to database
      console.log("Adding new address:", addressData);
      res.json({ success: true, id: Date.now() });
    } catch (error) {
      console.error("Error adding user address:", error);
      res.status(500).json({ error: "Failed to add user address" });
    }
  });

  // Update user address
  app.put("/api/user/addresses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const addressData = req.body;
      // In real app, this would update database
      console.log(`Updating address ${id}:`, addressData);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating user address:", error);
      res.status(500).json({ error: "Failed to update user address" });
    }
  });

  // Delete user address
  app.delete("/api/user/addresses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      // In real app, this would delete from database
      console.log(`Deleting address ${id}`);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user address:", error);
      res.status(500).json({ error: "Failed to delete user address" });
    }
  });

  // Get account menu data
  app.get("/api/account-menu", async (req, res) => {
    try {
      const menuData = {
        mainServices: [
          {
            icon: "Package",
            title: "TRACK YOUR ORDERS",
            description: "Follow your orders every step of the way.",
            path: "/account/orders",
            color: "from-blue-500 to-purple-600",
            bgColor: "bg-gradient-to-br from-blue-50 to-purple-50",
          },
          {
            icon: "CreditCard",
            title: "STREAMLINE CHECKOUT",
            description: "Check out faster with saved addresses and payment methods.",
            path: "/account/wallet",
            color: "from-green-500 to-emerald-600",
            bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
          },
          {
            icon: "Calendar",
            title: "BOOK AN APPOINTMENT",
            description: "Enjoy priority access to the boutique of your choice at the time and date that suits you.",
            path: "/account/appointments",
            color: "from-orange-500 to-pink-600",
            bgColor: "bg-gradient-to-br from-orange-50 to-pink-50",
          },
        ],
        quickActions: [
          {
            icon: "Settings",
            title: "ACCOUNT SETTINGS",
            description: "Manage your personal information and preferences",
            path: "/account/settings",
            iconColor: "text-gray-600",
          },
          {
            icon: "MapPin",
            title: "ADDRESS BOOK",
            description: "Manage your shipping and billing addresses",
            path: "/account/addresses",
            iconColor: "text-blue-600",
          },
          {
            icon: "Heart",
            title: "SAVED ITEMS",
            description: "View your wishlist and saved products",
            path: "/account/saved-items",
            iconColor: "text-pink-600",
          },
        ]
      };

      res.json(menuData);
    } catch (error) {
      console.error("Error fetching account menu:", error);
      res.status(500).json({ error: "Failed to fetch account menu" });
    }
  });

  // Admin API Routes
  
  // Admin Products API
  app.get("/api/admin/products", async (req, res) => {
    try {
      const { search, category, limit, offset } = req.query;
      
      // Get products from storage with admin-specific data
      const filters: any = {};
      if (search && typeof search === "string") {
        filters.search = search;
      }
      if (category && typeof category === "string") {
        filters.category = category;
      }
      
      const limitNum = limit ? parseInt(limit as string) : 50;
      const offsetNum = offset ? parseInt(offset as string) : 0;
      
      const result = await storage.getProducts(filters, limitNum, offsetNum);
      
      // Add admin-specific data to each product
      const adminProducts = result.products.map((product: any) => ({
        ...product,
        sales: Math.floor(Math.random() * 100) + 10,
        inStock: Math.random() > 0.2, // 80% chance of being in stock
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        updatedAt: new Date().toISOString(),
      }));
      
      res.json({
        products: adminProducts,
        total: result.total,
        hasMore: result.hasMore
      });
    } catch (error) {
      console.error("Error fetching admin products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Admin Create Product
  app.post("/api/admin/products", async (req, res) => {
    try {
      const productData = req.body;
      // In real app, this would save to database
      console.log("Creating product:", productData);
      
      const newProduct = {
        id: Date.now(),
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  // Admin Update Product
  app.put("/api/admin/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const productData = req.body;
      
      console.log(`Updating product ${id}:`, productData);
      
      res.json({ success: true, id: parseInt(id) });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // Admin Delete Product
  app.delete("/api/admin/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Deleting product ${id}`);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Admin Orders API
  app.get("/api/admin/orders", async (req, res) => {
    try {
      const { search, status, limit, offset } = req.query;
      
      // Mock orders data - in real app this would come from database
      const orders = [
        {
          id: 'ORD-001',
          userId: '1',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          items: [
            { productId: 1, productName: 'Luxury Handbag', quantity: 1, price: 1890 },
            { productName: 'Designer Shoes', quantity: 1, price: 890 },
          ],
          total: 2780,
          status: 'delivered',
          trackingNumber: 'LV123456789',
          createdAt: '2025-01-15',
          updatedAt: '2025-01-15',
          shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
          },
        },
        {
          id: 'ORD-002',
          userId: '2',
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          items: [
            { productId: 2, productName: 'Premium Watch', quantity: 1, price: 3200 },
          ],
          total: 3200,
          status: 'processing',
          trackingNumber: null,
          createdAt: '2025-01-14',
          updatedAt: '2025-01-14',
          shippingAddress: {
            street: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210',
            country: 'USA',
          },
        },
        {
          id: 'ORD-003',
          userId: '3',
          customerName: 'Mike Johnson',
          customerEmail: 'mike@example.com',
          items: [
            { productId: 3, productName: 'Leather Wallet', quantity: 2, price: 450 },
          ],
          total: 900,
          status: 'shipped',
          trackingNumber: 'LV987654321',
          createdAt: '2025-01-13',
          updatedAt: '2025-01-13',
          shippingAddress: {
            street: '789 Pine St',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
            country: 'USA',
          },
        },
      ];

      let filteredOrders = orders;
      
      if (search && typeof search === "string") {
        filteredOrders = orders.filter(order => 
          order.id.toLowerCase().includes(search.toLowerCase()) ||
          order.customerName.toLowerCase().includes(search.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (status && typeof status === "string") {
        filteredOrders = filteredOrders.filter(order => order.status === status);
      }
      
      const limitNum = limit ? parseInt(limit as string) : 50;
      const offsetNum = offset ? parseInt(offset as string) : 0;
      
      const paginatedOrders = filteredOrders.slice(offsetNum, offsetNum + limitNum);
      
      res.json({
        orders: paginatedOrders,
        total: filteredOrders.length,
        hasMore: offsetNum + limitNum < filteredOrders.length
      });
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Admin Update Order Status
  app.put("/api/admin/orders/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, trackingNumber } = req.body;
      
      console.log(`Updating order ${id} status to ${status}`);
      
      res.json({ success: true, id, status, trackingNumber });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // Admin Users API
  app.get("/api/admin/users", async (req, res) => {
    try {
      const { search, status, limit, offset } = req.query;
      
      // Mock users data - in real app this would come from database
      const users = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          provider: 'email',
          isActive: true,
          totalOrders: 12,
          totalSpent: 15680,
          lastLogin: '2025-01-15',
          createdAt: '2024-03-15',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          provider: 'google',
          isActive: true,
          totalOrders: 8,
          totalSpent: 9240,
          lastLogin: '2025-01-14',
          createdAt: '2024-05-20',
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          provider: 'apple',
          isActive: false,
          totalOrders: 3,
          totalSpent: 2890,
          lastLogin: '2024-12-28',
          createdAt: '2024-07-10',
        },
        {
          id: '4',
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          provider: 'email',
          isActive: true,
          totalOrders: 25,
          totalSpent: 32450,
          lastLogin: '2025-01-15',
          createdAt: '2024-01-15',
        },
      ];

      let filteredUsers = users;
      
      if (search && typeof search === "string") {
        filteredUsers = users.filter(user =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (status && typeof status === "string") {
        const isActive = status === "active";
        filteredUsers = filteredUsers.filter(user => user.isActive === isActive);
      }
      
      const limitNum = limit ? parseInt(limit as string) : 50;
      const offsetNum = offset ? parseInt(offset as string) : 0;
      
      const paginatedUsers = filteredUsers.slice(offsetNum, offsetNum + limitNum);
      
      res.json({
        users: paginatedUsers,
        total: filteredUsers.length,
        hasMore: offsetNum + limitNum < filteredUsers.length
      });
    } catch (error) {
      console.error("Error fetching admin users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Admin Update User Status
  app.put("/api/admin/users/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      
      console.log(`Updating user ${id} status to ${isActive ? 'active' : 'inactive'}`);
      
      res.json({ success: true, id, isActive });
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ error: "Failed to update user status" });
    }
  });

  // Admin Analytics API
  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const analytics = {
        revenue: {
          current: 125430,
          change: 20.1,
          trend: 'up'
        },
        orders: {
          current: 1250,
          change: 12.5,
          trend: 'up'
        },
        customers: {
          current: 890,
          change: 15.2,
          trend: 'up'
        },
        avgOrderValue: {
          current: 141,
          change: -2.4,
          trend: 'down'
        },
        topProducts: [
          { name: 'Luxury Handbag', sales: 145, revenue: 274050 },
          { name: 'Designer Watch', sales: 89, revenue: 284800 },
          { name: 'Premium Shoes', sales: 156, revenue: 138840 },
        ],
        recentActivity: [
          { type: 'order', message: 'New order #ORD-001234', time: '2 minutes ago' },
          { type: 'user', message: 'New user registered', time: '5 minutes ago' },
          { type: 'product', message: 'Product updated: Luxury Handbag', time: '10 minutes ago' },
        ]
      };
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  return server;
}