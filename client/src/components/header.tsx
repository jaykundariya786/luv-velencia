import { useState } from "react";
import * as React from "react";
import {
  Search,
  ShoppingBag,
  Menu,
  User,
  X,
  CircleUserRound,
  Package,
  Settings,
  MapPin,
  CreditCard,
  Heart,
  Calendar,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import ShoppingBagPopup from "./shopping-bag-popup";
import AccountModal from "./account-modal";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { useSearchSuggestions } from "@/hooks/use-search-suggestions";

// MobileMenu Component
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchToggle: () => void;
  onShoppingBagOpen: () => void;
}

// SearchOverlay Component
interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (searchTerm: string) => void;
}

// Main Header Component
interface HeaderProps {
  onMobileMenuToggle: () => void;
  onSearchToggle: () => void;
  cookieNoticeVisible: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  onMobileMenuClose: () => void;
  onSearchClose: () => void;
}

function MobileMenu({
  isOpen,
  onClose,
  onSearchToggle,
  onShoppingBagOpen,
}: MobileMenuProps) {
  const navigate = useNavigate();
  const { items } = useAppSelector((state: RootState) => state.shoppingBag);
  const { user } = useAppSelector((state: RootState) => state.auth);

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const handleAccountClick = () => {
    onShoppingBagOpen();
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
      className={`fixed right-0 top-0 w-full lg:w-1/3 h-full bg-white z-50 transform transition-transform duration-300 flex flex-col border-l shadow-lg ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-xl lv-luxury text-primary">LUV VELENCIA</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-2 lv-transition hover:bg-primary/10"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile-only options */}
      <div className="border-b px-4 py-4">
        <div className="gap-12 mx-4 flex flex-row">
          <button
            onClick={handleSearchClick}
            className="py-2 lv-body text-lg font-medium lv-transition hover:text-primary"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={handleAccountClick}
            className="py-2 lv-body text-lg font-medium lv-transition hover:text-primary"
          >
            <User className="h-5 w-5" />
          </button>

          <button
            onClick={handleShoppingBagClick}
            className="flex items-center gap-3 w-full text-left py-2 lv-body text-lg font-medium lv-transition hover:text-primary"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        <a
          href="#"
          className="block font-normal hover:bg-primary/20 p-4 rounded-full lv-body text-gray-500 hover:text-black font-mono lv-transition"
        >
          • Father's Day Gifts
        </a>
        <a
          href="#"
          className="block font-normal hover:bg-primary/20 p-4 rounded-full lv-body text-gray-500 hover:text-black font-mono lv-transition"
        >
          • New In
        </a>
      </div>
    </div>
  );
}

function SearchOverlay({ isOpen, onClose, onSearch }: SearchOverlayProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: suggestions, isLoading } = useSearchSuggestions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setSearchTerm("");
    }
  };

  const handleTrendingClick = (term: string) => {
    onSearch(term);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-4 md:right-8 z-50 w-[500px] max-w-[90%] bg-white shadow-2xl border border-gray-200 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-top-5 duration-300">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="lv-luxury text-md font-bold text-black">Search</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="lv-body p-4 text-gray-500 hover:text-black font-mono lv-transition w-full text-sm shadow-xl rounded-full placeholder:text-gray-500"
            />
            <Link
              onClick={handleSubmit}
              className="absolute right-0 top-0 p-2"
              to={""}
            >
              <Search className="w-5 h-5" />
            </Link>
          </div>
        </form>

        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-4">Loading suggestions...</div>
          ) : (
            <>
              <div>
                <h3 className="lv-luxury text-md font-bold text-black mb-3">
                  TRENDING SEARCHES
                </h3>
                <div className="space-y-2">
                  {suggestions?.trending?.map((item: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleTrendingClick(item.query)}
                      className="flex text-xs items-center lv-body text-gray-500 hover:text-black font-mono lv-transition"
                    >
                      <Search className="w-3 h-3 mr-3" />
                      {item.query}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="lv-luxury text-md font-bold text-black mb-3">
                  NEW IN
                </h3>
                <div className="space-y-2">
                  {suggestions?.newIn?.map((item: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleTrendingClick(item.query)}
                      className="flex text-xs items-center lv-body text-gray-500 hover:text-black font-mono lv-transition"
                    >
                      {item.query}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="lv-luxury text-md font-bold text-black mb-3">
                  FIND THE PERFECT SUMMER STYLE
                </h3>
                <div className="space-y-2">
                  {suggestions?.featured?.map((item: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleTrendingClick(item.query)}
                      className="flex text-xs items-center lv-body text-gray-500 hover:text-black font-mono lv-transition"
                    >
                      {item.query}
                    </button>
                  ))}
                  <a
                    href="#"
                    className="flex text-xs items-center lv-body text-gray-500 hover:text-black font-mono lv-transition"
                  >
                    Personalization
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Header({
  onMobileMenuToggle,
  onSearchToggle,
  isMobileMenuOpen,
  isSearchOpen,
  onMobileMenuClose,
  onSearchClose,
}: HeaderProps) {
  const navigate = useNavigate();
  const [isShoppingBagOpen, setIsShoppingBagOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const { items } = useAppSelector((state: RootState) => state.shoppingBag);
  const { user } = useAppSelector((state: RootState) => state.auth);

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const handleAccountClick = () => {
    setIsAccountModalOpen(true);
  };

  const handleSearch = (searchTerm: string) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    onSearchClose();
  };

  return (
    <header
      className={`sticky top-0 z-50 left-0 w-full bg-gradient-to-r from-[#0b3e27] to-[#197149]`}
    >
      <div className=" mx-auto px-3 sm:px-8">
        <div className="flex justify-between items-center py-5">
          {/* Left Section */}
          <div className="flex items-center space-x-2 sm:space-x-6 flex-1"></div>

          <a
            href="/"
            className="text-lg sm:text-xl md:text-2xl lv-luxury cursor-pointer text-white hover:text-black/20 lv-transition"
          >
            LUV VELENCIA
          </a>

          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-8 flex-1 justify-end">
            <Search
              onClick={onSearchToggle}
              className="h-4 w-4 sm:h-5 sm:w-5 hidden md:block text-white cursor-pointer hover:text-black/20 lv-transition"
            />

            <button onClick={handleAccountClick}>
              <User className="h-4 w-4 sm:h-5 sm:w-5 hidden md:block text-white cursor-pointer hover:text-black/20 lv-transition" />
            </button>

            <div
              onClick={() => setIsShoppingBagOpen(true)}
              className="hidden md:block relative"
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 hidden md:block text-white cursor-pointer hover:text-black/20 lv-transition" />
              {getTotalItems() > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:-top-2.5 sm:-right-2.5 bg-black text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </div>
            <Menu
              onClick={onMobileMenuToggle}
              className="h-4 w-4 sm:h-5 sm:w-5 md:block text-white cursor-pointer hover:text-black/20 lv-transition"
            />
          </div>
        </div>
      </div>

      <ShoppingBagPopup
        isOpen={isShoppingBagOpen}
        onClose={() => setIsShoppingBagOpen(false)}
        items={items}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={onMobileMenuClose}
        onSearchToggle={onSearchToggle}
        onShoppingBagOpen={() => setIsShoppingBagOpen(true)}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={onSearchClose}
        onSearch={handleSearch}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </header>
  );
}
