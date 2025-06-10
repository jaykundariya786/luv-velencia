
import { ArrowLeft, Gift, Package, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function GiftServices() {
  const navigate = useNavigate();

  const services = [
    {
      icon: Gift,
      title: "GIFT WRAPPING",
      description: "Elegant gift wrapping with premium materials and personalized ribbons",
      features: ["Luxury packaging", "Custom ribbon colors", "Gift message cards", "Branded gift boxes"]
    },
    {
      icon: Package,
      title: "PERSONAL SHOPPING",
      description: "Expert stylists help you choose the perfect gift for your loved ones",
      features: ["Style consultation", "Size recommendations", "Occasion-specific selections", "Budget guidance"]
    },
    {
      icon: Heart,
      title: "GIFT CARDS",
      description: "Digital and physical gift cards in various denominations",
      features: ["Instant delivery", "Custom amounts", "Beautiful designs", "Never expire"]
    },
    {
      icon: Star,
      title: "VIP GIFT EXPERIENCE",
      description: "Premium service for special occasions and corporate gifts",
      features: ["Dedicated gift specialist", "Express delivery", "Multiple recipient shipping", "Gift tracking"]
    }
  ];

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
              GIFT SERVICES
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
        {/* Introduction */}
        <div className="text-center mb-16">
          <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
            LUXURY GIFT SERVICES
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
          <p className="lv-body text-gray-500 font-mono lv-transition text-lg max-w-3xl mx-auto">
            Make every gift special with our comprehensive gift services, designed to create memorable moments for your loved ones.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-luxury transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl lv-luxury font-bold text-primary">{service.title}</h3>
              </div>
              <p className="lv-body text-gray-500 font-mono lv-transition mb-6">{service.description}</p>
              <ul className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="lv-body text-gray-500 font-mono text-sm lv-transition flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Special Occasions */}
        <div className="text-center mb-16">
          <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
            SPECIAL OCCASIONS
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
        </div>

        <div className="border-2 border-gray-200 rounded-3xl p-8 mb-12 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="lv-luxury font-bold text-primary text-xl mb-4">BIRTHDAYS</h3>
              <div className="w-8 h-px bg-primary mx-auto mb-4"></div>
              <p className="lv-body text-gray-500 font-mono text-sm lv-transition">
                Personalized styling recommendations based on their preferences and personality
              </p>
            </div>
            <div className="text-center">
              <h3 className="lv-luxury font-bold text-primary text-xl mb-4">ANNIVERSARIES</h3>
              <div className="w-8 h-px bg-primary mx-auto mb-4"></div>
              <p className="lv-body text-gray-500 font-mono text-sm lv-transition">
                Romantic gift curation with elegant presentation and thoughtful touches
              </p>
            </div>
            <div className="text-center">
              <h3 className="lv-luxury font-bold text-primary text-xl mb-4">CORPORATE GIFTS</h3>
              <div className="w-8 h-px bg-primary mx-auto mb-4"></div>
              <p className="lv-body text-gray-500 font-mono text-sm lv-transition">
                Professional bulk ordering with custom branding and executive packaging
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
            HOW IT WORKS
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
        </div>

        <div className="border-2 border-gray-200 rounded-3xl p-8 mb-12 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-4 lv-luxury text-lg font-bold">1</div>
              <h4 className="lv-luxury font-bold text-primary text-lg mb-3">CHOOSE</h4>
              <p className="lv-body text-gray-500 font-mono text-sm lv-transition">Select your items from our curated collection</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-4 lv-luxury text-lg font-bold">2</div>
              <h4 className="lv-luxury font-bold text-primary text-lg mb-3">CUSTOMIZE</h4>
              <p className="lv-body text-gray-500 font-mono text-sm lv-transition">Add gift services and special packaging</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-4 lv-luxury text-lg font-bold">3</div>
              <h4 className="lv-luxury font-bold text-primary text-lg mb-3">PERSONALIZE</h4>
              <p className="lv-body text-gray-500 font-mono text-sm lv-transition">Add your personal message and details</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-4 lv-luxury text-lg font-bold">4</div>
              <h4 className="lv-luxury font-bold text-primary text-lg mb-3">DELIVER</h4>
              <p className="lv-body text-gray-500 font-mono text-sm lv-transition">We handle the rest with care</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"></div>
          <div className="relative border-2 rounded-3xl border-emerald-200 p-10 text-center">
            <h2 className="text-3xl lv-luxury font-bold text-primary mb-4">READY TO GIVE THE PERFECT GIFT?</h2>
            <div className="w-16 h-px bg-primary mx-auto mb-6"></div>
            <p className="lv-body text-gray-500 font-mono lv-transition mb-8 max-w-2xl mx-auto">
              Let our gift specialists help you create an unforgettable experience for your loved ones.
            </p>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-12 py-6 text-xs lv-luxury font-bold rounded-full transition-all duration-300"
            >
              Start Shopping
            </Button>

            {/* Decorative corner elements */}
            <div className="absolute top-4 rounded-lg right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-300 opacity-30"></div>
            <div className="absolute bottom-4 rounded-lg left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-300 opacity-30"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
