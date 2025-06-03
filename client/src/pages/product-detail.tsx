import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Product } from "@shared/schema";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/product-card";
import { useShoppingBagContext } from "@/contexts/shopping-bag-context";
import { data_materials } from "@/constant/jsonData";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { addItem } = useShoppingBagContext();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get product data
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      return response.json();
    },
    enabled: !!id,
  });

  // Get related products
  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ["/api/products", { category: product?.category, limit: 20 }],
    queryFn: async () => {
      const response = await fetch(
        `/api/products?category=${product?.category}&limit=20`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch related products");
      }
      return response.json();
    },
    enabled: !!product,
  });

  // Check if item is saved
  const { data: saveStatus } = useQuery<{ isSaved: boolean }>({
    queryKey: [`/api/saved-items/${id}/status`],
    queryFn: async () => {
      const response = await fetch(`/api/saved-items/${id}/status`);
      if (!response.ok) {
        throw new Error("Failed to fetch save status");
      }
      return response.json();
    },
    enabled: !!id,
  });

  const isSaved = saveStatus?.isSaved || false;

  // Save/unsave item mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (isSaved) {
        await apiRequest("DELETE", `/api/saved-items/${id}`);
      } else {
        await apiRequest("POST", "/api/saved-items", {
          productId: parseInt(id!),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/saved-items/${id}/status`],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-items"] });
      toast({
        title: isSaved ? "Item removed from saved items" : "Item saved",
        description: isSaved
          ? "The item has been removed from your saved items."
          : "The item has been added to your saved items.",
      });
    },
  });

  const sizes = [
    { label: "5 = 5.5 US", value: "5" },
    { label: "6 = 6.5 US", value: "6" },
    { label: "6.5 = 7 US", value: "6.5" },
    { label: "7 = 7.5 US", value: "7" },
    { label: "7.5 = 8 US", value: "7.5" },
    { label: "8 = 8.5 US", value: "8" },
    { label: "8.5 = 9 US", value: "8.5" },
    { label: "9 = 9.5 US", value: "9" },
    { label: "9.5 = 10 US", value: "9.5" },
    { label: "10 = 10.5 US", value: "10" },
    { label: "10.5 = 11 US", value: "10.5" },
    { label: "11 = 11.5 US", value: "11" },
    { label: "12 = 12.5 US", value: "12" },
    { label: "13 = 13.5 US", value: "13" },
    { label: "14 = 14.5 US", value: "14" },
    { label: "15 = 15.5 US", value: "15" },
  ];

  const images = product
    ? [product.imageUrl, ...(product.altImageUrl ? [product.altImageUrl] : [])]
    : [];

  const handleAddToBag = () => {
    if (!selectedSize) {
      toast({
        variant: "destructive",
        title: "Please select a size",
        description: "You must select a size before adding to shopping bag.",
      });
      return;
    }

    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.imageUrl,
      style: `${product.id}FAEVU4645`,
      size: selectedSize,
    });

    toast({
      title: "Added to shopping bag",
      description: `${product.name} has been added to your shopping bag.`,
    });
  };

  const handleSaveClick = () => {
    saveMutation.mutate();
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">Product not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className=" bg-gray-50 h-[90vh] flex items-center justify-center w-full">
        <img
          src={images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-contain"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 bg-white">
        <div className="border-t border-gray-200 p-8 max-w-md mx-auto space-y-6">
          <h3 className="font-normal text-sm uppercase tracking-wider">
            PRODUCT DETAILS
          </h3>

          <div className="text-left space-y-2">
            <h1 className="text-lg vintage-heading uppercase tracking-wider">
              {product.name}
            </h1>
            <div className="text-lg luxury-text font-semibold">
              $ {parseFloat(product.price).toLocaleString()}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Select Size</span>
              <button className="text-xs underline text-gray-500 hover:text-black">
                VIEW SIZE GUIDE
              </button>
            </div>

            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full h-12 border-black">
                <SelectValue placeholder="Select Size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleAddToBag}
              className="w-full bg-gucci-gradient text-white h-12 uppercase tracking-wider transition-all text-sm vintage-heading"
            >
              ADD TO SHOPPING BAG
            </Button>
          </div>

          <div className="space-y-4 text-sm text-gray-600">
            <p className="leading-relaxed">
              The Re-Web sees Gucci's heritage stripes as a bold statement
              detail on a contemporary silhouette. This pair is crafted from GG
              denim with a leather trim. Defined by multiple iconic details,
              this new sneaker takes center stage with the bold green and red
              Web tongue.
            </p>

            <ul className="space-y-1">
              <li>• Light blue GG denim</li>
              <li>• Men's</li>
              <li>• White leather trim</li>
              <li>• Leather lining</li>
              <li>• Gucci script and Interlocking G Web tag</li>
              <li>
                • Rubber outsole with Interlocking G and Gucci script logo
              </li>
              <li>• Interlocking G details on the eyelets</li>
              <li>• Tongue with Web</li>
              <li>• Additional pair of laces included</li>
              <li>• Lace-up closure</li>
              <li>• Low heel</li>
              <li>• Height: 1.1"</li>
              <li>• Made in Italy</li>
              <li>• This style runs big, we recommend sizing down</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="border-t border-gray-200">
            {data_materials.map((section) => (
              <div key={section.id} className="border-b border-gray-200">
                <div
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex  items-center justify-between p-6 text-left hover:bg-gray-50"
                >
                  <span className="text-sm font-normal uppercase tracking-wider">
                    {section.title}
                  </span>
                  {expandedSection === section.id ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`overflow-hidden ${
                    expandedSection === section.id
                      ? "px-6 pb-6 transition-all duration-300"
                      : "h-0 px-0 pb-0 transition-all duration-300"
                  }`}
                >
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-center text-lg font-normal mb-12 uppercase tracking-wider">
              YOU MAY ALSO LIKE
            </h2>

            <div
              ref={scrollContainerRef}
              className={`overflow-x-auto pb-4 ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              style={{ userSelect: "none" }}
            >
              <div className="flex gap-6 min-w-max">
                {relatedProducts.map((relatedProduct) => (
                  <div
                    key={relatedProduct.id}
                    className="w-64 flex-shrink-0 cursor-pointer"
                    onClick={(e) => {
                      if (!isDragging) {
                        navigate(`/product/${relatedProduct.id}`);
                      }
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <ProductCard product={relatedProduct} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-lg font-normal mb-8 uppercase tracking-wider">
            RECENTLY VIEWED
          </h2>

          <div className="flex gap-6">
            <div className="w-32 h-32 bg-white">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain p-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
