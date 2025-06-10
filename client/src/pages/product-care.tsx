
import { ArrowLeft, Shirt, Droplets, Sun, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ProductCare() {
  const navigate = useNavigate();

  const careInstructions = [
    {
      icon: Droplets,
      title: "WASHING",
      items: [
        "Always check the care label before washing",
        "Use cold water for dark colors to prevent fading",
        "Turn garments inside out to protect prints and colors",
        "Use gentle, color-safe detergents",
        "Separate whites from colored items"
      ]
    },
    {
      icon: Sun,
      title: "DRYING",
      items: [
        "Air dry when possible to maintain fabric integrity",
        "Avoid direct sunlight for colored items",
        "Hang delicate items to prevent stretching",
        "Use low heat settings if machine drying",
        "Remove promptly to prevent wrinkles"
      ]
    },
    {
      icon: Settings,
      title: "IRONING & STORAGE",
      items: [
        "Iron inside out to protect fabric surface",
        "Use appropriate heat settings for different materials",
        "Hang or fold properly to prevent creasing",
        "Store in cool, dry places",
        "Use cedar blocks or lavender sachets for freshness"
      ]
    }
  ];

  const fabricGuide = [
    { fabric: "Cotton", care: "Machine wash cold, tumble dry low" },
    { fabric: "Silk", care: "Dry clean only or hand wash with silk detergent" },
    { fabric: "Wool", care: "Dry clean recommended, or hand wash cold" },
    { fabric: "Denim", care: "Wash inside out in cold water, air dry" },
    { fabric: "Linen", care: "Machine wash cold, iron while damp" },
    { fabric: "Cashmere", care: "Hand wash cold, lay flat to dry" }
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
              PRODUCT CARE GUIDE
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
            CARING FOR YOUR LUXURY PIECES
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
          <p className="lv-body text-gray-500 font-mono lv-transition text-lg max-w-3xl mx-auto">
            Proper care ensures your LUV VENCENCIA pieces maintain their beauty and quality for years to come.
          </p>
        </div>

        {/* Care Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {careInstructions.map((section, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-luxury transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl lv-luxury font-bold text-primary">{section.title}</h3>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="lv-body text-gray-500 font-mono text-sm lv-transition flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Fabric-Specific Care */}
        <div className="text-center mb-16">
          <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
            FABRIC-SPECIFIC CARE
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
        </div>

        <div className="border-2 border-gray-200 rounded-3xl p-8 mb-12 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fabricGuide.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0">
                <span className="lv-luxury font-bold text-primary text-lg">{item.fabric}</span>
                <span className="lv-body text-gray-500 font-mono text-sm lv-transition">{item.care}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Important Reminders */}
        <div className="border-2 border-red-200 rounded-3xl p-8 mb-12 bg-red-50">
          <h3 className="text-2xl lv-luxury font-bold text-red-800 mb-6">IMPORTANT REMINDERS</h3>
          <div className="w-12 h-px bg-red-600 mb-6"></div>
          <ul className="space-y-3 text-red-700">
            <li className="lv-body font-mono text-sm lv-transition flex items-start">
              <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Always test any cleaning method on an inconspicuous area first
            </li>
            <li className="lv-body font-mono text-sm lv-transition flex items-start">
              <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Professional dry cleaning is recommended for structured garments
            </li>
            <li className="lv-body font-mono text-sm lv-transition flex items-start">
              <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Avoid using bleach or harsh chemicals on luxury fabrics
            </li>
            <li className="lv-body font-mono text-sm lv-transition flex items-start">
              <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Store leather items with dust bags in a cool, dry place
            </li>
          </ul>
        </div>

        {/* Need Help Section */}
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"></div>
          <div className="relative border-2 rounded-3xl border-emerald-200 p-10 text-center">
            <h2 className="text-3xl lv-luxury font-bold text-primary mb-4">NEED HELP?</h2>
            <div className="w-16 h-px bg-primary mx-auto mb-6"></div>
            <p className="lv-body text-gray-500 font-mono lv-transition mb-8 max-w-2xl mx-auto">
              Have questions about caring for a specific item? Our customer service team is here to help with personalized care advice.
            </p>
            <Button
              onClick={() => navigate('/contact')}
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-12 py-6 text-xs lv-luxury font-bold rounded-full transition-all duration-300"
            >
              Contact Support
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
