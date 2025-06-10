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
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(data: any): Promise<Product>;
  updateProduct(id: number, updates: any): Promise<Product | null>;
  deleteProduct(id: number): Promise<boolean>;
  getCategories(): Promise<string[]>;
  getSavedItems(sessionId: string): Promise<Product[]>;
  saveItem(sessionId: string, productId: number): Promise<SavedItem>;
  removeSavedItem(sessionId: string, productId: number): Promise<void>;
  isItemSaved(sessionId: string, productId: number): Promise<boolean>;
  addRecentlyViewed(sessionId: string, productId: number): Promise<void>;
  getRecentlyViewed(sessionId: string): Promise<Product[]>;
  getUserByFirebaseUID(firebaseUID: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  getUserById(id: string): Promise<User | undefined>;
  getUsers(params: { search?: string; limit: number; offset: number }): Promise<{ users: User[]; total: number }>;
  getOrders(params: { status?: string; search?: string; limit: number; offset: number }): Promise<{ orders: any[]; total: number }>;
  getOrderById(id: string): Promise<any | undefined>;
  updateOrderStatus(id: string, status: string, trackingNumber?: string): Promise<any | null>;
  getAnalytics(): Promise<any>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private savedItems: Map<string, SavedItem>;
  private recentlyViewed: Map<string, number[]>;
  private users: Map<string, User>;
  private orders: Map<string, any>;
  private currentProductId: number;
  private currentSavedId: number;
  private currentUserId: number;
  private currentOrderId: number;

  constructor() {
    this.products = new Map();
    this.savedItems = new Map();
    this.recentlyViewed = new Map();
    this.users = new Map();
    this.orders = new Map();
    this.currentProductId = 1;
    this.currentSavedId = 1;
    this.currentUserId = 1;
    this.currentOrderId = 1;
    this.seedData();
  }

  private seedData() {
    const sampleProducts: InsertProduct[] = [
  // JEANS - 10 items
  {
    id: 1,
    name: "Classic Straight Leg Jeans",
    price: 120,
    category: "jeans",
    line: "classic",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    altImageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Classic straight-leg jeans crafted from premium denim with a comfortable fit.",
    inStock: true,
    stock: 25,
    lowStockThreshold: 10,
    sizes: JSON.stringify(["28", "30", "32", "34", "36", "38"]),
    colors: JSON.stringify(["Dark Blue", "Light Blue"]),
    materials: JSON.stringify(["Cotton", "Elastane"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 2,
    name: "Skinny Fit Jeans",
    price: 95,
    category: "jeans",
    line: "slim",
    imageUrl: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Modern skinny fit jeans with stretch for comfort and style.",
    inStock: true,
    stock: 30,
    lowStockThreshold: 10,
    sizes: JSON.stringify(["28", "30", "32", "34", "36"]),
    colors: JSON.stringify(["Black", "Dark Blue", "Grey"]),
    materials: JSON.stringify(["Cotton", "Polyester", "Elastane"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 3,
    name: "Relaxed Fit Jeans",
    price: 110,
    category: "jeans",
    line: "comfort",
    imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Comfortable relaxed fit jeans perfect for casual wear.",
    inStock: true,
    stock: 20,
    lowStockThreshold: 8,
    sizes: JSON.stringify(["30", "32", "34", "36", "38", "40"]),
    colors: JSON.stringify(["Medium Blue", "Light Blue"]),
    materials: JSON.stringify(["Cotton"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: false,
  },
  {
    id: 4,
    name: "Distressed Denim Jeans",
    price: 140,
    category: "jeans",
    line: "vintage",
    imageUrl: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Trendy distressed jeans with authentic vintage styling.",
    inStock: true,
    stock: 15,
    lowStockThreshold: 5,
    sizes: JSON.stringify(["28", "30", "32", "34", "36"]),
    colors: JSON.stringify(["Light Blue", "Medium Blue"]),
    materials: JSON.stringify(["Cotton", "Polyester"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: false,
  },
  {
    id: 5,
    name: "High-Waisted Jeans",
    price: 125,
    category: "jeans",
    line: "modern",
    imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Stylish high-waisted jeans with a flattering silhouette.",
    inStock: true,
    stock: 22,
    lowStockThreshold: 8,
    sizes: JSON.stringify(["26", "28", "30", "32", "34"]),
    colors: JSON.stringify(["Dark Blue", "Black"]),
    materials: JSON.stringify(["Cotton", "Elastane"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 6,
    name: "Bootcut Jeans",
    price: 115,
    category: "jeans",
    line: "classic",
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Classic bootcut jeans with a timeless design.",
    inStock: true,
    stock: 18,
    lowStockThreshold: 7,
    sizes: JSON.stringify(["30", "32", "34", "36", "38"]),
    colors: JSON.stringify(["Dark Blue", "Medium Blue"]),
    materials: JSON.stringify(["Cotton"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: false,
  },
  {
    id: 7,
    name: "Slim Tapered Jeans",
    price: 130,
    category: "jeans",
    line: "modern",
    imageUrl: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Contemporary slim tapered jeans for a modern look.",
    inStock: true,
    stock: 24,
    lowStockThreshold: 9,
    sizes: JSON.stringify(["28", "30", "32", "34", "36"]),
    colors: JSON.stringify(["Black", "Dark Blue", "Grey"]),
    materials: JSON.stringify(["Cotton", "Elastane"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 8,
    name: "Raw Denim Jeans",
    price: 160,
    category: "jeans",
    line: "premium",
    imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Premium raw denim jeans for denim enthusiasts.",
    inStock: true,
    stock: 12,
    lowStockThreshold: 5,
    sizes: JSON.stringify(["30", "32", "34", "36"]),
    colors: JSON.stringify(["Indigo", "Black"]),
    materials: JSON.stringify(["Cotton"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: false,
  },
  {
    id: 9,
    name: "Stretch Comfort Jeans",
    price: 105,
    category: "jeans",
    line: "comfort",
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Ultra-comfortable stretch jeans for all-day wear.",
    inStock: true,
    stock: 28,
    lowStockThreshold: 10,
    sizes: JSON.stringify(["28", "30", "32", "34", "36", "38"]),
    colors: JSON.stringify(["Medium Blue", "Dark Blue"]),
    materials: JSON.stringify(["Cotton", "Polyester", "Elastane"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 10,
    name: "Vintage Wash Jeans",
    price: 135,
    category: "jeans",
    line: "vintage",
    imageUrl: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Authentic vintage wash jeans with character and style.",
    inStock: true,
    stock: 16,
    lowStockThreshold: 6,
    sizes: JSON.stringify(["30", "32", "34", "36"]),
    colors: JSON.stringify(["Light Blue", "Medium Blue"]),
    materials: JSON.stringify(["Cotton"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: false,
  },

  // SHIRTS - 10 items
  {
    id: 11,
    name: "Classic White Dress Shirt",
    price: 85,
    category: "shirt",
    line: "formal",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Crisp white dress shirt perfect for formal occasions.",
    inStock: true,
    stock: 35,
    lowStockThreshold: 12,
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    colors: JSON.stringify(["White"]),
    materials: JSON.stringify(["Cotton"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: false,
  },
  {
    id: 12,
    name: "Casual Button-Down Shirt",
    price: 70,
    category: "shirt",
    line: "casual",
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Comfortable casual button-down shirt for everyday wear.",
    inStock: true,
    stock: 42,
    lowStockThreshold: 15,
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    colors: JSON.stringify(["Blue", "White", "Grey"]),
    materials: JSON.stringify(["Cotton", "Polyester"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 13,
    name: "Striped Oxford Shirt",
    price: 95,
    category: "shirt",
    line: "smart-casual",
    imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Classic striped Oxford shirt with timeless appeal.",
    inStock: true,
    stock: 26,
    lowStockThreshold: 10,
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    colors: JSON.stringify(["Blue/White", "Navy/White"]),
    materials: JSON.stringify(["Cotton"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 14,
    name: "Linen Summer Shirt",
    price: 110,
    category: "shirt",
    line: "summer",
    imageUrl: "https://images.unsplash.com/photo-1564859220176-5ed6523d7fc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Lightweight linen shirt perfect for warm weather.",
    inStock: true,
    stock: 18,
    lowStockThreshold: 8,
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    colors: JSON.stringify(["White", "Light Blue", "Beige"]),
    materials: JSON.stringify(["Linen"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1564859220176-5ed6523d7fc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 15,
    name: "Flannel Check Shirt",
    price: 90,
    category: "shirt",
    line: "casual",
    imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Cozy flannel shirt with classic check pattern.",
    inStock: true,
    stock: 22,
    lowStockThreshold: 8,
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    colors: JSON.stringify(["Red/Black", "Blue/Green", "Grey/Black"]),
    materials: JSON.stringify(["Cotton", "Flannel"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 16,
    name: "Denim Shirt",
    price: 80,
    category: "shirt",
    line: "casual",
    imageUrl: "https://images.unsplash.com/photo-1566479179817-2dc7a2d4f7c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Classic denim shirt for a rugged casual look.",
    inStock: true,
    stock: 30,
    lowStockThreshold: 12,
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    colors: JSON.stringify(["Light Blue", "Dark Blue"]),
    materials: JSON.stringify(["Cotton", "Denim"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1566479179817-2dc7a2d4f7c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 17,
    name: "Polo Shirt",
    price: 65,
    category: "shirt",
    line: "smart-casual",
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Classic polo shirt perfect for smart-casual occasions.",
    inStock: true,
    stock: 45,
    lowStockThreshold: 15,
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    colors: JSON.stringify(["Navy", "White", "Black", "Red"]),
    materials: JSON.stringify(["Cotton", "Polyester"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 18,
    name: "Hawaiian Print Shirt",
    price: 75,
    category: "shirt",
    line: "summer",
    imageUrl: "https://images.unsplash.com/photo-1564859228273-274232fdb516?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Vibrant Hawaiian print shirt for vacation vibes.",
    inStock: true,
    stock: 14,
    lowStockThreshold: 6,
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    colors: JSON.stringify(["Blue/White", "Red/Black", "Green/Orange"]),
    materials: JSON.stringify(["Cotton", "Rayon"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1564859228273-274232fdb516?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 19,
    name: "Business Formal Shirt",
    price: 120,
    category: "shirt",
    line: "formal",
    imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb5a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Premium business shirt with French cuffs.",
    inStock: true,
    stock: 20,
    lowStockThreshold: 8,
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    colors: JSON.stringify(["White", "Light Blue"]),
    materials: JSON.stringify(["Cotton", "Silk"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb5a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 20,
    name: "Henley Shirt",
    price: 60,
    category: "shirt",
    line: "casual",
    imageUrl: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Comfortable Henley shirt with button placket.",
    inStock: true,
    stock: 32,
    lowStockThreshold: 12,
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    colors: JSON.stringify(["White", "Grey", "Navy"]),
    materials: JSON.stringify(["Cotton"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },

  // T-SHIRTS - 10 items
  {
    id: 21,
    name: "Basic Cotton T-Shirt",
    price: 25,
    category: "t-shirt",
    line: "basic",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Essential cotton t-shirt in classic fit.",
    inStock: true,
    stock: 50,
    lowStockThreshold: 20,
    sizes: JSON.stringify(["XS", "S", "M", "L", "XL", "XXL"]),
    colors: JSON.stringify(["White", "Black", "Grey", "Navy"]),
    materials: JSON.stringify(["Cotton"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 22,
    name: "Graphic Print T-Shirt",
    price: 35,
    category: "t-shirt",
    line: "graphic",
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Trendy graphic print t-shirt with bold designs.",
    inStock: true,
    stock: 38,
    lowStockThreshold: 15,
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    colors: JSON.stringify(["Black", "White", "Navy"]),
    materials: JSON.stringify(["Cotton", "Polyester"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 23,
    name: "V-Neck T-Shirt",
    price: 30,
    category: "t-shirt",
    line: "basic",
    imageUrl: "https://images.unsplash.com/photo-1562157873-818bc0726f68?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Classic V-neck t-shirt in soft cotton blend.",
    inStock: true,
    stock: 42,
    lowStockThreshold: 18,
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    colors: JSON.stringify(["White", "Black", "Grey", "Navy", "Red"]),
    materials: JSON.stringify(["Cotton", "Modal"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 24,
    name: "Long Sleeve T-Shirt",
    price: 40,
    category: "t-shirt",
    line: "basic",
    imageUrl: "https://images.unsplash.com/photo-1559563458-527698bf529-5295?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Comfortable long sleeve t-shirt for cooler days.",
    inStock: true,
    stock: 28,
    lowStockThreshold: 12,
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    colors: JSON.stringify(["White", "Black", "Grey"]),
    materials: JSON.stringify(["Cotton"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1559563458-527698bf5295?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 25,
    name: "Pocket T-Shirt",
    price: 28,
    category: "t-shirt",
    line: "casual",
    imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f37f4678?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Simple pocket t-shirt with classic styling.",
    inStock: true,
    stock: 35,
    lowStockThreshold: 15,
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    colors: JSON.stringify(["White", "Grey", "Navy", "Green"]),
    materials: JSON.stringify(["Cotton"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1583743814966-8936f37f4678?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 26,
    name: "Striped T-Shirt",
    price: 32,
    category: "t-shirt",
    line: "casual",
    imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Classic striped t-shirt with nautical appeal.",
    inStock: true,
    stock: 25,
    lowStockThreshold: 10,
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    colors: JSON.stringify(["Navy/White", "Black/White", "Red/White"]),
    materials: JSON.stringify(["Cotton"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 27,
    name: "Premium Organic T-Shirt",
    price: 45,
    category: "t-shirt",
    line: "premium",
    imageUrl: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Eco-friendly organic cotton t-shirt.",
    inStock: true,
    stock: 20,
    lowStockThreshold: 8,
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    colors: JSON.stringify(["Natural", "Grey", "Navy"]),
    materials: JSON.stringify(["Organic Cotton"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1527719327859-c6ce80353573?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 28,
    name: "Athletic Performance T-Shirt",
    price: 50,
    category: "t-shirt",
    line: "athletic",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Moisture-wicking performance t-shirt for active wear.",
    inStock: true,
    stock: 30,
    lowStockThreshold: 12,
    sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
    colors: JSON.stringify(["Black", "Grey", "Navy", "Red"]),
    materials: JSON.stringify(["Polyester", "Elastane"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 29,
    name: "Vintage Band T-Shirt",
    price: 38,
    category: "t-shirt",
    line: "vintage",
    imageUrl: "https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Retro-style band t-shirt with vintage graphics.",
    inStock: true,
    stock: 22,
    lowStockThreshold: 8,
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    colors: JSON.stringify(["Black", "Grey", "White"]),
    materials: JSON.stringify(["Cotton"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
  {
    id: 30,
    name: "Oversized T-Shirt",
    price: 35,
    category: "t-shirt",
    line: "streetwear",
    imageUrl: "https://images.unsplash.com/photo-1558114965-eeb97e482e5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Trendy oversized t-shirt for a relaxed streetwear look.",
    inStock: true,
    stock: 26,
    lowStockThreshold: 10,
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    colors: JSON.stringify(["Black", "White", "Beige"]),
    materials: JSON.stringify(["Cotton", "Polyester"]),
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1558114965-eeb97e482e5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]),
    coverImageIndex: 0,
    hasVariants: true,
  },
];

    sampleProducts.forEach(product => {
      const id = this.currentProductId++;
      this.products.set(id, { 
        ...product, 
        id,
        line: product.line || null,
        altImageUrl: product.altImageUrl || null,
        description: product.description || null,
        inStock: product.inStock !== false,
        stock: product.stock || 0,
        lowStockThreshold: product.lowStockThreshold || 10,
        sizes: product.sizes || null,
        colors: product.colors || null,
        materials: product.materials || null,
        images: product.images || null,
        coverImageIndex: product.coverImageIndex || 0,
        hasVariants: product.hasVariants || false
      });
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

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(data: any): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = {
      id,
      name: data.name,
      price: data.price.toString(),
      category: data.category,
      line: data.line || null,
      imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
      altImageUrl: data.altImageUrl || null,
      description: data.description || null,
      inStock: data.inStock !== false,
      stock: data.stock || 0,
      lowStockThreshold: data.lowStockThreshold || 10,
      sizes: data.sizes || null,
      colors: data.colors || null,
      materials: data.materials || null,
      images: data.images || null,
      coverImageIndex: data.coverImageIndex || 0,
      hasVariants: data.hasVariants || false
    };

    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updates: any): Promise<Product | null> {
    const product = this.products.get(id);
    if (!product) {
      return null;
    }

    const updatedProduct: Product = {
      ...product,
      ...updates,
      id // Ensure ID doesn't change
    };

    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async getCategories(): Promise<string[]> {
    const categories = new Set<string>();
    Array.from(this.products.values()).forEach(product => {
      categories.add(product.category);
    });
    return Array.from(categories);
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }
  async getUsers({ search, limit, offset }: { search?: string; limit?: number; offset?: number }) {
    // Mock implementation - replace with actual database logic
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
      }
    ];

    let filteredUsers = users;
    if (search) {
      filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    return {
      users: filteredUsers.slice(offset || 0, (offset || 0) + (limit || 10)),
      total: filteredUsers.length
    };
  }

  async getUserByFirebaseUID(firebaseUID: string) {
    // In a real implementation, this would query your database
    // For now, returning mock data
    console.log('Looking for user with Firebase UID:', firebaseUID);
    return null; // Return null if user doesn't exist
  }

  async createUser(userData: {
    email: string;
    name: string;
    provider: string;
    firebaseUID: string;
    photoURL?: string;
  }) {
    // In a real implementation, this would insert into your database
    console.log('Creating new user:', userData);

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      isActive: true,
      totalOrders: 0,
      totalSpent: 0,
      role: 'customer',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    // Here you would save to your actual database
    // For now, just returning the mock user
    return newUser;
  }

  async updateUser(userId: string, updates: any) {
    // In a real implementation, this would update your database
    console.log('Updating user:', userId, updates);

    // Return updated user data
    return {
      id: userId,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  async getOrders(params: { status?: string; search?: string; limit: number; offset: number }): Promise<{ orders: any[]; total: number }> {
    const allOrders = Array.from(this.orders.values());
    let filteredOrders = allOrders;

    if (params.status) {
      filteredOrders = allOrders.filter(order => order.status === params.status);
    }

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order => 
        order.orderNumber?.toLowerCase().includes(searchLower) ||
        order.customer?.name?.toLowerCase().includes(searchLower) ||
        order.customer?.email?.toLowerCase().includes(searchLower)
      );
    }

    const total = filteredOrders.length;
    const orders = filteredOrders.slice(params.offset, params.offset + params.limit);

    return { orders, total };
  }

  async getOrderById(id: string): Promise<any | undefined> {
    return this.orders.get(id);
  }

  async updateOrderStatus(id: string, status: string, trackingNumber?: string): Promise<any | null> {
    const order = this.orders.get(id);
    if (!order) {
      return null;
    }

    const updatedOrder = {
      ...order,
      status,
      trackingNumber: trackingNumber || order.trackingNumber,
      updatedAt: new Date().toISOString()
    };

    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getAnalytics(): Promise<any> {
    const totalProducts = this.products.size;
    const totalUsers = this.users.size;
    const totalOrders = this.orders.size;

    const orders = Array.from(this.orders.values());
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const processingOrders = orders.filter(order => order.status === 'processing').length;
    const shippedOrders = orders.filter(order => order.status === 'shipped').length;
    const deliveredOrders = orders.filter(order => order.status === 'delivered').length;

    // Generate monthly revenue data for the last 6 months
    const monthlyRevenue = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyRevenue.push({
        month: monthName,
        revenue: Math.floor(Math.random() * 50000) + 10000, // Sample data
        orders: Math.floor(Math.random() * 100) + 20
      });
    }

    return {
      totalRevenue,
      totalOrders,
      totalCustomers: totalUsers,
      totalProducts,
      revenueChange: 15.2, // Sample percentage change
      ordersChange: 8.7,
      customersChange: 12.4,
      productsChange: 5.1,
      ordersByStatus: [
        { status: 'pending', count: pendingOrders },
        { status: 'processing', count: processingOrders },
        { status: 'shipped', count: shippedOrders },
        { status: 'delivered', count: deliveredOrders }
      ],
      monthlyRevenue,
      topProducts: Array.from(this.products.values()).slice(0, 5).map(product => ({
        id: product.id,
        name: product.name,
        sales: Math.floor(Math.random() * 100) + 10,
        revenue: parseFloat(product.price) * (Math.floor(Math.random() * 100) + 10)
      })),
      recentOrders: orders.slice(-5).map(order => ({
        ...order,
        customer: order.customer || {
          name: 'Customer ' + Math.floor(Math.random() * 1000),
          email: 'customer@example.com'
        }
      }))
    };
  }
}

export const storage = new MemStorage();