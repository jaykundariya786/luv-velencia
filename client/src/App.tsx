import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import Header from "@/components/header";
import Home from "./pages/home";
import ProductDetail from "./pages/product-detail";
import ShoppingBag from "./pages/shopping-bag";
import PrintShoppingBag from "./pages/print-shopping-bag";
import SignIn from "./pages/sign-in";
import Account from "./pages/account";
import SearchResults from "./pages/search-results";
import NotFound from "./pages/not-found";
import Services from "./pages/services";
import About from "./pages/about";
import FAQ from "./pages/faq";
import ProductCare from "./pages/product-care";
import GiftServices from "./pages/gift-services";
import BookAppointment from "./pages/book-appointment";
import Contact from "./pages/contact";
import SizeGuide from "./pages/size-guide";
import ShippingReturns from "./pages/shipping-returns";
import PrivacyPolicy from "./pages/privacy-policy";
import CookiePolicy from "./pages/cookie-policy";
import TermsOfUse from "./pages/terms-of-use";
import Footer from "@/components/footer";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "./store";
import SubscriptionPlans from './pages/subscription-plans';
import SubscriptionCheckout from './pages/subscription-checkout';

const queryClient = new QueryClient();

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cookieNoticeVisible, setCookieNoticeVisible] = useState(true);

  // Initialize Firebase auth
  useFirebaseAuth();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
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
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/product-care" element={<ProductCare />} />
                <Route path="/gift-services" element={<GiftServices />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/size-guide" element={<SizeGuide />} />
                <Route path="/shipping-returns" element={<ShippingReturns />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/terms-of-use" element={<TermsOfUse />} />
                <Route path="/subscription-plans" element={<SubscriptionPlans />} />
                <Route path="/subscription-checkout" element={<SubscriptionCheckout />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;