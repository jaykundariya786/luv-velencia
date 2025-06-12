
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function FAQ() {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unworn items in their original condition with tags attached. Items must be returned in their original packaging."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days within the US. Express shipping is available for 1-2 business days. International shipping varies by location."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship worldwide. Shipping costs and delivery times vary by destination. Please check our shipping page for specific details for your country."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay for your convenience."
    },
    {
      question: "How do I find my size?",
      answer: "We provide detailed size guides for each product category. You can find the size guide link on each product page. We also offer virtual fitting consultations."
    },
    {
      question: "Do you offer gift cards?",
      answer: "Yes, we offer digital gift cards in various denominations. Gift cards can be purchased online and are delivered via email instantly."
    },
    {
      question: "Can I modify or cancel my order?",
      answer: "Orders can be modified or cancelled within 1 hour of placement. After this time, orders enter our fulfillment process and cannot be changed."
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
              FREQUENTLY ASKED QUESTIONS
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
            HOW CAN WE HELP?
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
          <p className="lv-body text-gray-500 font-mono lv-transition text-lg max-w-2xl mx-auto">
            Find answers to the most common questions about shopping with LUV VENCENCIA.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="border-2 border-gray-200 rounded-3xl p-8 mb-12 bg-white">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full text-left flex justify-between items-center py-4 hover:bg-gray-50 rounded-lg px-4 transition-all duration-300"
                >
                  <span className="lv-luxury font-bold text-primary text-lg">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                    openItems.includes(index) ? 'rotate-180' : 'rotate-0'
                  }`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openItems.includes(index) 
                    ? 'max-h-96 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-4 pb-4 transform transition-transform duration-300">
                    <p className="lv-body text-gray-500 font-mono lv-transition">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Still Have Questions Section */}
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"></div>
          <div className="relative border-2 rounded-3xl border-emerald-200 p-10 text-center">
            <h2 className="text-3xl lv-luxury font-bold text-primary mb-4">STILL HAVE QUESTIONS?</h2>
            <div className="w-16 h-px bg-primary mx-auto mb-6"></div>
            <p className="lv-body text-gray-500 font-mono lv-transition mb-8 max-w-2xl mx-auto">
              Our customer service team is here to help. Contact us for personalized assistance with any questions not covered above.
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
