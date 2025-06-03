import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
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

      <div className="space-y-4 px-4">
        <a href="#" className="block text-lg font-medium py-2  gucci-body">
          Father's Day Gifts
        </a>
        <a href="#" className="block text-lg font-medium  gucci-body">
          New In
        </a>

        <a href="#" className="block text-lg font-medium py-2  gucci-body">
          Men
        </a>
      </div>
    </div>
  );
}
