import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ShoppingBagProvider } from "./contexts/shopping-bag-context";
import { AuthProvider } from "./contexts/auth-context";
import { useState } from "react";
import Header from "@/components/header";
import MobileMenu from "@/components/mobile-menu";
import SearchOverlay from "@/components/search-overlay";
import Home from "./pages/home";
import ProductDetail from "./pages/product-detail";
import NotFound from "./pages/not-found";
import ShoppingBag from "./pages/shopping-bag";
import PrintShoppingBag from "./pages/print-shopping-bag";
import SignIn from "./pages/sign-in";
import Account from "./pages/account";
import Footer from "./components/footer";

const queryClient = new QueryClient();

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cookieNoticeVisible, setCookieNoticeVisible] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ShoppingBagProvider>
            <Router>
              <div className="min-h-screen bg-white">
                {/* Header */}
                <Header
                  onMobileMenuToggle={() =>
                    setIsMobileMenuOpen(!isMobileMenuOpen)
                  }
                  onSearchToggle={() => setIsSearchOpen(!isSearchOpen)}
                  cookieNoticeVisible={cookieNoticeVisible}
                />

                {/* Mobile Menu */}
                <MobileMenu
                  isOpen={isMobileMenuOpen}
                  onClose={() => setIsMobileMenuOpen(false)}
                />

                {/* Search Overlay */}
                <SearchOverlay
                  isOpen={isSearchOpen}
                  onClose={() => setIsSearchOpen(false)}
                  onSearch={function (searchTerm: string): void {
                    throw new Error("Function not implemented.");
                  }}
                />

                {/* Main Content */}
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/shopping-bag" element={<ShoppingBag />} />
                    <Route
                      path="/print-shopping-bag"
                      element={<PrintShoppingBag />}
                    />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/account/*" element={<Account />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>

                {/* Footer */}
                <Footer />

                <Toaster />
              </div>
            </Router>
          </ShoppingBagProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
