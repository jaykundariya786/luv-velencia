
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Ruler, User, Shirt } from "lucide-react";

export default function SizeGuide() {
  const navigate = useNavigate();

  const mensSizes = [
    { size: "XS", chest: "32-34", waist: "28-30", hips: "32-34" },
    { size: "S", chest: "34-36", waist: "30-32", hips: "34-36" },
    { size: "M", chest: "36-38", waist: "32-34", hips: "36-38" },
    { size: "L", chest: "38-40", waist: "34-36", hips: "38-40" },
    { size: "XL", chest: "40-42", waist: "36-38", hips: "40-42" },
    { size: "XXL", chest: "42-44", waist: "38-40", hips: "42-44" }
  ];

  const womensSizes = [
    { size: "XS", chest: "30-32", waist: "24-26", hips: "32-34" },
    { size: "S", chest: "32-34", waist: "26-28", hips: "34-36" },
    { size: "M", chest: "34-36", waist: "28-30", hips: "36-38" },
    { size: "L", chest: "36-38", waist: "30-32", hips: "38-40" },
    { size: "XL", chest: "38-40", waist: "32-34", hips: "40-42" },
    { size: "XXL", chest: "40-42", waist: "34-36", hips: "42-44" }
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
              SIZE GUIDE
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
            FIND YOUR PERFECT FIT
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
          <p className="text-gray-600 lv-body max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive size guide. All measurements are in inches.
          </p>
        </div>

        {/* How to Measure Section */}
        <div className="border-2 border-gray-200 rounded-3xl p-10 mb-16 bg-white">
          <div className="text-center mb-12">
            <h3 className="lv-luxury font-bold text-primary text-2xl text-black mb-4">
              HOW TO MEASURE
            </h3>
            <div className="w-12 h-px bg-black mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8 text-white" />
              </div>
              <h4 className="lv-luxury font-bold text-primary text-lg mb-4">CHEST/BUST</h4>
              <p className="text-gray-600 lv-body font-mono text-sm">
                Measure around the fullest part of your chest, keeping the tape parallel to the floor
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Ruler className="w-8 h-8 text-white" />
              </div>
              <h4 className="lv-luxury font-bold text-primary text-lg mb-4">WAIST</h4>
              <p className="text-gray-600 lv-body font-mono text-sm">
                Measure around your natural waistline, which is the narrowest part of your torso
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shirt className="w-8 h-8 text-white" />
              </div>
              <h4 className="lv-luxury font-bold text-primary text-lg mb-4">HIPS</h4>
              <p className="text-gray-600 lv-body font-mono text-sm">
                Measure around the fullest part of your hips, keeping the tape parallel to the floor
              </p>
            </div>
          </div>
        </div>

        {/* Size Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Men's Sizing */}
          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white">
            <div className="text-center mb-8">
              <h3 className="lv-luxury font-bold text-primary text-2xl text-black mb-4">
                MEN'S SIZING
              </h3>
              <div className="w-12 h-px bg-black mx-auto"></div>
            </div>
            
            <div className="overflow-hidden rounded-2xl border-2 border-gray-200">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 py-4 text-left lv-luxury font-bold text-primary text-sm">SIZE</th>
                    <th className="px-4 py-4 text-left lv-luxury font-bold text-primary text-sm">CHEST</th>
                    <th className="px-4 py-4 text-left lv-luxury font-bold text-primary text-sm">WAIST</th>
                    <th className="px-4 py-4 text-left lv-luxury font-bold text-primary text-sm">HIPS</th>
                  </tr>
                </thead>
                <tbody>
                  {mensSizes.map((size, index) => (
                    <tr key={index} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 lv-luxury font-bold text-primary">{size.size}</td>
                      <td className="px-4 py-4 lv-body text-gray-600 font-mono text-sm">{size.chest}</td>
                      <td className="px-4 py-4 lv-body text-gray-600 font-mono text-sm">{size.waist}</td>
                      <td className="px-4 py-4 lv-body text-gray-600 font-mono text-sm">{size.hips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Women's Sizing */}
          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white">
            <div className="text-center mb-8">
              <h3 className="lv-luxury font-bold text-primary text-2xl text-black mb-4">
                WOMEN'S SIZING
              </h3>
              <div className="w-12 h-px bg-black mx-auto"></div>
            </div>
            
            <div className="overflow-hidden rounded-2xl border-2 border-gray-200">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 py-4 text-left lv-luxury font-bold text-primary text-sm">SIZE</th>
                    <th className="px-4 py-4 text-left lv-luxury font-bold text-primary text-sm">CHEST</th>
                    <th className="px-4 py-4 text-left lv-luxury font-bold text-primary text-sm">WAIST</th>
                    <th className="px-4 py-4 text-left lv-luxury font-bold text-primary text-sm">HIPS</th>
                  </tr>
                </thead>
                <tbody>
                  {womensSizes.map((size, index) => (
                    <tr key={index} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 lv-luxury font-bold text-primary">{size.size}</td>
                      <td className="px-4 py-4 lv-body text-gray-600 font-mono text-sm">{size.chest}</td>
                      <td className="px-4 py-4 lv-body text-gray-600 font-mono text-sm">{size.waist}</td>
                      <td className="px-4 py-4 lv-body text-gray-600 font-mono text-sm">{size.hips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Fit Tips */}
        <div className="border-2 border-gray-200 rounded-3xl p-10 bg-white">
          <div className="text-center mb-12">
            <h3 className="lv-luxury font-bold text-primary text-2xl text-black mb-4">
              FIT TIPS
            </h3>
            <div className="w-12 h-px bg-black mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Ruler className="w-6 h-6 text-white" />
              </div>
              <h4 className="lv-luxury font-bold text-primary text-lg mb-3">BETWEEN SIZES?</h4>
              <p className="text-gray-600 lv-body font-mono text-sm">
                If you're between sizes, we recommend choosing the larger size for a more comfortable fit.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-xl flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <h4 className="lv-luxury font-bold text-primary text-lg mb-3">STILL UNSURE?</h4>
              <p className="text-gray-600 lv-body font-mono text-sm">
                Contact our customer service team for personalized sizing assistance and recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
