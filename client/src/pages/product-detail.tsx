import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Product } from "@shared/schema";
import { useRecentlyViewed } from "@/hooks/use-products";

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
import SizeGuideModal from "@/components/size-guide-modal";

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
  const [showSizeGuide, setShowSizeGuide] = useState(false);

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

  // Get dynamic product details
  const { data: productDetails, isLoading: isDetailsLoading } = useQuery({
    queryKey: [`/api/products/${id}/details`],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}/details`);
      if (!response.ok) {
        throw new Error("Failed to fetch product details");
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

  // Get recently viewed items (excluding current product)
  const { data: recentlyViewedData } = useRecentlyViewed();
  const recentlyViewed =
    recentlyViewedData?.filter((item) => item.id !== parseInt(id!)) || [];

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
    <div className="bg-white">
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
          <h3 className="lv-luxury mb-4 text-md font-bold text-black">
            PRODUCT DETAILS
          </h3>

          <div className="text-left space-y-2">
            <h1 className="lv-body text-gray-700 hover:text-black font-mono lv-transition">
              {product.name}
            </h1>
            <div className="text-lg luxury-text font-semibold text-primary">
              $ {parseFloat(product.price).toLocaleString()}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-4 uppercase tracking-[0.15em] text-xs font-bold text-black">
            <div className="flex items-center justify-between">
              <span className="text-xs">Select Size</span>
              <button
                className="text-[9px] underline text-gray-500 hover:text-black"
                onClick={() => setShowSizeGuide(true)}
              >
                VIEW SIZE GUIDE
              </button>
            </div>

            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full h-12 border-black uppercase text-xs">
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
          </div>

          <div className="lv-fade-in delay-300">
            <a
              onClick={handleAddToBag}
              className="bg-primary px-8 py-3 lv-luxury rounded-full text-sm hover:bg-primary/90 lv-transition lv-hover"
            >
              ADD TO BAG
            </a>
          </div>
        </div>

        <div className="space-y-4 max-w-lg text-xs flex flex-col justify-center  text-black font-normal font-mono">
          {productDetails && (
            <>
              <p className="leading-relaxed font-normal">
                {productDetails.description}
              </p>

              <ul className="space-y-1 ">
                {productDetails.specifications?.map(
                  (spec: string, index: number) => (
                    <li key={index}>• {spec}</li>
                  )
                )}
              </ul>

              {productDetails.sizeGuide && (
                <div className="mt-4 p-3 max-w-md hover:shadow-lg transition-all duration-300 bg-gray-50 rounded-lg">
                  <p className="mb-1 lv-luxury text-xs font-bold text-black">
                    {productDetails.sizeGuide.fitType}
                  </p>
                  <p className="text-xs font-normal text-gray-600">
                    {productDetails.sizeGuide.recommendation}
                  </p>
                </div>
              )}
            </>
          )}

          {(isDetailsLoading || !productDetails) && (
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 ">
        {productDetails?.materials
          ? productDetails.materials.map((section: any) => (
              <div key={section.id} className="border-b border-gray-200">
                <div
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 cursor-pointer"
                >
                  <span className="lv-luxury text-sm font-bold text-black">
                    {section.title}
                  </span>
                  {expandedSection === section.id ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 flex-wrap font-mono ${
                    expandedSection === section.id
                      ? "px-6 pb-6 max-h-96 text-sm opacity-100"
                      : "h-0 px-0 pb-0 text-[0] opacity-0"
                  }`}
                >
                  <p className="leading-relaxed lv-body text-gray-700 hover:text-black font-mono lv-transition">
                    {section.content}
                  </p>
                </div>
              </div>
            ))
          : Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border-b border-gray-200">
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                </div>
              </div>
            ))}
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <div className="bg-gray-100 py-8">
          <div className="px-4 mx-auto">
            <h2 className="text-center text-md mb-8 lv-luxury text-md font-bold text-black">
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
              <div className="flex min-w-max gap-2">
                {relatedProducts.map((relatedProduct) => (
                  <div
                    key={relatedProduct.id}
                    className="w-80 lex-shrink-0 cursor-pointer"
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

      {recentlyViewed.length > 0 && (
        <div className="py-8 bg-white">
          <div className="mx-auto px-6">
            <h2 className="mb-8 uppercase tracking-wider lv-luxury text-md font-bold text-black">
              RECENTLY VIEWED ({recentlyViewed.length})
            </h2>

            <div
              className="overflow-x-auto cursor-grab"
              style={{ userSelect: "none" }}
            >
              <div className="flex gap-2 min-w-max">
                {recentlyViewed.slice(0, 5).map((recentProduct) => (
                  <div
                    key={recentProduct.id}
                    className="w-56 lex-shrink-0 cursor-pointer"
                    onClick={(e) => {
                      if (!isDragging) {
                        navigate(`/product/${recentProduct.id}`);
                      }
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <ProductCard product={recentProduct} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        category={
          product?.category?.toLowerCase().includes("women") ? "womens" : "mens"
        }
      />
    </div>
  );
}
