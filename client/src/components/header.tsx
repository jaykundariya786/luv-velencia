import { useState } from "react";
import { Search, ShoppingBag, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ShoppingBagPopup from "./shopping-bag-popup";
import { useShoppingBagContext } from "@/contexts/shopping-bag-context";
import { useAuth } from "@/contexts/auth-context";

interface HeaderProps {
  onMobileMenuToggle: () => void;
  onSearchToggle: () => void;
  cookieNoticeVisible: boolean;
}

export default function Header({
  onMobileMenuToggle,
  onSearchToggle,
}: HeaderProps) {
  const navigate = useNavigate();
  const [isShoppingBagOpen, setIsShoppingBagOpen] = useState(false);
  const { items, getTotalItems, updateQuantity, removeItem } =
    useShoppingBagContext();
  const { user } = useAuth();

  const handleAccountClick = () => {
    if (user) {
      navigate("/account");
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <header className={`gucci-header`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-6">
            <span className="text-xs cursor-pointer hover:text-gray-600 transition-colors hidden md:block">
              + Contact Us
            </span>
          </div>

          {/* Logo - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-2xl font-light tracking-[0.2em] cursor-pointer gucci-heading">
              GUCCI
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={onSearchToggle}
            >
              <Search className="w-5 h-5" />
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 transition-colors"
              onClick={handleAccountClick}
            >
              <User className="h-5 w-5" />
            </Button>
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              onClick={() => setIsShoppingBagOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={onMobileMenuToggle}
            >
              <Menu className="w-5 h-5" />
            </button>
            <span
              className="hidden md:block text-sm cursor-pointer hover:text-gray-600 transition-colors"
              onClick={onMobileMenuToggle}
            >
              MENU
            </span>
          </div>
        </div>
      </div>

      <ShoppingBagPopup
        isOpen={isShoppingBagOpen}
        onClose={() => setIsShoppingBagOpen(false)}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </header>
  );
}
