import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch contact settings from admin
  const { data: contactSettings } = useQuery({
    queryKey: ['contact-settings'],
    queryFn: async () => {
      const response = await fetch('/api/contact-settings');
      if (!response.ok) {
        throw new Error('Failed to fetch contact settings');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Hero Section */}
      <div
        className="relative h-[400px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lv-luxury text-primary lv-fade-in tracking-[0.2em] drop-shadow-2xl">
              CONTACT US
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
        {/* Contact Information Section */}
        <div className="text-center mb-16">
          <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
            GET IN TOUCH
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
          <p className="text-gray-600 lv-body max-w-2xl mx-auto">
            We're here to help you with any questions or concerns. Reach out to us through any of the channels below.
          </p>
        </div>

        {/* Contact Methods Grid */}
        {/*
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl lv-luxury font-bold text-primary">EMAIL SUPPORT</h3>
            </div>
            <p className="text-gray-600 mb-6 lv-body">Get in touch via email for detailed inquiries</p>
            <div className="space-y-3">
              <p className="text-gray-600 lv-body font-mono text-sm">General: support@luvvencencia.com</p>
              <p className="text-gray-600 lv-body font-mono text-sm">Orders: orders@luvvencencia.com</p>
              <p className="text-gray-600 lv-body font-mono text-sm">Press: press@luvvencencia.com</p>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl lv-luxury font-bold text-primary">PHONE SUPPORT</h3>
            </div>
            <p className="text-gray-600 mb-6 lv-body">Speak directly with our customer service team</p>
            <div className="space-y-3">
              <p className="text-gray-600 lv-body font-mono text-sm">US: +1 (555) 123-4567</p>
              <p className="text-gray-600 lv-body font-mono text-sm">International: +1 (555) 987-6543</p>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl lv-luxury font-bold text-primary">VISIT OUR STORE</h3>
            </div>
            <p className="text-gray-600 mb-6 lv-body">Experience our products in person</p>
            <div className="space-y-3">
              <p className="text-gray-600 lv-body font-mono text-sm">123 Fashion Avenue</p>
              <p className="text-gray-600 lv-body font-mono text-sm">New York, NY 10001</p>
              <p className="text-gray-600 lv-body font-mono text-sm">United States</p>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl lv-luxury font-bold text-primary">BUSINESS HOURS</h3>
            </div>
            <p className="text-gray-600 mb-6 lv-body">When we're available to help</p>
            <div className="space-y-3">
              <p className="text-gray-600 lv-body font-mono text-sm">Monday - Friday: 9AM - 7PM EST</p>
              <p className="text-gray-600 lv-body font-mono text-sm">Saturday: 10AM - 6PM EST</p>
              <p className="text-gray-600 lv-body font-mono text-sm">Sunday: 12PM - 5PM EST</p>
            </div>
          </div>
        </div>
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl lv-luxury font-bold text-primary">EMAIL SUPPORT</h3>
            </div>
            <p className="text-gray-600 mb-6 lv-body">Get in touch via email for detailed inquiries</p>
            <div className="space-y-3">
              <p className="text-gray-600 lv-body font-mono text-sm">{contactSettings?.emailGeneral || 'support@luvvencencia.com'}</p>
              <p className="text-gray-600 lv-body font-mono text-sm">{contactSettings?.emailOrders || 'orders@luvvencencia.com'}</p>
              <p className="text-gray-600 lv-body font-mono text-sm">{contactSettings?.emailPress || 'press@luvvencencia.com'}</p>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl lv-luxury font-bold text-primary">PHONE SUPPORT</h3>
            </div>
            <p className="text-gray-600 mb-6 lv-body">Speak directly with our customer service team</p>
            <div className="space-y-3">
              <p className="text-gray-600 lv-body font-mono text-sm">{contactSettings?.phoneUS || '+1 (555) 123-4567'}</p>
              <p className="text-gray-600 lv-body font-mono text-sm">{contactSettings?.phoneInternational || '+1 (555) 987-6543'}</p>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl lv-luxury font-bold text-primary">VISIT OUR STORE</h3>
            </div>
            <p className="text-gray-600 mb-6 lv-body">Experience our products in person</p>
            <div className="space-y-3">
              <p className="text-gray-600 lv-body font-mono text-sm">{contactSettings?.addressStreet || '123 Fashion Avenue'}</p>
              <p className="text-gray-600 lv-body font-mono text-sm">{contactSettings?.addressCity || 'New York, NY 10001'}</p>
              <p className="text-gray-600 lv-body font-mono text-sm">{contactSettings?.addressCountry || 'United States'}</p>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl lv-luxury font-bold text-primary">BUSINESS HOURS</h3>
            </div>
            <p className="text-gray-600 mb-6 lv-body">When we're available to help</p>
            <div className="space-y-3">
              {contactSettings?.businessHours ? (
                contactSettings.businessHours.split('\n').map((line: string, index: number) => (
                  <p key={index} className="text-gray-600 lv-body font-mono text-sm">{line}</p>
                ))
              ) : (
                <>
                  <p className="text-gray-600 lv-body font-mono text-sm">Monday - Friday: 9AM - 7PM EST</p>
                  <p className="text-gray-600 lv-body font-mono text-sm">Saturday: 10AM - 6PM EST</p>
                  <p className="text-gray-600 lv-body font-mono text-sm">Sunday: 12PM - 5PM EST</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="text-center mb-16">
          <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
            SEND US A MESSAGE
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
        </div>

        <div className="border-2 border-gray-200 rounded-3xl p-10 bg-white">
          <p className="text-gray-600 mb-8 lv-body text-center">
            Have a specific question? Fill out our contact form and we'll get back to you within 24 hours.
          </p>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
                  YOUR NAME <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter your full name"
                  className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
                  YOUR EMAIL <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
                SUBJECT <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter subject"
                className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
                YOUR MESSAGE <span className="text-red-500">*</span>
              </Label>
              <textarea
                placeholder="Tell us how we can help you..."
                rows={6}
                className="w-full lv-body text-gray-500 font-mono lv-transition border-2 border-gray-300 focus:border-gray-400 rounded-3xl px-4 py-3 bg-white placeholder:text-gray-400 resize-none focus:outline-none"
              />
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-12 py-3 text-xs lv-luxury font-bold rounded-full transition-all duration-300 hover:scale-105"
              >
                <Send className="w-4 h-4 mr-2" />
                SEND MESSAGE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}