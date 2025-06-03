import { products, savedItems, type Product, type InsertProduct, type SavedItem, type InsertSavedItem, type CategoryFilter, type LineFilter, type SortOption } from "@shared/schema";

export interface IStorage {
  getProducts(filters?: {
    category?: CategoryFilter;
    line?: LineFilter;
    sort?: SortOption;
    search?: string;
  }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getSavedItems(sessionId: string): Promise<Product[]>;
  saveItem(sessionId: string, productId: number): Promise<SavedItem>;
  removeSavedItem(sessionId: string, productId: number): Promise<void>;
  isItemSaved(sessionId: string, productId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private savedItems: Map<string, SavedItem>;
  private currentProductId: number;
  private currentSavedId: number;

  constructor() {
    this.products = new Map();
    this.savedItems = new Map();
    this.currentProductId = 1;
    this.currentSavedId = 1;
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
  }): Promise<Product[]> {
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
    if (filters?.sort) {
      switch (filters.sort) {
        case "price-low":
          productsArray.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case "price-high":
          productsArray.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case "newest":
        default:
          // Default order (newest first)
          productsArray.sort((a, b) => b.id - a.id);
          break;
      }
    }

    return productsArray;
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
}

export const storage = new MemStorage();