import { X, Search, User, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useShoppingBagContext } from "@/contexts/shopping-bag-context";
import { useAuth } from "@/contexts/auth-context";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchToggle: () => void;
  onShoppingBagOpen: () => void;
}

export default function MobileMenu({ isOpen, onClose, onSearchToggle, onShoppingBagOpen }: MobileMenuProps) {
  const navigate = useNavigate();
  const { getTotalItems } = useShoppingBagContext();
  const { user } = useAuth();

  const handleAccountClick = () => {
    if (user) {
      navigate("/account");
    } else {
      navigate("/sign-in");
    }
    onClose();
  };

  const handleSearchClick = () => {
    onSearchToggle();
    onClose();
  };

  const handleShoppingBagClick = () => {
    onShoppingBagOpen();
    onClose();
  };

  return (
    <div
      className={`mobile-menu flex flex-col h-full ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-light tracking-[0.15em] gucci-heading">
          GUCCI
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile-only options */}
      <div className="border-b px-4 py-4">
        <div className="space-y-3">
          <button
            onClick={handleSearchClick}
            className="flex items-center gap-3 w-full text-left py-2 gucci-body text-lg font-medium"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
          
          <button
            onClick={handleAccountClick}
            className="flex items-center gap-3 w-full text-left py-2 gucci-body text-lg font-medium"
          >
            <User className="w-5 h-5" />
            {user ? "My Account" : "Sign In"}
          </button>
          
          <button
            onClick={handleShoppingBagClick}
            className="flex items-center gap-3 w-full text-left py-2 gucci-body text-lg font-medium"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </div>
            Shopping Bag
          </button>
        </div>
      </div>

      <div className="space-y-4 px-4 py-4">
        <a href="#" className="block text-lg font-medium py-2 gucci-body">
          Father's Day Gifts
        </a>
        <a href="#" className="block text-lg font-medium gucci-body">
          New In
        </a>
        <a href="#" className="block text-lg font-medium py-2 gucci-body">
          Men
        </a>
      </div>
    </div>
  );
}
