
import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShoppingBagItem } from "../hooks/use-shopping-bag";
import { useNavigate } from "react-router-dom";

interface ShoppingBagPopupProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingBagItem[];
  onUpdateQuantity?: (id: number, size: string, quantity: number) => void;
  onRemoveItem?: (id: number, size: string) => void;
}

export default function ShoppingBagPopup({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: ShoppingBagPopupProps) {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      
      {/* Floating Modal */}
      <div className="fixed top-20 right-4 md:right-8 z-50 w-96 max-w-[90vw] max-h-[80vh] bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden animate-in fade-in slide-in-from-top-5 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-medium uppercase tracking-wider">
            Shopping Bag ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-12 px-4">
              <div className="mb-2">Your shopping bag is empty</div>
              <div className="text-xs text-gray-400">Add items to get started</div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3 pb-4 border-b border-gray-100 last:border-b-0">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-xs uppercase tracking-wide flex-1 pr-2 leading-tight">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => onRemoveItem?.(item.id, item.size)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm font-medium">
                      {formatPrice(item.price)}
                    </p>
                    <p className="text-xs text-gray-600">
                      Style: {item.style}
                    </p>
                    <p className="text-xs text-gray-600">
                      Size: {item.size}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-600">Qty:</span>
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() => onUpdateQuantity?.(item.id, item.size, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 py-1 text-xs min-w-[24px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity?.(item.id, item.size, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
            {/* Total */}
            <div className="flex justify-between items-center font-medium">
              <span className="text-sm">Total:</span>
              <span className="text-sm">{formatPrice(getTotalPrice())}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button className="w-full bg-black text-white hover:bg-gray-800 h-10 uppercase tracking-wider text-xs">
                Checkout
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  navigate('/shopping-bag');
                  onClose();
                }}
                className="w-full h-10 uppercase tracking-wider text-xs border-black text-black hover:bg-gray-50"
              >
                View Shopping Bag
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
