import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import Header from "@/components/header";
import Home from "./pages/home";
import ProductDetail from "./pages/product-detail";
import NotFound from "./pages/not-found";
import ShoppingBag from "./pages/shopping-bag";
import PrintShoppingBag from "./pages/print-shopping-bag";
import SignIn from "./pages/sign-in";
import Account from "./pages/account";
import SearchResults from "./pages/search-results";
import Footer from "@/components/footer";
import BookAppointment from './pages/book-appointment';
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cookieNoticeVisible, setCookieNoticeVisible] = useState(true);

  // Initialize Firebase auth
  useFirebaseAuth();

  return (
    <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-white">
          <Header
            onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onSearchToggle={() => setIsSearchOpen(!isSearchOpen)}
            isMobileMenuOpen={isMobileMenuOpen}
            isSearchOpen={isSearchOpen}
            onMobileMenuClose={() => setIsMobileMenuOpen(false)}
            onSearchClose={() => setIsSearchOpen(false)}
            cookieNoticeVisible={cookieNoticeVisible}
          />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/shopping-bag" element={<ShoppingBag />} />
              <Route path="/print-shopping-bag" element={<PrintShoppingBag />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/account/*" element={<Account />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
  );
}

export default App;