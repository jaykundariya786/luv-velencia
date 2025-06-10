
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Scale, ShoppingCart, AlertTriangle, Mail } from "lucide-react";

export default function TermsOfUse() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Hero Section */}
      <div
        className="relative h-[400px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lv-luxury text-primary lv-fade-in tracking-[0.2em] drop-shadow-2xl">
              TERMS OF USE
            </h1>
          </div>
        </div>

        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          size="sm"
          className="absolute top-8 left-8 text-white hover:bg-white/20 p-3 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Diamond Logo */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rotate-45 flex items-center justify-center">
          <span className="text-white text-lg font-bold transform -rotate-45">
            L
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Introduction */}
        <div className="text-center mb-16">
          <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
            TERMS & CONDITIONS
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
          <p className="lv-body text-gray-500 font-mono text-sm lv-transition max-w-2xl mx-auto">
            Welcome to LUV VENCENCIA. These Terms of Use govern your access to and use of our website and services, ensuring a luxurious and secure experience.
          </p>
        </div>

        {/* Acceptance Section */}
        <div className="border-2 rounded-3xl border-gray-200 p-8 mb-12 bg-white">
          <div className="flex items-start gap-8 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="mb-6">
                <h3 className="lv-luxury font-bold text-primary text-2xl mb-2">
                  ACCEPTANCE OF TERMS
                </h3>
                <div className="w-12 h-px bg-gray-400"></div>
              </div>
              <p className="lv-body text-gray-500 font-mono text-sm lv-transition">
                By accessing and using our website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service. Your continued use of our platform signifies your acceptance of these terms.
              </p>
            </div>
          </div>
        </div>

        {/* License Section */}
        <div className="border-2 rounded-3xl border-gray-200 p-8 mb-8 bg-white">
          <div className="flex items-start gap-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="mb-6">
                <h4 className="lv-luxury font-bold text-primary text-xl mb-2">
                  USE LICENSE
                </h4>
                <div className="w-10 h-px bg-blue-400"></div>
              </div>
              <p className="lv-body text-gray-500 font-mono text-sm lv-transition mb-4">
                Permission is granted to temporarily download one copy of the materials on LUV VENCENCIA's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    Modify or copy the materials
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    Use the materials for any commercial purpose or for any public display
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    Attempt to reverse engineer any software contained on the website
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    Remove any copyright or other proprietary notations from the materials
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="border-2 rounded-3xl border-gray-200 p-8 mb-8 bg-white">
          <div className="flex items-start gap-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h4 className="lv-luxury font-bold text-primary text-xl mb-2">
                  PRODUCT INFORMATION & ORDERS
                </h4>
                <div className="w-10 h-px bg-green-400"></div>
              </div>
              <p className="lv-body text-gray-500 font-mono text-sm lv-transition mb-4">
                We strive to provide accurate product information, including descriptions, colors, and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, or error-free.
              </p>
              <p className="lv-body text-gray-500 font-mono text-sm lv-transition">
                All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order at any time. Payment must be received before shipment of goods.
              </p>
            </div>
          </div>
        </div>

        {/* Limitation Section */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-red-50 via-pink-50 to-rose-50"></div>
          <div className="relative border-2 rounded-3xl border-red-200 p-10">
            <div className="md:flex lg:flex grid grid-cols-1 items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-6">
                  <h3 className="text-2xl lv-luxury text-md font-bold text-primary mb-2">
                    LIMITATION OF LIABILITY
                  </h3>
                  <div className="w-12 h-px bg-red-600"></div>
                </div>

                <p className="lv-body text-gray-500 font-mono text-sm lv-transition mb-6">
                  In no event shall LUV VENCENCIA or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website or the purchase of our products. We maintain the highest standards while limiting liability within legal bounds.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                      LEGAL PROTECTION
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                      FAIR USAGE POLICY
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-4 rounded-lg right-4 w-8 h-8 border-t-2 border-r-2 border-red-300 opacity-30"></div>
            <div className="absolute bottom-4 rounded-lg left-4 w-8 h-8 border-b-2 border-l-2 border-red-300 opacity-30"></div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-16">
          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="lv-luxury font-bold text-primary text-2xl">
                LEGAL INQUIRIES
              </h3>
            </div>
            <div className="w-16 h-px bg-black mx-auto mb-6"></div>
            <p className="lv-body text-gray-500 font-mono text-sm lv-transition mb-6">
              If you have any questions about these Terms of Use, please contact us at legal@luvvencencia.com or through our contact page.
            </p>
            <Button
              onClick={() => navigate("/contact")}
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-xs lv-luxury font-bold rounded-full transition-all duration-300 hover:scale-105"
            >
              Contact Legal Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
