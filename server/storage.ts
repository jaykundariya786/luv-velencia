import { products, savedItems, type Product, type InsertProduct, type SavedItem, type InsertSavedItem, type CategoryFilter, type LineFilter, type SortOption } from "@shared/schema";

interface User {
  id: string;
  email: string;
  name: string;
  provider: 'email' | 'google' | 'apple';
  firebaseUID?: string;
  photoURL?: string;
  lastLogin?: string;
  createdAt: string;
}

interface InsertUser {
  email: string;
  name: string;
  provider: 'email' | 'google' | 'apple';
  firebaseUID?: string;
  photoURL?: string;
}

export interface IStorage {
  getProducts(filters?: {
    category?: CategoryFilter;
    line?: LineFilter;
    sort?: SortOption;
    search?: string;
  }, limit?: number, offset?: number): Promise<{ products: Product[], total: number }>;
  getProduct(id: number): Promise<Product | undefined>;
  getSavedItems(sessionId: string): Promise<Product[]>;
  saveItem(sessionId: string, productId: number): Promise<SavedItem>;
  removeSavedItem(sessionId: string, productId: number): Promise<void>;
  isItemSaved(sessionId: string, productId: number): Promise<boolean>;
  addRecentlyViewed(sessionId: string, productId: number): Promise<void>;
  getRecentlyViewed(sessionId: string): Promise<Product[]>;
  getUserByFirebaseUID(firebaseUID: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private savedItems: Map<string, SavedItem>;
  private recentlyViewed: Map<string, number[]>;
  private users: Map<string, User>;
  private currentProductId: number;
  private currentSavedId: number;
  private currentUserId: number;

  constructor() {
    this.products = new Map();
    this.savedItems = new Map();
    this.recentlyViewed = new Map();
    this.users = new Map();
    this.currentProductId = 1;
    this.currentSavedId = 1;
    this.currentUserId = 1;
    this.seedData();
  }

  private seedData() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Men's Gucci Re-Web sneaker",
        price: "1150.00",
        category: "shoes",
        line: "gucci-re-web",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Modern luxury sneakers with premium materials"
      },
      {
        name: "Washed denim pant with GG insert",
        price: "1550.00",
        category: "clothing",
        line: "gg-canvas",
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Premium designer jeans with GG pattern"
      },
      {
        name: "Washed denim shirt with GG insert",
        price: "2250.00",
        category: "clothing",
        line: "gg-canvas",
        imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Luxury denim shirt with designer details"
      },
      {
        name: "Technical cotton jersey T-shirt with print",
        price: "1350.00",
        category: "clothing",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1626497764746-6dc36546b388?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Premium cotton t-shirt with artistic print"
      },
      {
        name: "Gucci Staffa charm bracelet",
        price: "450.00",
        category: "jewelry",
        line: "staffa",
        imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Elegant silver charm bracelet with luxury finish"
      },
      {
        name: "Ophidia medium backpack",
        price: "2450.00",
        category: "bags",
        line: "ophidia",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Luxury medium backpack with signature Ophidia design"
      },
      {
        name: "Slim fit denim pant with logo detail",
        price: "1100.00",
        category: "clothing",
        imageUrl: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Slim fit designer jeans with logo detail"
      },
      {
        name: "Printed silk twill bowling shirt",
        price: "1550.00",
        category: "clothing",
        imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Luxury printed silk twill bowling shirt"
      },
      {
        name: "Printed technical poplin swim shorts",
        price: "850.00",
        category: "clothing",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Technical poplin swim shorts with luxury print"
      },
      {
        name: "Men's driver with Horsebit",
        price: "970.00",
        category: "shoes",
        imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Men's driver shoes with signature Horsebit detail"
      },
      {
        name: "Gucci Chroma small crossbody bag",
        price: "1980.00",
        category: "bags",
        line: "chroma",
        imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Designer small crossbody bag with contemporary styling"
      },
      {
        name: "Gucci Staffa long pendant necklace",
        price: "520.00",
        category: "jewelry",
        line: "staffa",
        imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Gucci Staffa long pendant necklace in silver"
      },
      {
        name: "GG Canvas tote bag with leather trim",
        price: "2980.00",
        category: "bags",
        line: "gg-canvas",
        imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Large GG Canvas tote bag with leather trim and handles"
      },
      {
        name: "Men's Ace leather sneaker",
        price: "790.00",
        category: "shoes",
        imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Classic white leather sneaker with green and red web"
      },
      {
        name: "Wool cashmere blend sweater",
        price: "1850.00",
        category: "clothing",
        imageUrl: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Premium wool cashmere blend sweater with ribbed details"
      },
      {
        name: "Dionysus small shoulder bag",
        price: "2350.00",
        category: "bags",
        line: "dionysus",
        imageUrl: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Small shoulder bag with tiger head closure"
      },
      {
        name: "GG Marmont matelassé mini bag",
        price: "1790.00",
        category: "bags",
        line: "gg-marmont",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Mini matelassé shoulder bag with chain strap"
      },
      {
        name: "Princetown leather slipper",
        price: "890.00",
        category: "shoes",
        imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Leather slipper with Horsebit detail"
      },
      {
        name: "Cotton jersey polo with tiger",
        price: "1250.00",
        category: "clothing",
        imageUrl: "https://images.unsplash.com/photo-1626497764746-6dc36546b388?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Cotton jersey polo with embroidered tiger detail"
      },
      {
        name: "Interlocking G cufflinks",
        price: "350.00",
        category: "jewelry",
        imageUrl: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Silver-toned cufflinks with Interlocking G design"
      },
      {
        name: "Linen silk blend shorts",
        price: "950.00",
        category: "clothing",
        imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Lightweight linen silk blend shorts for summer"
      },
      {
        name: "Web stripe wool scarf",
        price: "485.00",
        category: "accessories",
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Wool scarf with signature green and red web stripe"
      },
      {
        name: "Jackie 1961 small hobo bag",
        price: "3200.00",
        category: "bags",
        line: "jackie-1961",
        imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Small hobo bag inspired by the Jackie collection"
      },
      {
        name: "Rhyton leather sneaker",
        price: "890.00",
        category: "shoes",
        imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Chunky leather sneaker with vintage-inspired design"
      },
      {
        name: "Silk twill shirt with print",
        price: "1680.00",
        category: "clothing",
        imageUrl: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Silk twill shirt with artistic floral print"
      },
      {
        name: "GG belt with double G buckle",
        price: "450.00",
        category: "accessories",
        line: "gg-canvas",
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "GG Supreme canvas belt with Double G buckle"
      },
      {
        name: "Leather chain wallet",
        price: "1250.00",
        category: "accessories",
        imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Leather chain wallet with multiple card slots"
      },
      {
        name: "Bamboo 1947 small top handle bag",
        price: "2890.00",
        category: "bags",
        line: "bamboo-1947",
        imageUrl: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Small top handle bag with bamboo detail"
      },
      {
        name: "Reversible leather belt",
        price: "520.00",
        category: "accessories",
        imageUrl: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Reversible leather belt in black and brown"
      },
      {
        name: "Tennis 1977 sneaker",
        price: "850.00",
        category: "shoes",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Classic tennis sneaker with vintage-inspired design"
      },
      {
        name: "Ophidia GG continental wallet",
        price: "690.00",
        category: "accessories",
        line: "ophidia",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        altImageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        description: "Continental wallet in GG Supreme canvas"
      }
    ];

    sampleProducts.forEach(product => {
      const id = this.currentProductId++;
      this.products.set(id, { ...product, id });
    });
  }

  async getProducts(filters?: {
    category?: CategoryFilter;
    line?: LineFilter;
    sort?: SortOption;
    search?: string;
    colors?: string[];
    materials?: string[];
  }, limit?: number, offset: number = 0): Promise<{ products: Product[]; total: number; }> {
    let productsArray = Array.from(this.products.values());

    // Apply filters
    if (filters?.category) {
      productsArray = productsArray.filter(p => p.category === filters.category);
    }

    if (filters?.line) {
      productsArray = productsArray.filter(p => p.line === filters.line);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      productsArray = productsArray.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by colors (check if product name or description contains any of the selected colors)
    if (filters?.colors && filters.colors.length > 0) {
      productsArray = productsArray.filter(p => {
        const productText = `${p.name} ${p.description || ""}`.toLowerCase();
        return filters.colors!.some(color => productText.includes(color));
      });
    }

    // Filter by materials (check if product name or description contains any of the selected materials)
    if (filters?.materials && filters.materials.length > 0) {
      productsArray = productsArray.filter(p => {
        const productText = `${p.name} ${p.description || ""}`.toLowerCase();
        return filters.materials!.some(material => {
          // Handle special cases for material matching
          if (material === "gg canvas") return productText.includes("gg canvas") || productText.includes("canvas");
          if (material === "ready-to-wear") return productText.includes("ready-to-wear") || productText.includes("shirt") || productText.includes("polo");
          return productText.includes(material);
        });
      });
    }

    // Apply sorting
    switch (filters?.sort) {
      case "price-low-to-high":
        productsArray.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high-to-low":
        productsArray.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "newest":
        productsArray.sort((a, b) => b.id - a.id);
        break;
      default:
        // Default to newest
        productsArray.sort((a, b) => b.id - a.id);
        break;
    }

    const total = productsArray.length;

    // Apply pagination
    if (limit !== undefined) {
      productsArray = productsArray.slice(offset, offset + limit);
    }

    return { products: productsArray, total };
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getSavedItems(sessionId: string): Promise<Product[]> {
    const savedProducts: Product[] = [];

    for (const savedItem of this.savedItems.values()) {
      if (savedItem.sessionId === sessionId) {
        const product = this.products.get(savedItem.productId);
        if (product) {
          savedProducts.push(product);
        }
      }
    }

    return savedProducts;
  }

  async saveItem(sessionId: string, productId: number): Promise<SavedItem> {
    const id = this.currentSavedId++;
    const savedItem: SavedItem = { id, sessionId, productId };
    this.savedItems.set(`${sessionId}-${productId}`, savedItem);
    return savedItem;
  }

  async removeSavedItem(sessionId: string, productId: number): Promise<void> {
    this.savedItems.delete(`${sessionId}-${productId}`);
  }

  async isItemSaved(sessionId: string, productId: number): Promise<boolean> {
    return this.savedItems.has(`${sessionId}-${productId}`);
  }

  async getProductById(id: number) {
    return this.products.get(id);
  }

  async addRecentlyViewed(sessionId: string, productId: number): Promise<void> {
    let viewedProducts = this.recentlyViewed.get(sessionId) || [];

    // Remove if already exists (to move to front)
    viewedProducts = viewedProducts.filter(id => id !== productId);

    // Add to front
    viewedProducts.unshift(productId);

    // Keep only last 10 items
    if (viewedProducts.length > 10) {
      viewedProducts = viewedProducts.slice(0, 10);
    }

    this.recentlyViewed.set(sessionId, viewedProducts);
  }

  async getRecentlyViewed(sessionId: string): Promise<Product[]> {
    const viewedProductIds = this.recentlyViewed.get(sessionId) || [];
    const products: Product[] = [];

    for (const productId of viewedProductIds) {
      const product = this.products.get(productId);
      if (product) {
        products.push(product);
      }
    }

    return products;
  }

  async getUserByFirebaseUID(firebaseUID: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.firebaseUID === firebaseUID) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = (this.currentUserId++).toString();
    const user: User = {
      id,
      ...insertUser,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser: User = {
      ...user,
      ...updates
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();