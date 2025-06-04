import { useState } from "react";
import { Heart } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/lib/queryClient";
// Define Product type locally to avoid import issues
interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  line?: string;
  imageUrl: string;
  altImageUrl?: string;
  description?: string;
  inStock?: boolean;
}
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Check if item is saved
  const { data: saveStatus } = useQuery<{ isSaved: boolean }>({
    queryKey: [`/api/saved-items/${product.id}/status`],
    queryFn: async () => {
      const response = await fetch(`/api/saved-items/${product.id}/status`);
      if (!response.ok) {
        throw new Error("Failed to fetch save status");
      }
      return response.json();
    },
    enabled: !!product.id,
  });

  const isSaved = saveStatus?.isSaved || false;

  // Save/unsave item mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (isSaved) {
        await apiRequest("DELETE", `/api/saved-items/${product.id}`);
      } else {
        await apiRequest("POST", "/api/saved-items", { productId: product.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/saved-items/${product.id}/status`],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-items"] });
      toast({
        title: isSaved ? "Item removed from saved items" : "Item saved",
        description: isSaved
          ? "The item has been removed from your saved items."
          : "The item has been added to your saved items.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update saved items. Please try again.",
      });
    },
  });

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    saveMutation.mutate();
  };

  const formatPrice = (price: string) => {
    return `$ ${parseFloat(price).toLocaleString()}`;
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="cursor-pointer border border-gray-100 rounded-lg overflow-hidden relative bg-white lv-transition group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`w-full h-full object-cover lv-transition group-hover:scale-105 ${
            isHovered && product.altImageUrl ? "opacity-0" : "opacity-100"
          }`}
        />
        {product.altImageUrl && (
          <img
            src={product.altImageUrl}
            alt={`${product.name} - Alternative View`}
            className={`w-full h-full object-cover absolute top-0 left-0 lv-transition group-hover:scale-105 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        <Heart
          onClick={handleSaveClick}
          className={`w-[22px] h-[22px] absolute top-4 right-4 bg-transparent hover:bg-transparent ${
            isSaved
              ? "fill-primary text-primary "
              : "text-gray-400 hover:text-primary"
          } transition-colors`}
        />
      </div>

      <div className="space-y-0.5 bg-white w-full px-4 py-2 border-t border-gray-100">
        <h3 className="lv-body text-sm font-mono text-foreground tracking-wide line-clamp-1">
          {product.name}
        </h3>
        <p className="lv-body text-primary lv-luxury font-bold text-black text-sm">
          {formatPrice(product.price)}
        </p>
        <a
          href={`/product/${product.id}`}
          className="lv-luxury text-xs text-foreground hover:text-primary lv-transition inline-block"
        >
          SHOP THIS
        </a>
      </div>
    </div>
  );
}
