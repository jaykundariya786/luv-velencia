
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Crown, Star, Sparkles, Shield, Gift } from "lucide-react";

export default function SubscriptionPlans() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Silver",
      price: 29,
      icon: <Star className="w-8 h-8 text-gray-500" />,
      color: "border-gray-300",
      bgColor: "bg-gradient-to-br from-gray-50 to-gray-100",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      features: [
        "10% discount on all purchases",
        "Early access to sales",
        "Free standard shipping",
        "Birthday surprise gift",
        "Exclusive newsletter content",
        "Basic styling tips"
      ]
    },
    {
      name: "Gold",
      price: 59,
      icon: <Crown className="w-8 h-8 text-yellow-600" />,
      color: "border-yellow-400",
      bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
      popular: true,
      features: [
        "20% discount on all purchases",
        "Priority early access to new collections",
        "Free express shipping",
        "Complimentary gift wrapping",
        "Personal styling consultation (1 per month)",
        "Exclusive member-only events",
        "Special birthday collection access",
        "Returns extended to 45 days"
      ]
    },
    {
      name: "Exclusive",
      price: 99,
      icon: <Sparkles className="w-8 h-8 text-purple-600" />,
      color: "border-purple-400",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      features: [
        "30% discount on all purchases",
        "First access to limited edition pieces",
        "Free overnight shipping",
        "Complimentary alterations",
        "Unlimited personal styling consultations",
        "VIP shopping appointments",
        "Exclusive design previews",
        "Custom wardrobe curation",
        "60-day return window",
        "Concierge customer service"
      ]
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
              SUBSCRIPTION PLANS
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Introduction */}
        <div className="text-center mb-16">
          <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
            ELEVATE YOUR EXPERIENCE
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
          <p className="text-gray-600 lv-body text-lg max-w-2xl mx-auto">
            Unlock exclusive benefits and elevate your LUV VENCENCIA experience with our premium membership tiers.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative border-2 rounded-3xl p-8 ${plan.color} ${plan.bgColor} hover:shadow-lg transition-all duration-300 ${
                plan.popular ? 'transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-black text-white px-6 py-2 rounded-full text-sm lv-luxury font-bold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    {plan.icon}
                  </div>
                </div>
                <h3 className="text-2xl lv-luxury font-bold text-primary text-black mb-4">
                  {plan.name.toUpperCase()}
                </h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-4xl lv-luxury font-bold text-black">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500 lv-body font-mono text-sm">/month</span>
                </div>
                <div className="w-8 h-px bg-black mx-auto"></div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700 lv-body font-mono text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => {
                  const { icon, ...planData } = plan;
                  navigate('/subscription-checkout', { state: { plan: planData } });
                }}
                className={`w-full py-3 px-6 rounded-full text-white lv-luxury font-bold transition-all duration-300 hover:scale-105 ${plan.buttonColor}`}
              >
                CHOOSE {plan.name.toUpperCase()}
              </Button>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="border-2 border-gray-200 rounded-3xl p-10 mb-16 bg-white">
          <div className="text-center mb-12">
            <h2 className="lv-luxury font-bold text-primary text-2xl text-black mb-4">
              MEMBERSHIP BENEFITS
            </h2>
            <div className="w-12 h-px bg-black mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="lv-luxury font-bold text-primary text-lg mb-4">EXCLUSIVE PERKS</h3>
              <p className="text-gray-600 lv-body font-mono text-sm">
                Enjoy member-only discounts, early access to sales, and special birthday surprises
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="lv-luxury font-bold text-primary text-lg mb-4">PREMIUM SERVICE</h3>
              <p className="text-gray-600 lv-body font-mono text-sm">
                Access to personal styling, priority customer service, and complimentary services
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="lv-luxury font-bold text-primary text-lg mb-4">VIP ACCESS</h3>
              <p className="text-gray-600 lv-body font-mono text-sm">
                First access to new collections, exclusive events, and limited edition pieces
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="border-2 border-gray-200 rounded-3xl p-10 bg-white">
          <div className="text-center mb-12">
            <h2 className="lv-luxury font-bold text-primary text-2xl text-black mb-4">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <div className="w-12 h-px bg-black mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="border-l-4 border-[#197149] pl-6">
                <h3 className="lv-luxury font-bold text-primary text-lg mb-3">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-gray-600 lv-body font-mono text-sm">
                  Yes, you can cancel your subscription at any time. Your benefits will continue until the end of your current billing period.
                </p>
              </div>
              
              <div className="border-l-4 border-[#197149] pl-6">
                <h3 className="lv-luxury font-bold text-primary text-lg mb-3">
                  Can I upgrade or downgrade my plan?
                </h3>
                <p className="text-gray-600 lv-body font-mono text-sm">
                  Yes, you can change your plan at any time. Changes will take effect at your next billing cycle.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="border-l-4 border-[#197149] pl-6">
                <h3 className="lv-luxury font-bold text-primary text-lg mb-3">
                  Do discounts apply to sale items?
                </h3>
                <p className="text-gray-600 lv-body font-mono text-sm">
                  Member discounts apply to regular-priced items. Some exclusions may apply to limited edition and heavily discounted items.
                </p>
              </div>
              
              <div className="border-l-4 border-[#197149] pl-6">
                <h3 className="lv-luxury font-bold text-primary text-lg mb-3">
                  Are there any setup fees?
                </h3>
                <p className="text-gray-600 lv-body font-mono text-sm">
                  No setup fees. Just pay your monthly subscription fee and start enjoying your benefits immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
