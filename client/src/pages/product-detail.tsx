import { useState, useRef } from "react";
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
import { useAppDispatch } from "@/hooks/redux";
import { addItem } from "@/store/slices/shoppingBagSlice";
import SizeGuideModal from "@/components/size-guide-modal";
import ProductDetailSkeleton from "@/components/product-detail-skeleton";
import { useMaterialsCare } from "@/hooks/use-materials-care";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
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

  // Dynamic sizes based on product category
  const getSizesForProduct = (category: string) => {
    const lowerCategory = category?.toLowerCase() || "";

    if (
      lowerCategory.includes("shoes") ||
      lowerCategory.includes("sneaker") ||
      lowerCategory.includes("boot")
    ) {
      // Shoe sizes
      return [
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
    } else if (
      lowerCategory.includes("shirt") ||
      lowerCategory.includes("top") ||
      lowerCategory.includes("jacket") ||
      lowerCategory.includes("sweater")
    ) {
      // Clothing sizes
      return [
        { label: "XXS", value: "XXS" },
        { label: "XS", value: "XS" },
        { label: "S", value: "S" },
        { label: "M", value: "M" },
        { label: "L", value: "L" },
        { label: "XL", value: "XL" },
        { label: "XXL", value: "XXL" },
        { label: "XXXL", value: "XXXL" },
      ];
    } else if (
      lowerCategory.includes("pant") ||
      lowerCategory.includes("jean") ||
      lowerCategory.includes("trouser")
    ) {
      // Pants sizes (waist sizes)
      return [
        { label: "28", value: "28" },
        { label: "30", value: "30" },
        { label: "32", value: "32" },
        { label: "34", value: "34" },
        { label: "36", value: "36" },
        { label: "38", value: "38" },
        { label: "40", value: "40" },
        { label: "42", value: "42" },
        { label: "44", value: "44" },
        { label: "46", value: "46" },
      ];
    } else if (
      lowerCategory.includes("jewelry") ||
      lowerCategory.includes("necklace") ||
      lowerCategory.includes("ring")
    ) {
      // Jewelry sizes (for rings and adjustable items)
      return [
        { label: "One Size", value: "OS" },
        { label: "Adjustable", value: "ADJ" },
      ];
    } else if (
      lowerCategory.includes("bag") ||
      lowerCategory.includes("backpack") ||
      lowerCategory.includes("purse")
    ) {
      // Bags typically come in one size
      return [{ label: "One Size", value: "OS" }];
    } else {
      // Default sizes for other items
      return [
        { label: "One Size", value: "OS" },
        { label: "S", value: "S" },
        { label: "M", value: "M" },
        { label: "L", value: "L" },
        { label: "XL", value: "XL" },
      ];
    }
  };

  const sizes = getSizesForProduct(product?.category || "");

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

    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.imageUrl,
        style: `${product.id}FAEVU4645`,
        size: selectedSize,
        quantity: 1,
      })
    );

    toast({
      title: "Added to shopping bag",
      description: `${product.name} has been added to your shopping bag.`,
    });
  };

  const handleSaveClick = () => {
    saveMutation.mutate();
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => {
      const nextIndex = (prev + 1) % images.length;
      return nextIndex;
    });
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => {
      const prevIndex = (prev - 1 + images.length) % images.length;
      return prevIndex;
    });
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

  const { data: materialsCareData, isLoading: isMaterialsLoading } =
    useMaterialsCare();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <ProductDetailSkeleton />
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
      <div className="relative bg-gray-50 h-[50%] md:h-[50vh] lg:h-[70vh] transition-all duration-300 overflow-hidden">
        <div
          className={`flex h-full ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          } transition-transform duration-300 ease-out`}
          style={{
            transform: `translateX(-${currentImageIndex * 100}%)`,
            userSelect: "none",
          }}
          onMouseDown={(e) => {
            setIsDragging(true);
            setStartX(e.pageX);
          }}
          onMouseLeave={() => setIsDragging(false)}
          onMouseUp={() => setIsDragging(false)}
          onMouseMove={(e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX;
            const walk = x - startX;

            if (Math.abs(walk) > 50) {
              // Threshold for scroll
              if (walk > 0 && currentImageIndex > 0) {
                prevImage();
                setIsDragging(false);
              } else if (walk < 0 && currentImageIndex < images.length - 1) {
                nextImage();
                setIsDragging(false);
              }
            }
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="w-full h-full flex-shrink-0 flex items-center justify-center"
            >
              <img
                src={image}
                alt={`${product.name} - Image ${index + 1}`}
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDragging(false);
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all duration-200 hover:scale-110 z-20 shadow-lg"
              disabled={currentImageIndex === 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDragging(false);
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all duration-200 hover:scale-110 z-20 shadow-lg"
              disabled={currentImageIndex === images.length - 1}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDragging(false);
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 shadow-sm ${
                    index === currentImageIndex
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 bg-white">
        <div className="border-t border-gray-200 p-8 lg:p-12 lg:mx-[10%] space-y-6">
          <div className="space-y-2">
            <h3 className="lv-luxury mb-2 text-md font-bold tracking-[0.2em] text-gray-500 uppercase">
              PRODUCT DETAILS
            </h3>
            <div className="w-16 h-0.5 bg-primary"></div>
          </div>

          <div className="space-y-4">
            <h1 className="lv-body font-mono lv-transition lv-title text-xl lg:text-2xl font-light text-black leading-tight">
              {product.name}
            </h1>
            <div className="text-xl lv-luxury font-bold text-primary">
              $ {parseFloat(product.price).toLocaleString()}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="lv-luxury text-xs tracking-[0.15em] font-bold text-black uppercase">
                Select Size
              </span>
              <button
                className="text-xs underline text-gray-600 hover:text-black lv-transition"
                onClick={() => setShowSizeGuide(true)}
              >
                SIZE GUIDE
              </button>
            </div>

            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full h-14 border-2 border-gray-300 hover:border-black lv-transition uppercase text-sm font-medium">
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

          <div className="">
            <Button
              onClick={handleAddToBag}
              className="w-full p-6 rounded-full hover:shadow-xl bg-primary transition-all duration-300 text-white text-sm tracking-[0.1em]"
            >
              ADD TO BAG
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={handleSaveClick}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-black lv-transition"
            >
              <Heart
                className={`w-5 h-5 ${
                  isSaved ? "fill-current text-primary" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div className="space-y-8 flex flex-col justify-center p-8 lg:p-12">
          {productDetails && (
            <>
              <div className="space-y-4">
                <h4 className="lv-luxury text-sm tracking-[0.2em] font-bold text-black">
                  DESCRIPTION
                </h4>
                <p className="lv-body text-gray-700 hover:text-primary font-mono lv-transition text-xs leading-relaxed">
                  {productDetails.description}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="lv-luxury text-sm tracking-[0.2em] font-bold text-black">
                  FEATURES
                </h4>
                <ul className="space-y-1 lv-body text-gray-700 font-mono lv-transition text-xs leading-relaxed">
                  {productDetails.specifications?.map(
                    (spec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-primary hover:text-primary rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                        {spec}
                      </li>
                    )
                  )}
                </ul>
              </div>

              {productDetails.sizeGuide && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h5 className="lv-luxury text-xs mb-2 font-bold text-primary">
                    {productDetails.sizeGuide.fitType}
                  </h5>
                  <p className="lv-body text-xs text-gray-500 hover:text-primary font-mono lv-transition">
                    {productDetails.sizeGuide.recommendation}
                  </p>
                </div>
              )}
            </>
          )}

          {(isDetailsLoading || !productDetails) && (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
              </div>
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

      {relatedProducts && relatedProducts?.products?.length > 0 && (
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
                {relatedProducts?.products?.map((relatedProduct) => (
                  <div
                    key={relatedProduct.id}
                    className="w-80 lex-shrink-0 cursor-pointer"
                    onClick={() => {
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
                    onClick={() => {
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
