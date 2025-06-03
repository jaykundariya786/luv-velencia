import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CookieNoticeProps {
  onClose: () => void;
}

export default function CookieNotice({ onClose }: CookieNoticeProps) {
  return (
    <div className="cookie-notice">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600">
            <strong>We Use Cookies</strong><br />
            We use cookies and similar technologies to enhance site navigation, analyze site usage, and assist our marketing efforts.
          </p>
          <p className="text-xs text-gray-600 mt-1">
            For more information about these technologies and their use on this website, please consult our{" "}
            <a href="#" className="underline hover:no-underline">
              Cookie Policy
            </a>
            .
          </p>
        </div>
        <div className="flex gap-3 ml-6">
          <Button
            onClick={onClose}
            className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors gucci-button"
          >
            OK
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            COOKIES SETTINGS
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600 p-2"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
