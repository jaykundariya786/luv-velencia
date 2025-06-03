import { useState } from "react";
import { X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (searchTerm: string) => void;
}

export default function SearchOverlay({ isOpen, onClose, onSearch }: SearchOverlayProps) {
  const [searchTerm, setSearchTerm] = useState("");

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
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold gucci-heading">Search</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <X className="w-6 h-6" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="What are you looking for?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-lg border-0 border-b border-black rounded-none pb-2 focus-visible:ring-0 focus-visible:border-black placeholder:text-gray-500"
            />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 p-2"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </form>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3 gucci-body">TRENDING SEARCHES</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleTrendingClick("Handbags")}
                className="flex items-center text-sm hover:text-gray-600 transition-colors gucci-body"
              >
                <Search className="w-3 h-3 mr-3" />
                Handbags
              </button>
              <button
                onClick={() => handleTrendingClick("Shoes")}
                className="flex items-center text-sm hover:text-gray-600 transition-colors gucci-body"
              >
                <Search className="w-3 h-3 mr-3" />
                Shoes
              </button>
              <button
                onClick={() => handleTrendingClick("Belts")}
                className="flex items-center text-sm hover:text-gray-600 transition-colors gucci-body"
              >
                <Search className="w-3 h-3 mr-3" />
                Belts
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3 gucci-body">NEW IN</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleTrendingClick("Gucci Giallo")}
                className="block text-sm hover:text-gray-600 transition-colors underline gucci-body"
              >
                Gucci Giallo
              </button>
              <button
                onClick={() => handleTrendingClick("Women")}
                className="block text-sm hover:text-gray-600 transition-colors underline gucci-body"
              >
                Women
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3 gucci-body">FIND THE PERFECT SUMMER STYLE</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleTrendingClick("Gucci Lido Collection")}
                className="block text-sm hover:text-gray-600 transition-colors underline gucci-body"
              >
                Gucci Lido Collection
              </button>
              <a href="#" className="block text-sm hover:text-gray-600 transition-colors underline gucci-body">
                Personalization
              </a>
              <a href="#" className="block text-sm hover:text-gray-600 transition-colors underline gucci-body">
                Store Locator
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
