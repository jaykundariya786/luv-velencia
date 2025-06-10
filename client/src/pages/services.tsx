
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Services() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Hero Section */}
      <div
        className="relative h-[400px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lv-luxury text-primary lv-fade-in tracking-[0.2em] drop-shadow-2xl">
              OUR SERVICES
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
            G
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Services Introduction */}
        <div className="text-center mb-16">
          <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
            LUXURY SERVICES
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
          <p className="lv-body text-gray-500 font-mono lv-transition text-lg max-w-2xl mx-auto">
            At LUV VENCENCIA, we offer a comprehensive range of luxury services designed to enhance your shopping experience and ensure complete satisfaction.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-luxury transition-all duration-300">
            <h3 className="text-2xl lv-luxury font-bold text-primary mb-4">PERSONAL STYLING</h3>
            <div className="w-12 h-px bg-primary mb-6"></div>
            <p className="lv-body text-gray-500 font-mono lv-transition mb-6">
              Our expert stylists provide personalized fashion consultations to help you discover your unique style and build the perfect wardrobe.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="lv-body text-gray-500 font-mono text-sm">One-on-one consultations</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="lv-body text-gray-500 font-mono text-sm">Style assessment</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="lv-body text-gray-500 font-mono text-sm">Wardrobe planning</span>
              </li>
            </ul>
          </div>

          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-luxury transition-all duration-300">
            <h3 className="text-2xl lv-luxury font-bold text-primary mb-4">CUSTOM TAILORING</h3>
            <div className="w-12 h-px bg-primary mb-6"></div>
            <p className="lv-body text-gray-500 font-mono lv-transition mb-6">
              Professional alteration and tailoring services to ensure every piece fits you perfectly and reflects your personal aesthetic.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="lv-body text-gray-500 font-mono text-sm">Expert alterations</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="lv-body text-gray-500 font-mono text-sm">Perfect fit guarantee</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="lv-body text-gray-500 font-mono text-sm">Premium materials</span>
              </li>
            </ul>
          </div>

          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-luxury transition-all duration-300">
            <h3 className="text-2xl lv-luxury font-bold text-primary mb-4">VIP SHOPPING EXPERIENCE</h3>
            <div className="w-12 h-px bg-primary mb-6"></div>
            <p className="lv-body text-gray-500 font-mono lv-transition mb-6">
              Enjoy exclusive access to new collections, private shopping sessions, and priority customer service for our valued clients.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="lv-body text-gray-500 font-mono text-sm">Private appointments</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="lv-body text-gray-500 font-mono text-sm">Early access to collections</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="lv-body text-gray-500 font-mono text-sm">Priority customer service</span>
              </li>
            </ul>
          </div>

          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-luxury transition-all duration-300">
            <h3 className="text-2xl lv-luxury font-bold text-primary mb-4">WARDROBE CONSULTATION</h3>
            <div className="w-12 h-px bg-primary mb-6"></div>
            <p className="lv-body text-gray-500 font-mono lv-transition mb-6">
              Comprehensive wardrobe analysis and styling advice to maximize your existing pieces and identify key additions.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="lv-body text-gray-500 font-mono text-sm">Wardrobe audit</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="lv-body text-gray-500 font-mono text-sm">Styling recommendations</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="lv-body text-gray-500 font-mono text-sm">Investment pieces advice</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"></div>
          <div className="relative border-2 rounded-3xl border-emerald-200 p-10 text-center">
            <h2 className="text-3xl lv-luxury font-bold text-primary mb-4">BOOK A SERVICE</h2>
            <div className="w-16 h-px bg-primary mx-auto mb-6"></div>
            <p className="lv-body text-gray-500 font-mono lv-transition mb-8 max-w-2xl mx-auto">
              Ready to elevate your style? Contact us to schedule a consultation or learn more about our premium services.
            </p>
            <Button
              onClick={() => navigate('/book-appointment')}
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-12 py-6 text-xs lv-luxury font-bold rounded-full transition-all duration-300"
            >
              Schedule Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
