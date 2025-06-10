
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function About() {
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
              ABOUT LUV VENCENCIA
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
        {/* Brand Introduction */}
        <div className="text-center mb-16">
          <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
            OUR LEGACY
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
          <p className="lv-body text-gray-500 font-mono lv-transition text-lg max-w-3xl mx-auto">
            LUV VENCENCIA represents the pinnacle of luxury fashion, where timeless elegance meets contemporary innovation.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="border-2 border-gray-200 rounded-3xl p-8 mb-12 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl lv-luxury font-bold text-primary mb-4">OUR STORY</h3>
              <div className="w-12 h-px bg-primary mb-6"></div>
              <p className="lv-body text-gray-500 font-mono lv-transition mb-6">
                Founded with a vision to redefine luxury fashion, LUV VENCENCIA has been crafting exceptional pieces that embody sophistication and style. Our journey began with a simple belief: that true luxury lies in the perfect fusion of quality, craftsmanship, and design.
              </p>
              <p className="lv-body text-gray-500 font-mono lv-transition">
                Every piece in our collection tells a story of meticulous attention to detail, from the selection of premium materials to the final finishing touches that make each item truly extraordinary.
              </p>
            </div>

            <div>
              <h3 className="text-2xl lv-luxury font-bold text-primary mb-4">OUR VALUES</h3>
              <div className="w-12 h-px bg-primary mb-6"></div>
              <div className="space-y-6">
                <div>
                  <h4 className="lv-luxury font-bold text-primary text-lg mb-2">EXCELLENCE</h4>
                  <p className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    Uncompromising commitment to quality in every aspect of our business.
                  </p>
                </div>
                <div>
                  <h4 className="lv-luxury font-bold text-primary text-lg mb-2">INNOVATION</h4>
                  <p className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    Continuously pushing boundaries while respecting timeless traditions.
                  </p>
                </div>
                <div>
                  <h4 className="lv-luxury font-bold text-primary text-lg mb-2">SUSTAINABILITY</h4>
                  <p className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    Responsible practices that protect our planet for future generations.
                  </p>
                </div>
                <div>
                  <h4 className="lv-luxury font-bold text-primary text-lg mb-2">AUTHENTICITY</h4>
                  <p className="lv-body text-gray-500 font-mono text-sm lv-transition">
                    Staying true to our heritage while embracing modern sensibilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Commitment Section */}
        <div className="text-center mb-16">
          <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
            OUR COMMITMENT
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
        </div>

        <div className="border-2 border-gray-200 rounded-3xl p-8 mb-12 bg-white">
          <p className="lv-body text-gray-500 font-mono lv-transition text-lg text-center">
            At LUV VENCENCIA, we are committed to providing not just exceptional products, but an unparalleled shopping experience. Our dedicated team of fashion experts and customer service professionals work tirelessly to ensure that every interaction with our brand exceeds your expectations.
          </p>
        </div>

        {/* Craftsmanship Section */}
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"></div>
          <div className="relative border-2 rounded-3xl border-emerald-200 p-10">
            <div className="text-center">
              <h3 className="text-2xl lv-luxury font-bold text-primary mb-4">CRAFTSMANSHIP EXCELLENCE</h3>
              <div className="w-16 h-px bg-primary mx-auto mb-6"></div>
              <p className="lv-body text-gray-500 font-mono lv-transition mb-8 max-w-3xl mx-auto">
                Each piece is meticulously crafted by skilled artisans who bring decades of experience and passion to their work, ensuring that every detail meets our exacting standards.
              </p>

              {/* Craftsmanship Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mx-auto mb-3"></div>
                  <span className="lv-body text-gray-500 font-mono text-sm lv-transition block">
                    PREMIUM MATERIALS
                  </span>
                </div>
                <div className="text-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mx-auto mb-3"></div>
                  <span className="lv-body text-gray-500 font-mono text-sm lv-transition block">
                    ARTISAN CRAFTED
                  </span>
                </div>
                <div className="text-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mx-auto mb-3"></div>
                  <span className="lv-body text-gray-500 font-mono text-sm lv-transition block">
                    TIMELESS DESIGN
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute top-4 rounded-lg right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-300 opacity-30"></div>
            <div className="absolute bottom-4 rounded-lg left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-300 opacity-30"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
