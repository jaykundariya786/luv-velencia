import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { CategoryFilter, LineFilter, SortOption } from "@shared/schema";
import { z } from "zod";

function generateProductDetails(product: any) {
  const category = product.category?.toLowerCase() || "";
  const name = product.name?.toLowerCase() || "";

  // Base details structure
  const details: any = {
    description: "",
    specifications: [],
    materials: [],
    sizeGuide: null,
  };

  // Generate description based on product type
  if (category.includes("shoes")) {
    details.description = `Crafted with meticulous attention to detail, the ${product.name} combines luxury with comfort. These premium shoes feature exceptional craftsmanship and timeless design elements that embody modern sophistication.`;
    details.specifications = [
      "Premium leather construction",
      "Cushioned insole for comfort",
      "Durable rubber outsole",
      "Available in multiple sizes",
      "Professional craftsmanship",
    ];
    details.sizeGuide = {
      fitType: "True to Size",
      recommendation:
        "We recommend ordering your usual size. If between sizes, size up for comfort.",
    };
  } else if (category.includes("jewelry")) {
    details.description = `The ${product.name} showcases exquisite artistry and premium materials. Each piece is carefully crafted to create a statement accessory that complements any sophisticated wardrobe.`;
    details.specifications = [
      "High-quality metal construction",
      "Polished finish",
      "Secure fastening mechanism",
      "Comes with luxury packaging",
      "Handcrafted details",
    ];
  } else if (category.includes("bags")) {
    details.description = `Combining functionality with luxury, the ${product.name} is designed for the modern individual. This premium accessory features thoughtful compartments and superior materials.`;
    details.specifications = [
      "Premium leather or canvas construction",
      "Multiple compartments",
      "Durable hardware",
      "Comfortable handles/straps",
      "Interior lining",
    ];
  } else if (category.includes("clothing")) {
    details.description = `The ${product.name} represents the perfect fusion of comfort and style. Made from premium materials with attention to fit and finish, this piece elevates any wardrobe.`;
    details.specifications = [
      "Premium fabric composition",
      "Tailored fit",
      "Quality construction",
      "Care instructions included",
      "Available in multiple sizes",
    ];
    details.sizeGuide = {
      fitType: "Regular Fit",
      recommendation:
        "Consult our size chart for best fit. Between sizes? Size up for a relaxed fit.",
    };
  } else {
    details.description = `The ${product.name} exemplifies luxury and quality. Meticulously crafted with premium materials and exceptional attention to detail.`;
    details.specifications = [
      "Premium materials",
      "Expert craftsmanship",
      "Quality construction",
      "Luxury finishing",
      "Comes with authentication",
    ];
  }

  // Generate materials sections
  details.materials = [
    {
      id: "materials",
      title: "Materials & Care",
      content: generateMaterialsContent(category, name),
    },
    {
      id: "shipping",
      title: "Shipping & Returns",
      content:
        "Free shipping on orders over $500. Standard delivery takes 3-5 business days. Express delivery available. Returns accepted within 30 days of purchase in original condition.",
    },
    {
      id: "authenticity",
      title: "Authenticity & Quality",
      content:
        "Each item comes with a certificate of authenticity. Our quality assurance process ensures every product meets our luxury standards. Handcrafted by skilled artisans using traditional techniques.",
    },
  ];

  return details;
}

function generateMaterialsContent(category: string, name: string): string {
  if (category.includes("shoes")) {
    return "Crafted from premium leather with rubber sole. Clean with soft cloth. Store in dust bag when not in use. Avoid exposure to excessive moisture.";
  } else if (category.includes("jewelry")) {
    return "Made from high-quality metals with precious stone accents. Clean with jewelry cloth. Store separately to avoid scratching. Avoid contact with perfumes and chemicals.";
  } else if (category.includes("bags")) {
    return "Premium leather construction with fabric lining. Clean with leather conditioner. Store stuffed with tissue paper. Avoid prolonged exposure to direct sunlight.";
  } else if (category.includes("clothing")) {
    return "Premium fabric blend. Dry clean only. Store on padded hangers. Iron on low heat if needed. Follow care label instructions.";
  }
  return "Premium materials with luxury finishing. Follow specific care instructions provided with the product. Professional cleaning recommended.";
}

export async function registerRoutes(app: Express): Promise<Server> {
  const server = createServer(app);

  // Get all products with optional filters
  app.get("/api/products", async (req, res) => {
    try {
      const { category, line, sort, search, colors, materials, limit, offset } =
        req.query;

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
          content:
            "LUV VELENCIA products are made with carefully selected materials. Please handle with care for longer product life.\n\n• Protect from direct light, heat and rain. Should it become wet, dry it immediately with a soft cloth\n• Fill shoe with tissue paper to help maintain the shape and absorb humidity, then store in the provided flannel bag and box\n• Clean with a soft, dry cloth or brush",
        },
        {
          id: "shipping",
          title: "SHIPPING & RETURNS INFO",
          content:
            "A signature will be required upon delivery.\nReturns may be made by mail or in store within 30 days.",
        },
        {
          id: "payment",
          title: "PAYMENT OPTIONS",
          content:
            "We accept all major credit cards, PayPal, and LUV VENCENCIA gift cards.\nSplit payments available with qualifying payment methods.",
        },
        {
          id: "packaging",
          title: "LUV VENCENCIA PACKAGING",
          content:
            "All items come in signature LUV VENCENCIA packaging including a flannel bag and box.",
        },
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
          content:
            "LUV VELENCIA products are made with carefully selected materials. Please handle with care for longer product life.\n\n• Protect from direct light, heat and rain. Should it become wet, dry it immediately with a soft cloth\n• Fill shoe with tissue paper to help maintain the shape and absorb humidity, then store in the provided flannel bag and box\n• Clean with a soft, dry cloth or brush",
        },
        {
          id: "shipping",
          title: "SHIPPING & RETURNS INFO",
          content:
            "A signature will be required upon delivery.\nReturns may be made by mail or in store within 30 days.",
        },
        {
          id: "payment",
          title: "PAYMENT OPTIONS",
          content:
            "We accept all major credit cards, PayPal, and LUV VENCENCIA gift cards.\nSplit payments available with qualifying payment methods.",
        },
        {
          id: "packaging",
          title: "LUV VENCENCIA PACKAGING",
          content:
            "All items come in signature LUV VENCENCIA packaging including a flannel bag and box.",
        },
      ];

      const item = materialsData.find((item) => item.id === id);

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
            {
              size: "XXS",
              it: "42",
              us: "26",
              jeans: "26-29",
              waist: "67/26.4",
              hips: "87/34.2",
            },
            {
              size: "XS",
              it: "44",
              us: "30",
              jeans: "30-31",
              waist: "71/28",
              hips: "91/35.8",
            },
            {
              size: "S",
              it: "46",
              us: "32",
              jeans: "32-33",
              waist: "75/29.5",
              hips: "95/37.4",
            },
            {
              size: "M",
              it: "48",
              us: "34",
              jeans: "34-35",
              waist: "79/31.1",
              hips: "99/39",
            },
            {
              size: "L",
              it: "50",
              us: "36",
              jeans: "36-37",
              waist: "83/32.7",
              hips: "103/40.5",
            },
            {
              size: "XL",
              it: "52",
              us: "38",
              jeans: "38-39",
              waist: "87/34.2",
              hips: "107/42.1",
            },
            {
              size: "XXL",
              it: "54",
              us: "40",
              jeans: "40-41",
              waist: "91/35.8",
              hips: "111/43.7",
            },
            {
              size: "XXXL",
              it: "56",
              us: "42",
              jeans: "42-43",
              waist: "95/37.4",
              hips: "115/45.3",
            },
            {
              size: "-",
              it: "58",
              us: "44",
              jeans: "44-45",
              waist: "99/39",
              hips: "119/46.8",
            },
            {
              size: "-",
              it: "60",
              us: "46",
              jeans: "46",
              waist: "103/40.5",
              hips: "123/48.4",
            },
            {
              size: "-",
              it: "62",
              us: "50",
              jeans: "-",
              waist: "107/42.1",
              hips: "127/50",
            },
            {
              size: "-",
              it: "64",
              us: "50",
              jeans: "-",
              waist: "111/43.7",
              hips: "131/51.6",
            },
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
            {
              size: "XXS",
              it: "38",
              us: "00",
              jeans: "24",
              waist: "63/24.8",
              hips: "83/32.7",
            },
            {
              size: "XS",
              it: "40",
              us: "0",
              jeans: "25",
              waist: "67/26.4",
              hips: "87/34.3",
            },
            {
              size: "S",
              it: "42",
              us: "2",
              jeans: "26",
              waist: "71/28",
              hips: "91/35.8",
            },
            {
              size: "M",
              it: "44",
              us: "6",
              jeans: "28",
              waist: "75/29.5",
              hips: "95/37.4",
            },
            {
              size: "L",
              it: "46",
              us: "10",
              jeans: "30",
              waist: "79/31.1",
              hips: "99/39",
            },
            {
              size: "XL",
              it: "48",
              us: "12",
              jeans: "32",
              waist: "83/32.7",
              hips: "103/40.5",
            },
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
        return res
          .status(400)
          .json({ error: "Invalid category. Must be 'mens' or 'womens'" });
      }

      res.json({
        sizeData: sizeData[category as keyof typeof sizeData],
        measuringTips,
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
          { query: "T-shirt", icon: "search" },
        ],
        newIn: [
          { query: "Giallo", category: "new" },
          { query: "Women", category: "new" },
        ],
        featured: [{ query: "Lido Collection", category: "collection" }],
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
          image:
            "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1746033325/835220_XDDCY_4452_001_100_0000_Light-Washed-denim-shirt-with-GG-insert.jpg",
          category: "Shoes",
          savedDate: "2025-01-10",
        },
        {
          id: 2,
          name: "Washed Denim Shirt with GG Insert",
          price: 2250.0,
          image:
            "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1746033325/835220_XDDCY_4452_001_100_0000_Light-Washed-denim-shirt-with-GG-insert.jpg",
          category: "Ready-to-Wear",
          savedDate: "2025-01-08",
        },
        {
          id: 3,
          name: "Gucci Staffa Long Pendant Necklace",
          price: 1890.0,
          image:
            "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1746033325/835220_XDDCY_4452_001_100_0000_Light-Washed-denim-shirt-with-GG-insert.jpg",
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
              image:
                "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1746033325/835220_XDDCY_4452_001_100_0000_Light-Washed-denim-shirt-with-GG-insert.jpg",
            },
            {
              name: "Wool Cashmere Sweater",
              price: 2000.0,
              quantity: 1,
              image:
                "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1746033325/835220_XDDCY_4452_001_100_0000_Light-Washed-denim-shirt-with-GG-insert.jpg",
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
              image:
                "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1746033325/835220_XDDCY_4452_001_100_0000_Light-Washed-denim-shirt-with-GG-insert.jpg",
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

  //  // Firebase Authentication
  app.post("/api/auth/firebase-login", async (req, res) => {
    try {
      const { firebaseUID, email, name, photoURL, idToken } = req.body;

      if (!firebaseUID || !email) {
        return res
          .status(400)
          .json({ error: "Firebase UID and email are required" });
      }

      // Check if user exists in backend by Firebase UID
      let user = await storage.getUserByFirebaseUID(firebaseUID);

      if (!user) {
        // Create new user in backend
        user = await storage.createUser({
          email,
          name: name || email.split("@")[0],
          provider: "google",
          firebaseUID,
          photoURL,
        });
      } else {
        // Update existing user's info
        user = await storage.updateUser(user.id, {
          name: name || user.name,
          photoURL: photoURL || user.photoURL,
          lastLogin: new Date().toISOString(),
        });
      }

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        firebaseUID: user.firebaseUID,
        photoURL: user.photoURL,
      });
    } catch (error) {
      console.error("Firebase login error:", error);
      res.status(500).json({ error: "Failed to authenticate user" });
    }
  });

  // Admin Firebase Users endpoint
  app.get("/api/admin/firebase-users", async (req, res) => {
    try {
      // Get all Firebase authenticated users from your backend database
      // This returns users who have authenticated via Firebase
      const firebaseUsers = mockUsers.filter(user => user.firebaseUID);
      
      const { search, status, page = 1, limit = 10 } = req.query;
      
      let filteredUsers = firebaseUsers;
      
      if (search && typeof search === "string") {
        filteredUsers = firebaseUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (status && typeof status === "string") {
        filteredUsers = filteredUsers.filter(
          (user) => status === 'active' ? user.isActive : !user.isActive
        );
      }
      
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      res.json({
        users: paginatedUsers,
        total: filteredUsers.length,
        page: pageNum,
        totalPages: Math.ceil(filteredUsers.length / limitNum)
      });
    } catch (error) {
      console.error("Error fetching Firebase users:", error);
      res.status(500).json({ error: "Failed to fetch Firebase users" });
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
            description:
              "Check out faster with saved addresses and payment methods.",
            path: "/account/wallet",
            color: "from-green-500 to-emerald-600",
            bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
          },
          {
            icon: "Calendar",
            title: "BOOK AN APPOINTMENT",
            description:
              "Enjoy priority access to the boutique of your choice at the time and date that suits you.",
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
        ],
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
      const {
        search,
        category,
        limit,
        offset,
        stockFilter,
        priceRange,
        dateRange,
      } = req.query;

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
      const adminProducts = result.products.map((product: any) => {
        const stock = product.stock || Math.floor(Math.random() * 50);
        const lowStockThreshold = product.lowStockThreshold || 10;
        const isOutOfStock = stock === 0;
        const isLowStock = stock > 0 && stock <= lowStockThreshold;

        return {
          ...product,
          stock,
          lowStockThreshold,
          isOutOfStock,
          isLowStock,
          stockStatus: isOutOfStock
            ? "out-of-stock"
            : isLowStock
              ? "low-stock"
              : "in-stock",
          sales: Math.floor(Math.random() * 100) + 10,
          inStock: stock > 0,
          createdAt: new Date(
            Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
          )
            .toISOString()
            .split("T")[0],
          updatedAt: new Date().toISOString(),
        };
      });

      // Filter by stock status if requested
      let filteredProducts = adminProducts;
      if (stockFilter && typeof stockFilter === "string") {
        filteredProducts = adminProducts.filter((product) => {
          switch (stockFilter) {
            case "out-of-stock":
              return product.isOutOfStock;
            case "low-stock":
              return product.isLowStock;
            case "in-stock":
              return !product.isOutOfStock && !product.isLowStock;
            default:
              return true;
          }
        });
      }

      // Filter by price range if requested
      if (priceRange && typeof priceRange === "string") {
        try {
          const { min, max } = JSON.parse(priceRange);
          if (min || max) {
            filteredProducts = filteredProducts.filter((product) => {
              const price = parseFloat(product.price);
              return (!min || price >= min) && (!max || price <= max);
            });
          }
        } catch (e) {
          // Invalid price range format, ignore
        }
      }

      // Filter by date range if requested
      if (dateRange && typeof dateRange === "string") {
        try {
          const { start, end } = JSON.parse(dateRange);
          if (start || end) {
            filteredProducts = filteredProducts.filter((product) => {
              const createdAt = new Date(product.createdAt);
              return (
                (!start || createdAt >= new Date(start)) &&
                (!end || createdAt <= new Date(end))
              );
            });
          }
        } catch (e) {
          // Invalid date range format, ignore
        }
      }

      res.json({
        products: filteredProducts,
        total: filteredProducts.length,
        hasMore: false,
        stockSummary: {
          total: adminProducts.length,
          inStock: adminProducts.filter((p) => !p.isOutOfStock && !p.isLowStock)
            .length,
          lowStock: adminProducts.filter((p) => p.isLowStock).length,
          outOfStock: adminProducts.filter((p) => p.isOutOfStock).length,
        },
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

      // Auto-disable product if stock is 0
      if (productData.stock !== undefined) {
        productData.inStock = productData.stock > 0;
      }

      console.log(`Updating product ${id}:`, productData);

      res.json({ success: true, id: parseInt(id) });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // Admin Update Stock
  app.put("/api/admin/products/:id/stock", async (req, res) => {
    try {
      const { id } = req.params;
      const { stock, lowStockThreshold } = req.body;

      if (typeof stock !== "number" || stock < 0) {
        return res.status(400).json({ error: "Invalid stock quantity" });
      }

      // Auto-disable product if stock is 0
      const inStock = stock > 0;

      console.log(
        `Updating stock for product ${id}: ${stock} (threshold: ${lowStockThreshold})`,
      );

      res.json({
        success: true,
        id: parseInt(id),
        stock,
        lowStockThreshold: lowStockThreshold || 10,
        inStock,
        stockStatus:
          stock === 0
            ? "out-of-stock"
            : stock <= (lowStockThreshold || 10)
              ? "low-stock"
              : "in-stock",
      });
    } catch (error) {
      console.error("Error updating stock:", error);
      res.status(500).json({ error: "Failed to update stock" });
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
      const { search, status, limit, offset, dateRange, priceRange } =
        req.query;

      // Mock orders data - in real app this would come from database
      const orders = [
        {
          id: "ORD-001",
          userId: "1",
          customerName: "John Doe",
          customerEmail: "john@example.com",
          items: [
            {
              productId: 1,
              productName: "Luxury Handbag",
              quantity: 1,
              price: 1890,
            },
            { productName: "Designer Shoes", quantity: 1, price: 890 },
          ],
          total: 2780,
          status: "delivered",
          trackingNumber: "LV123456789",
          createdAt: "2025-01-15",
          updatedAt: "2025-01-15",
          shippingAddress: {
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA",
          },
        },
        {
          id: "ORD-002",
          userId: "2",
          customerName: "Jane Smith",
          customerEmail: "jane@example.com",
          items: [
            {
              productId: 2,
              productName: "Premium Watch",
              quantity: 1,
              price: 3200,
            },
          ],
          total: 3200,
          status: "processing",
          trackingNumber: null,
          createdAt: "2025-01-14",
          updatedAt: "2025-01-14",
          shippingAddress: {
            street: "456 Oak Ave",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90210",
            country: "USA",
          },
        },
        {
          id: "ORD-003",
          userId: "3",
          customerName: "Mike Johnson",
          customerEmail: "mike@example.com",
          items: [
            {
              productId: 3,
              productName: "Leather Wallet",
              quantity: 2,
              price: 450,
            },
          ],
          total: 900,
          status: "shipped",
          trackingNumber: "LV987654321",
          createdAt: "2025-01-13",
          updatedAt: "2025-01-13",
          shippingAddress: {
            street: "789 Pine St",
            city: "Chicago",
            state: "IL",
            zipCode: "60601",
            country: "USA",
          },
        },
      ];

      let filteredOrders = orders;

      if (search && typeof search === "string") {
        filteredOrders = orders.filter(
          (order) =>
            order.id.toLowerCase().includes(search.toLowerCase()) ||
            order.customerName.toLowerCase().includes(search.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(search.toLowerCase()),
        );
      }

      if (status && typeof status === "string") {
        filteredOrders = filteredOrders.filter(
          (order) => order.status === status,
        );
      }

      const limitNum = limit ? parseInt(limit as string) : 50;
      const offsetNum = offset ? parseInt(offset as string) : 0;

      const paginatedOrders = filteredOrders.slice(
        offsetNum,
        offsetNum + limitNum,
      );

      res.json({
        orders: paginatedOrders,
        total: filteredOrders.length,
        hasMore: offsetNum + limitNum < filteredOrders.length,
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
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          provider: "email",
          isActive: true,
          totalOrders: 12,
          totalSpent: 15680,
          lastLogin: "2025-01-15",
          createdAt: "2024-03-15",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          provider: "google",
          isActive: true,
          totalOrders: 8,
          totalSpent: 9240,
          lastLogin: "2025-01-14",
          createdAt: "2024-05-20",
        },
        {
          id: "3",
          name: "Mike Johnson",
          email: "mike@example.com",
          provider: "apple",
          isActive: false,
          totalOrders: 3,
          totalSpent: 2890,
          lastLogin: "2024-12-28",
          createdAt: "2024-07-10",
        },
        {
          id: "4",
          name: "Sarah Wilson",
          email: "sarah@example.com",
          provider: "email",
          isActive: true,
          totalOrders: 25,
          totalSpent: 32450,
          lastLogin: "2025-01-15",
          createdAt: "2024-01-15",
        },
      ];

      let filteredUsers = users;

      if (search && typeof search === "string") {
        filteredUsers = users.filter(
          (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()),
        );
      }

      if (status && typeof status === "string") {
        const isActive = status === "active";
        filteredUsers = filteredUsers.filter(
          (user) => user.isActive === isActive,
        );
      }

      const limitNum = limit ? parseInt(limit as string) : 50;
      const offsetNum = offset ? parseInt(offset as string) : 0;

      const paginatedUsers = filteredUsers.slice(
        offsetNum,
        offsetNum + limitNum,
      );

      res.json({
        users: paginatedUsers,
        total: filteredUsers.length,
        hasMore: offsetNum + limitNum < filteredUsers.length,
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

      console.log(
        `Updating user ${id} status to ${isActive ? "active" : "inactive"}`,
      );

      res.json({ success: true, id, isActive });
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ error: "Failed to update user status" });
    }
  });

  // Admin Low Stock Alerts
  app.get("/api/admin/alerts/low-stock", async (req, res) => {
    try {
      const result = await storage.getProducts({}, 100, 0);

      const lowStockProducts = result.products
        .map((product: any) => {
          const stock = product.stock || Math.floor(Math.random() * 50);
          const lowStockThreshold = product.lowStockThreshold || 10;
          return {
            ...product,
            stock,
            lowStockThreshold,
            isLowStock: stock > 0 && stock <= lowStockThreshold,
            isOutOfStock: stock === 0,
          };
        })
        .filter((product: any) => product.isLowStock || product.isOutOfStock);

      res.json({
        alerts: lowStockProducts,
        totalAlerts: lowStockProducts.length,
        outOfStock: lowStockProducts.filter((p) => p.isOutOfStock).length,
        lowStock: lowStockProducts.filter((p) => p.isLowStock).length,
      });
    } catch (error) {
      console.error("Error fetching low stock alerts:", error);
      res.status(500).json({ error: "Failed to fetch low stock alerts" });
    }
  });

  // Admin Analytics API
  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const analytics = {
        revenue: {
          current: 125430,
          change: 20.1,
          trend: "up",
        },
        orders: {
          current: 1250,
          change: 12.5,
          trend: "up",
        },
        customers: {
          current: 890,
          change: 15.2,
          trend: "up",
        },
        avgOrderValue: {
          current: 141,
          change: -2.4,
          trend: "down",
        },
        topProducts: [
          { name: "Luxury Handbag", sales: 145, revenue: 274050 },
          { name: "Designer Watch", sales: 89, revenue: 284800 },
          { name: "Premium Shoes", sales: 156, revenue: 138840 },
        ],
        recentActivity: [
          {
            type: "order",
            message: "New order #ORD-001234",
            time: "2 minutes ago",
          },
          {
            type: "user",
            message: "New user registered",
            time: "5 minutes ago",
          },
          {
            type: "product",
            message: "Product updated: Luxury Handbag",
            time: "10 minutes ago",
          },
        ],
      };

      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Admin Sales Analytics API
  app.get("/api/admin/analytics/sales", async (req, res) => {
    try {
      const { period, startDate, endDate, productId, userId } = req.query;

      // Mock sales analytics data
      const salesData = {
        summary: {
          totalSales: 98450.75,
          totalOrders: 456,
          totalCustomers: 234,
          averageOrderValue: 215.89,
          conversionRate: 3.2,
        },
        salesByPeriod: [
          { date: "2025-01-01", sales: 12450, orders: 45, customers: 28 },
          { date: "2025-01-02", sales: 15670, orders: 52, customers: 34 },
          { date: "2025-01-03", sales: 18920, orders: 63, customers: 41 },
          { date: "2025-01-04", sales: 22340, orders: 71, customers: 48 },
          { date: "2025-01-05", sales: 19850, orders: 58, customers: 39 },
          { date: "2025-01-06", sales: 16540, orders: 49, customers: 32 },
          { date: "2025-01-07", sales: 21680, orders: 67, customers: 44 },
        ],
        topSellingProducts: [
          {
            productId: 1,
            productName: "Premium Leather Handbag",
            category: "bags",
            totalSales: 45670,
            unitsSold: 89,
            revenue: 406830,
          },
          {
            productId: 2,
            productName: "Designer Sneakers",
            category: "shoes",
            totalSales: 67890,
            unitsSold: 134,
            revenue: 203670,
          },
          {
            productId: 3,
            productName: "Luxury Watch",
            category: "accessories",
            totalSales: 23450,
            unitsSold: 34,
            revenue: 345600,
          },
        ],
        categoryBreakdown: [
          { category: "shoes", sales: 28450, percentage: 28.9 },
          { category: "clothing", sales: 34670, percentage: 35.2 },
          { category: "bags", sales: 18920, percentage: 19.2 },
          { category: "accessories", sales: 12340, percentage: 12.5 },
          { category: "jewelry", sales: 4070, percentage: 4.1 },
        ],
        userOrderHistory: [
          {
            userId: 1,
            userName: "John Doe",
            email: "john@example.com",
            totalOrders: 8,
            totalSpent: 4520.5,
            averageOrderValue: 565.06,
            lastOrderDate: "2025-01-15",
          },
          {
            userId: 2,
            userName: "Jane Smith",
            email: "jane@example.com",
            totalOrders: 12,
            totalSpent: 7890.25,
            averageOrderValue: 657.52,
            lastOrderDate: "2025-01-14",
          },
        ],
      };

      res.json(salesData);
    } catch (error) {
      console.error("Error fetching sales analytics:", error);
      res.status(500).json({ error: "Failed to fetch sales analytics" });
    }
  });

  // Admin Reports API
  app.get("/api/admin/reports", async (req, res) => {
    try {
      const { type, period, startDate, endDate } = req.query;

      // Mock reports data
      const reports = [
        {
          id: 1,
          name: "Monthly Sales Report - January 2025",
          type: "sales",
          period: "monthly",
          generatedAt: "2025-01-15T10:00:00Z",
          fileUrl: "/reports/monthly-sales-jan-2025.pdf",
          status: "completed",
        },
        {
          id: 2,
          name: "Product Performance Report - Q4 2024",
          type: "product-performance",
          period: "quarterly",
          generatedAt: "2025-01-01T09:00:00Z",
          fileUrl: "/reports/product-performance-q4-2024.pdf",
          status: "completed",
        },
        {
          id: 3,
          name: "Customer Analytics Report - December 2024",
          type: "customer-analytics",
          period: "monthly",
          generatedAt: "2024-12-31T23:59:00Z",
          fileUrl: "/reports/customer-analytics-dec-2024.pdf",
          status: "completed",
        },
      ];

      res.json({ reports });
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  app.post("/api/admin/reports/generate", async (req, res) => {
    try {
      const { type, period, startDate, endDate, format } = req.body;

      console.log("Generating report:", {
        type,
        period,
        startDate,
        endDate,
        format,
      });

      // Mock report generation
      const report = {
        id: Date.now(),
        name: `${type} Report - ${new Date().toLocaleDateString()}`,
        type,
        period,
        format,
        status: "generating",
        generatedAt: new Date().toISOString(),
        estimatedCompletion: new Date(Date.now() + 60000).toISOString(), // 1 minute
      };

      // Simulate async report generation
      setTimeout(() => {
        report.status = "completed";
        report.fileUrl = `/reports/${report.id}.${format}`;
      }, 3000);

      res.status(201).json(report);
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  app.get("/api/admin/reports/:id/download", async (req, res) => {
    try {
      const { id } = req.params;

      // Mock file download
      console.log(`Downloading report ${id}`);

      // In real implementation, stream the file
      res.json({
        downloadUrl: `/reports/${id}.pdf`,
        message: "Report download started",
      });
    } catch (error) {
      console.error("Error downloading report:", error);
      res.status(500).json({ error: "Failed to download report" });
    }
  });

  app.delete("/api/admin/reports/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Deleting report ${id}`);

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting report:", error);
      res.status(500).json({ error: "Failed to delete report" });
    }
  });

  // Admin Settings API
  app.get("/api/admin/settings", async (req, res) => {
    try {
      // Mock settings data - in real app this would come from database
      const settings = {
        brandName: "LUV VELENCIA",
        brandLogo: "/api/placeholder/200/80",
        brandDescription: "Luxury fashion brand with timeless elegance",
        contactEmail: "admin@luvvelencia.com",
        contactPhone: "+1 (555) 123-4567",
        contactAddress: "123 Fashion Avenue, New York, NY 10001",
        deliveryCharges: 15.0,
        taxRate: 8.5,
        currency: "USD",
        minOrderAmount: 50.0,
        plugins: [
          {
            id: "inventory",
            name: "Inventory Management",
            enabled: true,
            category: "core",
          },
          {
            id: "users",
            name: "User Management",
            enabled: true,
            category: "core",
          },
          {
            id: "analytics",
            name: "Sales Analytics",
            enabled: true,
            category: "advanced",
            requiredLicense: "pro",
          },
          {
            id: "discounts",
            name: "Discounts & Coupons",
            enabled: true,
            category: "advanced",
          },
          {
            id: "contact_messages",
            name: "Contact Messages",
            enabled: true,
            category: "core",
          },
          {
            id: "delivery_tracking",
            name: "Delivery Tracking",
            enabled: true,
            category: "advanced",
            requiredLicense: "pro",
          },
          {
            id: "notifications",
            name: "Push Notifications",
            enabled: false,
            category: "premium",
            requiredLicense: "enterprise",
          },
          {
            id: "multi_currency",
            name: "Multi-Currency Support",
            enabled: true,
            category: "premium",
            requiredLicense: "enterprise",
          },
        ],
      };

      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/admin/settings", async (req, res) => {
    try {
      const settingsData = req.body;
      console.log("Updating settings:", settingsData);

      // In real app, save to database
      res.json({
        success: true,
        settings: settingsData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  app.put("/api/admin/settings/plugins/:pluginId", async (req, res) => {
    try {
      const { pluginId } = req.params;
      const { enabled } = req.body;

      console.log(
        `Toggling plugin ${pluginId} to ${enabled ? "enabled" : "disabled"}`,
      );

      res.json({
        success: true,
        pluginId,
        enabled,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error toggling plugin:", error);
      res.status(500).json({ error: "Failed to toggle plugin" });
    }
  });

  app.post("/api/admin/settings/logo/upload", async (req, res) => {
    try {
      // Mock logo upload - in real app, handle file upload to storage
      const logoUrl = "/api/placeholder/200/80";

      console.log("Logo uploaded successfully");

      res.json({
        success: true,
        logoUrl,
        uploadedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      res.status(500).json({ error: "Failed to upload logo" });
    }
  });

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validate required fields
      if (!username || !password) {
        return res.status(400).json({
          message: "Username and password are required",
        });
      }

      // Demo admin credentials
      if (username === "admin" && password === "admin123") {
        const adminUser = {
          id: 1,
          username: "admin",
          email: "admin@example.com",
          role: "admin",
          name: "Administrator",
        };

        // In real app, generate proper JWT token
        const token = "demo-admin-token-123";

        res.json({
          data: {
            user: adminUser,
            token: token,
          },
        });
      } else {
        res.status(401).json({
          message: "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(500).json({
        message: "Login failed",
      });
    }
  });

  // Admin verify token endpoint
  app.get("/api/admin/verify", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          message: "No token provided",
        });
      }

      const token = authHeader.substring(7);

      // Mock token verification - in real app, verify JWT token
      if (
        token === "demo-admin-token-123" ||
        token.startsWith("admin_token_")
      ) {
        const adminUser = {
          id: 1,
          username: "admin",
          email: "admin@example.com",
          role: "admin",
          name: "Administrator",
        };

        res.json({
          data: adminUser,
        });
      } else {
        res.status(401).json({
          message: "Invalid token",
        });
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      res.status(500).json({
        message: "Token verification failed",
      });
    }
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", async (req, res) => {
    try {
      // In real app, invalidate token in database
      res.json({
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({
        message: "Logout failed",
      });
    }
  });

  // Admin Get Single User
  app.get("/api/admin/users/:id", async (req, res) => {
    try {
      const { id } = req.params;

      // Mock user data - in real app this would come from database
      const user = {
        id,
        name: "John Doe",
        email: "john@example.com",
        provider: "email",
        isActive: true,
        totalOrders: 12,
        totalSpent: 15680,
        lastLogin: "2025-01-15",
        createdAt: "2024-03-15",
        address: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
        },
        phone: "+1 (555) 123-4567",
      };

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Admin Update User
  app.put("/api/admin/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const userData = req.body;

      console.log(`Updating user ${id}:`, userData);

      res.json({ success: true, id });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Admin Delete User
  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Deleting user ${id}`);

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Bulk Upload APIs

  // Validate CSV/Excel file
  app.post("/api/admin/bulk-upload/validate", async (req, res) => {
    try {
      const { type, data } = req.body; // type: 'products' | 'users', data: parsed CSV rows

      if (!type || !data || !Array.isArray(data)) {
        return res.status(400).json({ error: "Invalid upload data" });
      }

      const validationResults = {
        validRows: [],
        errorRows: [],
        totalRows: data.length,
        validCount: 0,
        errorCount: 0,
      };

      data.forEach((row, index) => {
        const rowNumber = index + 1;
        const errors = [];

        if (type === "products") {
          // Validate product fields
          if (!row.name || row.name.trim() === "") {
            errors.push("Product name is required");
          }
          if (
            !row.price ||
            isNaN(parseFloat(row.price)) ||
            parseFloat(row.price) <= 0
          ) {
            errors.push("Valid price is required");
          }
          if (!row.category || row.category.trim() === "") {
            errors.push("Category is required");
          }
          if (!row.imageUrl || !row.imageUrl.startsWith("http")) {
            errors.push("Valid image URL is required");
          }
          if (
            row.stock &&
            (isNaN(parseInt(row.stock)) || parseInt(row.stock) < 0)
          ) {
            errors.push("Stock must be a non-negative number");
          }
        } else if (type === "users") {
          // Validate user fields
          if (!row.name || row.name.trim() === "") {
            errors.push("User name is required");
          }
          if (!row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
            errors.push("Valid email is required");
          }
          if (row.isActive !== undefined && typeof row.isActive !== "boolean") {
            errors.push("isActive must be true or false");
          }
        }

        if (errors.length > 0) {
          validationResults.errorRows.push({
            rowNumber,
            data: row,
            errors,
          });
          validationResults.errorCount++;
        } else {
          validationResults.validRows.push({
            rowNumber,
            data: row,
          });
          validationResults.validCount++;
        }
      });

      res.json(validationResults);
    } catch (error) {
      console.error("Error validating bulk upload:", error);
      res.status(500).json({ error: "Failed to validate upload data" });
    }
  });

  // Process bulk upload
  app.post("/api/admin/bulk-upload/process", async (req, res) => {
    try {
      const { type, validRows } = req.body;

      if (!type || !validRows || !Array.isArray(validRows)) {
        return res.status(400).json({ error: "Invalid processing data" });
      }

      const results = {
        successCount: 0,
        failedCount: 0,
        failed: [],
      };

      for (const { rowNumber, data } of validRows) {
        try {
          if (type === "products") {
            // Mock product creation - in real app, save to database
            console.log(`Creating product from row ${rowNumber}:`, data);
            results.successCount++;
          } else if (type === "users") {
            // Mock user creation - in real app, save to database
            console.log(`Creating user from row ${rowNumber}:`, data);
            results.successCount++;
          }
        } catch (error) {
          results.failedCount++;
          results.failed.push({
            rowNumber,
            data,
            error: error.message,
          });
        }
      }

      res.json(results);
    } catch (error) {
      console.error("Error processing bulk upload:", error);
      res.status(500).json({ error: "Failed to process bulk upload" });
    }
  });

  // Get upload templates
  app.get("/api/admin/bulk-upload/template/:type", async (req, res) => {
    try {
      const { type } = req.params;

      const templates = {
        products: {
          filename: "products_template.csv",
          headers: [
            "name",
            "price",
            "category",
            "description",
            "imageUrl",
            "stock",
            "inStock",
          ],
          sampleData: [
            {
              name: "Sample Product",
              price: "99.99",
              category: "clothing",
              description: "Sample product description",
              imageUrl: "https://example.com/image.jpg",
              stock: "50",
              inStock: "true",
            },
          ],
        },
        users: {
          filename: "users_template.csv",
          headers: ["name", "email", "isActive", "provider"],
          sampleData: [
            {
              name: "John Doe",
              email: "john@example.com",
              isActive: "true",
              provider: "email",
            },
          ],
        },
      };

      const template = templates[type as keyof typeof templates];
      if (!template) {
        return res.status(400).json({ error: "Invalid template type" });
      }

      res.json(template);
    } catch (error) {
      console.error("Error getting template:", error);
      res.status(500).json({ error: "Failed to get template" });
    }
  });

  // Contact Messages / Feedback APIs

  // Get all contact messages
  app.get("/api/admin/contact-messages", async (req, res) => {
    try {
      const { search, status, priority, limit, offset } = req.query;

      // Mock contact messages data
      const messages = [
        {
          id: 1,
          name: "John Smith",
          email: "john@example.com",
          phone: "+1 (555) 123-4567",
          subject: "Product Quality Issue",
          message:
            "I received a damaged item in my recent order. The packaging was torn and the product has visible scratches.",
          type: "complaint",
          priority: "high",
          status: "unresolved",
          orderId: "ORD-001234",
          createdAt: "2025-01-15T10:30:00Z",
          updatedAt: "2025-01-15T10:30:00Z",
          responses: [],
        },
        {
          id: 2,
          name: "Sarah Johnson",
          email: "sarah@example.com",
          phone: "+1 (555) 987-6543",
          subject: "Shipping Inquiry",
          message:
            "Hi, I placed an order 5 days ago but haven't received any tracking information. Could you please provide an update?",
          type: "inquiry",
          priority: "medium",
          status: "resolved",
          orderId: "ORD-001235",
          createdAt: "2025-01-14T14:15:00Z",
          updatedAt: "2025-01-14T16:45:00Z",
          responses: [
            {
              id: 1,
              message:
                "Thank you for contacting us. Your order has been shipped and the tracking number is LV123456789.",
              respondedBy: "admin",
              respondedAt: "2025-01-14T16:45:00Z",
            },
          ],
        },
        {
          id: 3,
          name: "Mike Davis",
          email: "mike@example.com",
          phone: null,
          subject: "Product Suggestion",
          message:
            "I love your current collection! Would you consider adding more eco-friendly options to your product line?",
          type: "suggestion",
          priority: "low",
          status: "unresolved",
          orderId: null,
          createdAt: "2025-01-13T09:20:00Z",
          updatedAt: "2025-01-13T09:20:00Z",
          responses: [],
        },
        {
          id: 4,
          name: "Emily Chen",
          email: "emily@example.com",
          phone: "+1 (555) 456-7890",
          subject: "Size Exchange Request",
          message:
            "I need to exchange the item I purchased for a different size. The medium is too small. Do you have large available?",
          type: "exchange",
          priority: "medium",
          status: "in_progress",
          orderId: "ORD-001236",
          createdAt: "2025-01-12T11:00:00Z",
          updatedAt: "2025-01-12T11:00:00Z",
          responses: [
            {
              id: 2,
              message:
                "We'll be happy to help with the exchange. Please provide your order number and we'll check availability.",
              respondedBy: "admin",
              respondedAt: "2025-01-12T11:30:00Z",
            },
          ],
        },
      ];

      let filteredMessages = messages;

      if (search && typeof search === "string") {
        filteredMessages = messages.filter(
          (msg) =>
            msg.name.toLowerCase().includes(search.toLowerCase()) ||
            msg.email.toLowerCase().includes(search.toLowerCase()) ||
            msg.subject.toLowerCase().includes(search.toLowerCase()) ||
            msg.message.toLowerCase().includes(search.toLowerCase()),
        );
      }

      if (status && typeof status === "string") {
        filteredMessages = filteredMessages.filter(
          (msg) => msg.status === status,
        );
      }

      if (priority && typeof priority === "string") {
        filteredMessages = filteredMessages.filter(
          (msg) => msg.priority === priority,
        );
      }

      const limitNum = limit ? parseInt(limit as string) : 50;
      const offsetNum = offset ? parseInt(offset as string) : 0;

      const paginatedMessages = filteredMessages.slice(
        offsetNum,
        offsetNum + limitNum,
      );

      res.json({
        messages: paginatedMessages,
        total: filteredMessages.length,
        hasMore: offsetNum + limitNum < filteredMessages.length,
        stats: {
          total: messages.length,
          unresolved: messages.filter((m) => m.status === "unresolved").length,
          resolved: messages.filter((m) => m.status === "resolved").length,
          inProgress: messages.filter((m) => m.status === "in_progress").length,
          highPriority: messages.filter((m) => m.priority === "high").length,
        },
      });
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ error: "Failed to fetch contact messages" });
    }
  });

  // Get single contact message
  app.get("/api/admin/contact-messages/:id", async (req, res) => {
    try {
      const { id } = req.params;

      // Mock single message data
      const message = {
        id: parseInt(id),
        name: "John Smith",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        subject: "Product Quality Issue",
        message:
          "I received a damaged item in my recent order. The packaging was torn and the product has visible scratches.",
        type: "complaint",
        priority: "high",
        status: "unresolved",
        orderId: "ORD-001234",
        createdAt: "2025-01-15T10:30:00Z",
        updatedAt: "2025-01-15T10:30:00Z",
        responses: [],
      };

      res.json(message);
    } catch (error) {
      console.error("Error fetching contact message:", error);
      res.status(500).json({ error: "Failed to fetch contact message" });
    }
  });

  // Update contact message status
  app.put("/api/admin/contact-messages/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, priority } = req.body;

      console.log(
        `Updating contact message ${id} status to ${status}, priority to ${priority}`,
      );

      res.json({
        success: true,
        id: parseInt(id),
        status,
        priority,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating contact message status:", error);
      res
        .status(500)
        .json({ error: "Failed to update contact message status" });
    }
  });

  // Add response to contact message
  app.post("/api/admin/contact-messages/:id/responses", async (req, res) => {
    try {
      const { id } = req.params;
      const { message, notifyCustomer } = req.body;

      if (!message || message.trim() === "") {
        return res.status(400).json({ error: "Response message is required" });
      }

      console.log(`Adding response to contact message ${id}:`, {
        message,
        notifyCustomer,
      });

      const response = {
        id: Date.now(),
        message: message.trim(),
        respondedBy: "admin",
        respondedAt: new Date().toISOString(),
      };

      // Mock sending notification to customer if requested
      if (notifyCustomer) {
        console.log(`Sending email notification to customer for message ${id}`);
      }

      res.status(201).json(response);
    } catch (error) {
      console.error("Error adding response:", error);
      res.status(500).json({ error: "Failed to add response" });
    }
  });

  // Delete contact message
  app.delete("/api/admin/contact-messages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Deleting contact message ${id}`);

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting contact message:", error);
      res.status(500).json({ error: "Failed to delete contact message" });
    }
  });

  // Delivery Tracking APIs

  // Get delivery tracking for order
  app.get("/api/admin/orders/:id/tracking", async (req, res) => {
    try {
      const { id } = req.params;

      // Mock tracking data
      const trackingHistory = [
        {
          id: 1,
          status: "order_placed",
          location: "Mumbai, India",
          timestamp: "2025-01-15T10:00:00Z",
          description: "Order has been placed and is being processed",
          logisticsProvider: "delhivery",
        },
        {
          id: 2,
          status: "picked_up",
          location: "Mumbai Warehouse",
          timestamp: "2025-01-15T14:30:00Z",
          description: "Package has been picked up from warehouse",
          logisticsProvider: "delhivery",
        },
        {
          id: 3,
          status: "in_transit",
          location: "Delhi Hub",
          timestamp: "2025-01-16T08:15:00Z",
          description: "Package is in transit to destination city",
          logisticsProvider: "delhivery",
        },
        {
          id: 4,
          status: "out_for_delivery",
          location: "Delhi Local Facility",
          timestamp: "2025-01-17T09:00:00Z",
          description: "Package is out for delivery",
          logisticsProvider: "delhivery",
        },
      ];

      res.json({
        orderId: id,
        currentStatus: "out_for_delivery",
        estimatedDelivery: "2025-01-17T18:00:00Z",
        trackingHistory,
      });
    } catch (error) {
      console.error("Error fetching tracking:", error);
      res.status(500).json({ error: "Failed to fetch tracking information" });
    }
  });

  // Update delivery status
  app.post("/api/admin/orders/:id/tracking", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, location, description, logisticsProvider } = req.body;

      console.log(`Updating delivery status for order ${id}:`, {
        status,
        location,
        description,
      });

      // In real app, this would update database and trigger notifications
      const trackingUpdate = {
        orderId: id,
        status,
        location,
        timestamp: new Date().toISOString(),
        description,
        logisticsProvider: logisticsProvider || "manual",
      };

      // Simulate sending notification to customer
      console.log(`Sending notification to customer about status: ${status}`);

      res.status(201).json(trackingUpdate);
    } catch (error) {
      console.error("Error updating tracking:", error);
      res.status(500).json({ error: "Failed to update tracking" });
    }
  });

  // Integrate with logistics APIs
  app.post("/api/admin/orders/:id/ship", async (req, res) => {
    try {
      const { id } = req.params;
      const { logisticsProvider, shipmentDetails } = req.body;

      console.log(
        `Shipping order ${id} via ${logisticsProvider}:`,
        shipmentDetails,
      );

      // Mock logistics API integration
      const trackingNumber = `${logisticsProvider.toUpperCase()}${Date.now()}`;

      // In real app, this would call actual logistics API
      const shipmentResponse = {
        orderId: id,
        trackingNumber,
        logisticsProvider,
        status: "shipped",
        estimatedDelivery: new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        shipmentId: `SHIP_${Date.now()}`,
      };

      res.json(shipmentResponse);
    } catch (error) {
      console.error("Error creating shipment:", error);
      res.status(500).json({ error: "Failed to create shipment" });
    }
  });

  // Notification APIs

  // Get notifications
  app.get("/api/admin/notifications", async (req, res) => {
    try {
      const { type, isRead, limit = 20, offset = 0 } = req.query;

      // Mock notifications data
      const notifications = [
        {
          id: 1,
          type: "new_order",
          title: "New Order Received",
          message: "Order #ORD-001234 has been placed by John Doe",
          isRead: false,
          data: { orderId: "ORD-001234", customerName: "John Doe" },
          createdAt: "2025-01-15T14:30:00Z",
        },
        {
          id: 2,
          type: "low_stock",
          title: "Low Stock Alert",
          message: "Luxury Handbag is running low in stock (5 items left)",
          isRead: false,
          data: { productId: 1, productName: "Luxury Handbag", stock: 5 },
          createdAt: "2025-01-15T12:15:00Z",
        },
        {
          id: 3,
          type: "order_update",
          title: "Order Delivered",
          message: "Order #ORD-001233 has been delivered successfully",
          isRead: true,
          data: { orderId: "ORD-001233", status: "delivered" },
          createdAt: "2025-01-15T10:00:00Z",
        },
      ];

      let filteredNotifications = notifications;

      if (type && typeof type === "string") {
        filteredNotifications = notifications.filter((n) => n.type === type);
      }

      if (isRead !== undefined) {
        const readStatus = isRead === "true";
        filteredNotifications = filteredNotifications.filter(
          (n) => n.isRead === readStatus,
        );
      }

      const limitNum = parseInt(limit as string);
      const offsetNum = parseInt(offset as string);

      const paginatedNotifications = filteredNotifications.slice(
        offsetNum,
        offsetNum + limitNum,
      );

      res.json({
        notifications: paginatedNotifications,
        total: filteredNotifications.length,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  // Mark notification as read
  app.put("/api/admin/notifications/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Marking notification ${id} as read`);

      res.json({ success: true, id });
    } catch (error) {
      console.error("Error updating notification:", error);
      res.status(500).json({ error: "Failed to update notification" });
    }
  });

  // Send notification (email/SMS)
  app.post("/api/admin/notifications/send", async (req, res) => {
    try {
      const { type, recipient, subject, message, data } = req.body;

      console.log(`Sending ${type} notification to ${recipient}:`, {
        subject,
        message,
      });

      // Mock email/SMS sending
      // In real app, integrate with Nodemailer, Twilio, or Firebase
      const notificationResult = {
        id: Date.now(),
        type,
        recipient,
        subject,
        message,
        status: "sent",
        sentAt: new Date().toISOString(),
      };

      res.status(201).json(notificationResult);
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // Multi-currency APIs

  // Get exchange rates
  app.get("/api/admin/currencies/rates", async (req, res) => {
    try {
      // Mock exchange rates - in real app, fetch from API like exchangerate-api.com
      const exchangeRates = {
        USD: 1.0,
        EUR: 0.85,
        INR: 83.25,
        GBP: 0.73,
        CAD: 1.35,
        AUD: 1.45,
        lastUpdated: new Date().toISOString(),
      };

      res.json(exchangeRates);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      res.status(500).json({ error: "Failed to fetch exchange rates" });
    }
  });

  // Update exchange rates
  app.put("/api/admin/currencies/rates", async (req, res) => {
    try {
      const { rates } = req.body;
      console.log("Updating exchange rates:", rates);

      // In real app, save to database
      const updatedRates = {
        ...rates,
        lastUpdated: new Date().toISOString(),
      };

      res.json(updatedRates);
    } catch (error) {
      console.error("Error updating exchange rates:", error);
      res.status(500).json({ error: "Failed to update exchange rates" });
    }
  });

  // Convert price
  app.post("/api/admin/currencies/convert", async (req, res) => {
    try {
      const { amount, fromCurrency, toCurrency } = req.body;

      // Mock conversion rates
      const rates = {
        USD: 1.0,
        EUR: 0.85,
        INR: 83.25,
        GBP: 0.73,
      };

      const fromRate = rates[fromCurrency as keyof typeof rates] || 1;
      const toRate = rates[toCurrency as keyof typeof rates] || 1;

      const convertedAmount = (amount / fromRate) * toRate;

      res.json({
        originalAmount: amount,
        convertedAmount: Math.round(convertedAmount * 100) / 100,
        fromCurrency,
        toCurrency,
        exchangeRate: toRate / fromRate,
      });
    } catch (error) {
      console.error("Error converting currency:", error);
      res.status(500).json({ error: "Failed to convert currency" });
    }
  });

  // Admin Toggle User Status
  app.patch("/api/admin/users/:id/toggle-status", async (req, res) => {
    try {
      const { id } = req.params;

      // Mock toggling user status
      const isActive = Math.random() > 0.5;
      console.log(
        `Toggling user ${id} status to ${isActive ? "active" : "inactive"}`,
      );

      res.json({ success: true, id, isActive });
    } catch (error) {
      console.error("Error toggling user status:", error);
      res.status(500).json({ error: "Failed to toggle user status" });
    }
  });

  // Admin Get Single Product
  app.get("/api/admin/products/:id", async (req, res) => {
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

      // Add admin-specific data
      const adminProduct = {
        ...product,
        sales: Math.floor(Math.random() * 100) + 10,
        inStock: Math.random() > 0.2,
        sizes: product.sizes ? JSON.parse(product.sizes) : [],
        colors: product.colors ? JSON.parse(product.colors) : [],
        materials: product.materials ? JSON.parse(product.materials) : [],
        images: product.images
          ? JSON.parse(product.images)
          : [product.imageUrl],
        coverImageIndex: product.coverImageIndex || 0,
        hasVariants: product.hasVariants || false,
        variants: [], // Mock variants - in real app would come from variants table
        createdAt: new Date(
          Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split("T")[0],
        updatedAt: new Date().toISOString(),
      };

      res.json(adminProduct);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Admin Product Variants Management
  app.get("/api/admin/products/:id/variants", async (req, res) => {
    try {
      const { id } = req.params;

      // Mock variants data
      const variants = [
        {
          id: "1",
          sku: `${id}-S-RED`,
          size: "S",
          color: "Red",
          material: "Cotton",
          price: null,
          stock: 25,
          lowStockThreshold: 10,
          isActive: true,
          stockStatus: "in-stock",
        },
        {
          id: "2",
          sku: `${id}-M-BLUE`,
          size: "M",
          color: "Blue",
          material: "Cotton",
          price: null,
          stock: 5,
          lowStockThreshold: 10,
          isActive: true,
          stockStatus: "low-stock",
        },
      ];

      res.json({ variants });
    } catch (error) {
      console.error("Error fetching variants:", error);
      res.status(500).json({ error: "Failed to fetch variants" });
    }
  });

  app.post("/api/admin/products/:id/variants", async (req, res) => {
    try {
      const { id } = req.params;
      const variantData = req.body;

      console.log(`Creating variant for product ${id}:`, variantData);

      const newVariant = {
        id: Date.now().toString(),
        ...variantData,
        createdAt: new Date().toISOString(),
      };

      res.status(201).json(newVariant);
    } catch (error) {
      console.error("Error creating variant:", error);
      res.status(500).json({ error: "Failed to create variant" });
    }
  });

  app.put("/api/admin/products/:id/variants/:variantId", async (req, res) => {
    try {
      const { id, variantId } = req.params;
      const variantData = req.body;

      console.log(
        `Updating variant ${variantId} for product ${id}:`,
        variantData,
      );

      res.json({ success: true, id: variantId, ...variantData });
    } catch (error) {
      console.error("Error updating variant:", error);
      res.status(500).json({ error: "Failed to update variant" });
    }
  });

  app.delete(
    "/api/admin/products/:id/variants/:variantId",
    async (req, res) => {
      try {
        const { id, variantId } = req.params;

        console.log(`Deleting variant ${variantId} for product ${id}`);

        res.json({ success: true });
      } catch (error) {
        console.error("Error deleting variant:", error);
        res.status(500).json({ error: "Failed to delete variant" });
      }
    },
  );

  // Admin Image Management
  app.post("/api/admin/products/images/upload", async (req, res) => {
    try {
      // Mock image upload
      const uploadedImages = [
        "https://via.placeholder.com/400x400/1",
        "https://via.placeholder.com/400x400/2",
      ];

      console.log("Images uploaded successfully");

      res.json({ images: uploadedImages });
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(500).json({ error: "Failed to upload images" });
    }
  });

  app.put("/api/admin/products/:id/images/reorder", async (req, res) => {
    try {
      const { id } = req.params;
      const { imageOrder } = req.body;

      console.log(`Reordering images for product ${id}:`, imageOrder);

      res.json({ success: true, imageOrder });
    } catch (error) {
      console.error("Error reordering images:", error);
      res.status(500).json({ error: "Failed to reorder images" });
    }
  });

  app.put("/api/admin/products/:id/images/cover", async (req, res) => {
    try {
      const { id } = req.params;
      const { imageIndex } = req.body;

      console.log(
        `Setting cover image for product ${id} to index ${imageIndex}`,
      );

      res.json({ success: true, coverImageIndex: imageIndex });
    } catch (error) {
      console.error("Error setting cover image:", error);
      res.status(500).json({ error: "Failed to set cover image" });
    }
  });

  app.delete("/api/admin/products/:id/images", async (req, res) => {
    try {
      const { id } = req.params;
      const { imageUrl } = req.body;

      console.log(`Deleting image ${imageUrl} for product ${id}`);

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "Failed to delete image" });
    }
  });

  // Admin Get Product Categories
  app.get("/api/admin/products/categories", async (req, res) => {
    try {
      const categories = [
        { id: "shoes", name: "Shoes", count: 45 },
        { id: "clothing", name: "Clothing", count: 78 },
        { id: "bags", name: "Bags", count: 32 },
        { id: "jewelry", name: "Jewelry", count: 23 },
        { id: "accessories", name: "Accessories", count: 56 },
      ];

      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Admin Discounts API
  app.get("/api/admin/discounts", async (req, res) => {
    try {
      const { search, status, type, limit, offset } = req.query;

      // Mock discounts data
      const discounts = [
        {
          id: 1,
          name: "Summer Sale",
          description: "25% off on all summer collection",
          type: "percentage",
          value: 25,
          startDate: "2025-06-01",
          endDate: "2025-08-31",
          isActive: true,
          applicationType: "category",
          targetCategories: ["clothing", "shoes"],
          minOrderAmount: 100,
          maxDiscountAmount: 500,
          usageLimit: 1000,
          usageCount: 156,
          createdAt: "2025-01-01",
          updatedAt: "2025-01-15",
        },
        {
          id: 2,
          name: "New Customer Discount",
          description: "$20 off for new customers",
          type: "fixed_amount",
          value: 20,
          startDate: "2025-01-01",
          endDate: "2025-12-31",
          isActive: true,
          applicationType: "global",
          targetCategories: [],
          minOrderAmount: 50,
          maxDiscountAmount: null,
          usageLimit: null,
          usageCount: 89,
          createdAt: "2025-01-01",
          updatedAt: "2025-01-10",
        },
        {
          id: 3,
          name: "Premium Product Discount",
          description: "15% off on selected premium items",
          type: "percentage",
          value: 15,
          startDate: "2025-02-01",
          endDate: "2025-02-28",
          isActive: false,
          applicationType: "product",
          targetProductIds: [1, 5, 12],
          minOrderAmount: null,
          maxDiscountAmount: 200,
          usageLimit: 500,
          usageCount: 234,
          createdAt: "2025-01-15",
          updatedAt: "2025-01-20",
        },
      ];

      let filteredDiscounts = discounts;

      if (search && typeof search === "string") {
        filteredDiscounts = discounts.filter(
          (discount) =>
            discount.name.toLowerCase().includes(search.toLowerCase()) ||
            discount.description.toLowerCase().includes(search.toLowerCase()),
        );
      }

      if (status && typeof status === "string") {
        const isActive = status === "active";
        filteredDiscounts = filteredDiscounts.filter(
          (discount) => discount.isActive === isActive,
        );
      }

      if (type && typeof type === "string") {
        filteredDiscounts = filteredDiscounts.filter(
          (discount) => discount.type === type,
        );
      }

      const limitNum = limit ? parseInt(limit as string) : 50;
      const offsetNum = offset ? parseInt(offset as string) : 0;

      const paginatedDiscounts = filteredDiscounts.slice(
        offsetNum,
        offsetNum + limitNum,
      );

      res.json({
        discounts: paginatedDiscounts,
        total: filteredDiscounts.length,
        hasMore: offsetNum + limitNum < filteredDiscounts.length,
      });
    } catch (error) {
      console.error("Error fetching discounts:", error);
      res.status(500).json({ error: "Failed to fetch discounts" });
    }
  });

  app.get("/api/admin/discounts/:id", async (req, res) => {
    try {
      const { id } = req.params;

      // Mock single discount data
      const discount = {
        id: parseInt(id),
        name: "Summer Sale",
        description: "25% off on all summer collection",
        type: "percentage",
        value: 25,
        startDate: "2025-06-01",
        endDate: "2025-08-31",
        isActive: true,
        applicationType: "category",
        targetCategories: ["clothing", "shoes"],
        minOrderAmount: 100,
        maxDiscountAmount: 500,
        usageLimit: 1000,
        usageCount: 156,
        createdAt: "2025-01-01",
        updatedAt: "2025-01-15",
      };

      res.json(discount);
    } catch (error) {
      console.error("Error fetching discount:", error);
      res.status(500).json({ error: "Failed to fetch discount" });
    }
  });

  app.post("/api/admin/discounts", async (req, res) => {
    try {
      const discountData = req.body;
      console.log("Creating discount:", discountData);

      const newDiscount = {
        id: Date.now(),
        ...discountData,
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      res.status(201).json(newDiscount);
    } catch (error) {
      console.error("Error creating discount:", error);
      res.status(500).json({ error: "Failed to create discount" });
    }
  });

  app.put("/api/admin/discounts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const discountData = req.body;

      console.log(`Updating discount ${id}:`, discountData);

      res.json({
        success: true,
        id: parseInt(id),
        ...discountData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating discount:", error);
      res.status(500).json({ error: "Failed to update discount" });
    }
  });

  app.delete("/api/admin/discounts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Deleting discount ${id}`);

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting discount:", error);
      res.status(500).json({ error: "Failed to delete discount" });
    }
  });

  // Admin Coupons API
  app.get("/api/admin/coupons", async (req, res) => {
    try {
      const { search, status, discountId, limit, offset } = req.query;

      // Mock coupons data
      const coupons = [
        {
          id: 1,
          code: "SUMMER25",
          discountId: 1,
          discountName: "Summer Sale",
          usageLimit: 100,
          usageCount: 45,
          isActive: true,
          createdAt: "2025-01-01",
          updatedAt: "2025-01-15",
        },
        {
          id: 2,
          code: "WELCOME20",
          discountId: 2,
          discountName: "New Customer Discount",
          usageLimit: null,
          usageCount: 89,
          isActive: true,
          createdAt: "2025-01-01",
          updatedAt: "2025-01-10",
        },
        {
          id: 3,
          code: "PREMIUM15",
          discountId: 3,
          discountName: "Premium Product Discount",
          usageLimit: 50,
          usageCount: 50,
          isActive: false,
          createdAt: "2025-01-15",
          updatedAt: "2025-01-20",
        },
      ];

      let filteredCoupons = coupons;

      if (search && typeof search === "string") {
        filteredCoupons = coupons.filter(
          (coupon) =>
            coupon.code.toLowerCase().includes(search.toLowerCase()) ||
            coupon.discountName.toLowerCase().includes(search.toLowerCase()),
        );
      }

      if (status && typeof status === "string") {
        const isActive = status === "active";
        filteredCoupons = filteredCoupons.filter(
          (coupon) => coupon.isActive === isActive,
        );
      }

      if (discountId && typeof discountId === "string") {
        filteredCoupons = filteredCoupons.filter(
          (coupon) => coupon.discountId === parseInt(discountId),
        );
      }

      const limitNum = limit ? parseInt(limit as string) : 50;
      const offsetNum = offset ? parseInt(offset as string) : 0;

      const paginatedCoupons = filteredCoupons.slice(
        offsetNum,
        offsetNum + limitNum,
      );

      res.json({
        coupons: paginatedCoupons,
        total: filteredCoupons.length,
        hasMore: offsetNum + limitNum < filteredCoupons.length,
      });
    } catch (error) {
      console.error("Error fetching coupons:", error);
      res.status(500).json({ error: "Failed to fetch coupons" });
    }
  });

  app.post("/api/admin/coupons", async (req, res) => {
    try {
      const couponData = req.body;
      console.log("Creating coupon:", couponData);

      const newCoupon = {
        id: Date.now(),
        ...couponData,
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      res.status(201).json(newCoupon);
    } catch (error) {
      console.error("Error creating coupon:", error);
      res.status(500).json({ error: "Failed to create coupon" });
    }
  });

  app.put("/api/admin/coupons/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const couponData = req.body;

      console.log(`Updating coupon ${id}:`, couponData);

      res.json({
        success: true,
        id: parseInt(id),
        ...couponData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating coupon:", error);
      res.status(500).json({ error: "Failed to update coupon" });
    }
  });

  app.delete("/api/admin/coupons/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Deleting coupon ${id}`);

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting coupon:", error);
      res.status(500).json({ error: "Failed to delete coupon" });
    }
  });

  // Admin Get Single Order
  app.get("/api/admin/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;

      // Mock order data - in real app this would come from database
      const order = {
        id,
        userId: "1",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        items: [
          {
            productId: 1,
            productName: "Luxury Handbag",
            quantity: 1,
            price: 1890,
            image:
              "https://media.gucci.com/style/DarkGray_Center_0_0_490x490/1746033325/835220_XDDCY_4452_001_100_0000_Light-Washed-denim-shirt-with-GG-insert.jpg",
          },
        ],
        total: 1890,
        status: "processing",
        trackingNumber: "LV123456789",
        createdAt: "2025-01-15",
        updatedAt: "2025-01-15",
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
        },
        billingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
        },
        paymentMethod: {
          type: "credit_card",
          last4: "1234",
          brand: "visa",
        },
      };

      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Admin Generate Bill
  app.get("/api/admin/orders/:id/bill", async (req, res) => {
    try {
      const { id } = req.params;

      // Mock bill generation
      const bill = {
        orderId: id,
        billNumber: `BILL-${Date.now()}`,
        generatedAt: new Date().toISOString(),
        downloadUrl: `/api/admin/orders/${id}/bill/download`,
      };

      res.json(bill);
    } catch (error) {
      console.error("Error generating bill:", error);
      res.status(500).json({ error: "Failed to generate bill" });
    }
  });

  // Firebase Authentication
  app.post("/api/auth/firebase-login", async (req, res) => {
    try {
      const { firebaseUID, email, name, photoURL, idToken } = req.body;

      if (!firebaseUID || !email) {
        return res
          .status(400)
          .json({ error: "Firebase UID and email are required" });
      }

      // Check if user exists in backend by Firebase UID
      let user = await storage.getUserByFirebaseUID(firebaseUID);

      if (!user) {
        // Create new user in backend
        user = await storage.createUser({
          email,
          name: name || email.split("@")[0],
          provider: "google",
          firebaseUID,
          photoURL,
        });
      } else {
        // Update existing user's info
        user = await storage.updateUser(user.id, {
          name: name || user.name,
          photoURL: photoURL || user.photoURL,
          lastLogin: new Date().toISOString(),
        });
      }

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        firebaseUID: user.firebaseUID,
        photoURL: user.photoURL,
      });
    } catch (error) {
      console.error("Firebase login error:", error);
      res.status(500).json({ error: "Failed to authenticate user" });
    }
  });

  return server;
}
