
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Lock, Users } from "lucide-react";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Hero Section */}
      <div
        className="relative h-[400px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lv-luxury text-primary lv-fade-in tracking-[0.2em] drop-shadow-2xl">
              PRIVACY POLICY
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
            YOUR PRIVACY MATTERS
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
          <p className="lv-body text-gray-500 font-mono text-sm lv-transition max-w-2xl mx-auto">
            At LUV VENCENCIA, we are committed to protecting your privacy and ensuring the security of your personal information with the highest standards of data protection.
          </p>
        </div>

        {/* Information Collection Section */}
        <div className="border-2 rounded-3xl border-gray-200 p-8 mb-12 bg-white">
          <div className="flex items-start gap-8 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="mb-6">
                <h3 className="lv-luxury font-bold text-primary text-2xl mb-2">
                  INFORMATION WE COLLECT
                </h3>
                <div className="w-12 h-px bg-gray-400"></div>
              </div>
              <p className="lv-body text-gray-500 font-mono text-sm lv-transition mb-6">
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    Personal identification information (name, email, phone number)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    Billing and shipping addresses
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    Payment information (processed securely through our payment partners)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    Purchase history and preferences
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Section */}
        <div className="border-2 rounded-3xl border-gray-200 p-8 mb-12 bg-white">
          <div className="flex items-start gap-8 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="mb-6">
                <h3 className="lv-luxury font-bold text-primary text-2xl mb-2">
                  HOW WE USE YOUR INFORMATION
                </h3>
                <div className="w-12 h-px bg-gray-400"></div>
              </div>
              <p className="lv-body text-gray-500 font-mono text-sm lv-transition mb-6">
                We use the information we collect to provide, maintain, and improve our services with excellence and personalization.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    Process and fulfill your orders with precision
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    Send you order confirmations and shipping updates
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    Provide exceptional customer support
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    Send promotional emails (with your consent)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    Improve our products and services continuously
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Security Section */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"></div>
          <div className="relative border-2 rounded-3xl border-emerald-200 p-10">
            <div className="md:flex lg:flex grid grid-cols-1 items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-6">
                  <h3 className="text-2xl lv-luxury text-md font-bold text-primary mb-2">
                    DATA SECURITY & PROTECTION
                  </h3>
                  <div className="w-12 h-px bg-emerald-600"></div>
                </div>

                <p className="lv-body text-gray-500 font-mono text-sm lv-transition mb-6">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payment information is encrypted and processed through secure, PCI-compliant payment processors.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                      SSL ENCRYPTION
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                      GDPR COMPLIANT
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                      24/7 MONITORING
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-4 rounded-lg right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-300 opacity-30"></div>
            <div className="absolute bottom-4 rounded-lg left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-300 opacity-30"></div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-16">
          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white">
            <h3 className="lv-luxury font-bold text-primary text-2xl mb-4">
              QUESTIONS ABOUT OUR PRIVACY POLICY?
            </h3>
            <div className="w-16 h-px bg-black mx-auto mb-6"></div>
            <p className="lv-body text-gray-500 font-mono text-sm lv-transition mb-6">
              If you have any questions about this Privacy Policy, please contact us at privacy@luvvencencia.com or through our contact page.
            </p>
            <Button
              onClick={() => navigate("/contact")}
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-xs lv-luxury font-bold rounded-full transition-all duration-300"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
