import { useState } from "react";
import { Heart } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/lib/queryClient";
import { type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
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
      className="cursor-pointer border border-white rounded-lg overflow-hidden relative bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`w-full h-full object-cover luxury-transition ${
            isHovered && product.altImageUrl ? "opacity-0" : "opacity-100"
          }`}
        />
        {product.altImageUrl && (
          <img
            src={product.altImageUrl}
            alt={`${product.name} - Alternative View`}
            className={`w-full h-full object-cover absolute top-0 left-0 luxury-transition ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-transparent hover:bg-transparent w-8 h-8 p-0"
          onClick={handleSaveClick}
          disabled={saveMutation.isPending}
        >
          <Heart
            className={`w-8 h-8 ${
              isSaved
                ? "fill-primary text-primary "
                : "text-gray-400 hover:text-primary"
            } transition-colors`}
          />
        </Button>
      </div>

      <div
        className={`space-y-1 bg-white w-full p-4 border rounded-b-lg  border-black`}
      >
        <h3 className="text-sm font-normal text-black uppercase tracking-wide">
          {product.name}
        </h3>
        <p className="text-sm text-black">{formatPrice(product.price)}</p>
        <a
          href={`/product/${product.id}`}
          className="h-auto p-0 text-xs text-black hover:text-gray-600  font-normal"
        >
          SHOP THIS
        </a>
      </div>
    </div>
  );
}
