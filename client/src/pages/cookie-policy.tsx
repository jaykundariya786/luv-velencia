
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Cookie, Settings, BarChart3, Wrench } from "lucide-react";

export default function CookiePolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Hero Section */}
      <div
        className="relative h-[400px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lv-luxury text-primary lv-fade-in tracking-[0.2em] drop-shadow-2xl">
              COOKIE POLICY
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
            UNDERSTANDING COOKIES
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
          <p className="lv-body text-gray-500 font-mono text-sm lv-transition max-w-2xl mx-auto">
            This Cookie Policy explains how LUV VENCENCIA uses cookies and similar technologies when you visit our website to enhance your browsing experience.
          </p>
        </div>

        {/* What Are Cookies Section */}
        <div className="border-2 rounded-3xl border-gray-200 p-8 mb-12 bg-white">
          <div className="flex items-start gap-8 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center">
              <Cookie className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="mb-6">
                <h3 className="lv-luxury font-bold text-primary text-2xl mb-2">
                  WHAT ARE COOKIES
                </h3>
                <div className="w-12 h-px bg-gray-400"></div>
              </div>
              <p className="lv-body text-gray-500 font-mono text-sm lv-transition">
                Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better browsing experience by remembering your preferences and improving site functionality to deliver exceptional service.
              </p>
            </div>
          </div>
        </div>

        {/* Essential Cookies */}
        <div className="border-2 rounded-3xl border-gray-200 p-8 mb-8 bg-white">
          <div className="flex items-start gap-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h4 className="lv-luxury font-bold text-primary text-xl mb-2">
                  ESSENTIAL COOKIES
                </h4>
                <div className="w-10 h-px bg-blue-400"></div>
              </div>
              <p className="lv-body text-gray-500 font-mono text-sm lv-transition">
                These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas of our boutique experience.
              </p>
            </div>
          </div>
        </div>

        {/* Performance Cookies */}
        <div className="border-2 rounded-3xl border-gray-200 p-8 mb-8 bg-white">
          <div className="flex items-start gap-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h4 className="lv-luxury font-bold text-primary text-xl mb-2">
                  PERFORMANCE COOKIES
                </h4>
                <div className="w-10 h-px bg-green-400"></div>
              </div>
              <p className="lv-body text-gray-500 font-mono text-sm lv-transition">
                These cookies help us understand how visitors interact with our website by collecting anonymous information about page visits and user behavior to continuously improve our service.
              </p>
            </div>
          </div>
        </div>

        {/* Functional Cookies */}
        <div className="border-2 rounded-3xl border-gray-200 p-8 mb-12 bg-white">
          <div className="flex items-start gap-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Wrench className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h4 className="lv-luxury font-bold text-primary text-xl mb-2">
                  FUNCTIONAL COOKIES
                </h4>
                <div className="w-10 h-px bg-purple-400"></div>
              </div>
              <p className="lv-body text-gray-500 font-mono text-sm lv-transition">
                These cookies remember your preferences and choices to provide a more personalized experience, such as language preferences and shopping cart contents for a seamless luxury experience.
              </p>
            </div>
          </div>
        </div>

        {/* Managing Cookies Section */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50"></div>
          <div className="relative border-2 rounded-3xl border-orange-200 p-10">
            <div className="text-center">
              <div className="mb-6">
                <h3 className="text-2xl lv-luxury text-md font-bold text-primary mb-2">
                  MANAGING YOUR COOKIES
                </h3>
                <div className="w-12 h-px bg-orange-600 mx-auto"></div>
              </div>

              <p className="lv-body text-gray-500 font-mono text-sm lv-transition mb-8 max-w-2xl mx-auto">
                You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our website and your luxury shopping experience.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    BROWSER SETTINGS CONTROL
                  </span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    PERSONALIZED EXPERIENCE
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute top-4 rounded-lg right-4 w-8 h-8 border-t-2 border-r-2 border-orange-300 opacity-30"></div>
            <div className="absolute bottom-4 rounded-lg left-4 w-8 h-8 border-b-2 border-l-2 border-orange-300 opacity-30"></div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-16">
          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white">
            <h3 className="lv-luxury font-bold text-primary text-2xl mb-4">
              QUESTIONS ABOUT OUR COOKIE POLICY?
            </h3>
            <div className="w-16 h-px bg-black mx-auto mb-6"></div>
            <p className="lv-body text-gray-500 font-mono text-sm lv-transition mb-6">
              If you have any questions about our Cookie Policy, please contact us at cookies@luvvencencia.com or through our contact page.
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
