import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/redux";
import { getUserProfile, updateUserProfile } from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AccountSettings() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    title: "",
    firstName: "",
    lastName: "",
    country: "",
    dateOfBirth: "",
    email: "",
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    twoFactorAuth: false,
    privateAccount: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.id) return;
        
        const profileData = await getUserProfile(user.id);
        setProfile({
          title: profileData.title || "",
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          country: profileData.country || "",
          dateOfBirth: profileData.dateOfBirth || "",
          email: profileData.email || "",
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (!user?.id) {
        console.error("User ID not available");
        return;
      }
      
      await updateUserProfile(user.id, profile);
      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      navigate("/");
    }
  };

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
              SETTINGS
            </h1>
          </div>
        </div>

        {/* Back Button */}
        <Button
          onClick={() => navigate("/account")}
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
        {/* Personal Details Section */}
        <div className="text-center mb-16">
          <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
            MY PERSONAL DETAILS
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
        </div>

        <div className="border-2 rounded-3xl border-gray-200 p-8 mb-12 bg-white">
          <div className="space-y-8">
            {/* Title */}
            <div>
              <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
                TITLE <span className="text-red-500">*</span>
              </Label>
              <Select
                value={profile.title}
                onValueChange={(value) =>
                  handleInputChange({ target: { name: "title", value } })
                }
              >
                <SelectTrigger className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400 max-w-md">
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-3xl">
                  <SelectItem value="Mr.">Mr.</SelectItem>
                  <SelectItem value="Ms.">Ms.</SelectItem>
                  <SelectItem value="Mrs.">Mrs.</SelectItem>
                  <SelectItem value="Dr.">Dr.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
                  FIRST NAME <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleInputChange}
                  className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400 max-w-md"
                />
              </div>
              <div>
                <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
                  LAST NAME <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleInputChange}
                  className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400 max-w-md"
                />
              </div>
            </div>

            {/* Country and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
                  COUNTRY / REGION <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={profile.country}
                  onValueChange={(value) =>
                    handleInputChange({ target: { name: "country", value } })
                  }
                >
                  <SelectTrigger className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400 max-w-md">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-3xl">
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">
                      United Kingdom
                    </SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Italy">Italy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
                  DATE OF BIRTH <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  name="dateOfBirth"
                  value={profile.dateOfBirth}
                  onChange={handleInputChange}
                  className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400 max-w-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Credentials Section */}
        <div className="text-center mb-16">
          <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
            MY CREDENTIALS
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
        </div>

        <div className="border-2 border-gray-200 rounded-3xl p-8 mb-12 bg-white">
          <div>
            <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
              EMAIL <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              disabled
              name="email"
              value={profile.email}
              className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400 max-w-md"
            />
          </div>
        </div>

        {/* Privacy Settings Section */}
        <div className="text-center mb-16">
          <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
            PRIVACY SETTINGS
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
        </div>

        <div className="border-2 border-gray-200 p-8 mb-12 rounded-3xl bg-white">
          <div className="space-y-8">
            {/* Marketing Communications */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-5 h-5 border-2 border-black rounded-sm flex items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                  <Check className="w-3 h-3 text-black" />
                </div>
              </div>
              <div className="flex-1">
                <p className="lv-body text-gray-700 text-xs font-mono lv-transition">
                  I would like to receive updates about GUCCI new activities,
                  exclusive products, tailored services and to have a
                  personalised client experience based on my interests.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 pt-8">
          <Button
            onClick={handleDeleteAccount}
            variant="outline"
            className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-12 py-6 text-xs lv-luxury font-bold rounded-full transition-all duration-300"
          >
            Deactivate Account
          </Button>

          <Button
            onClick={handleSave}
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-12 py-6 text-xs lv-luxury font-bold rounded-full transition-all duration-300"
          >
            Save Changes
          </Button>
        </div>

        {/* Enhanced Security Notice */}
        <div className="mt-16 relative">
          {/* Background with subtle pattern */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"></div>
          <div className="relative border-2 rounded-3xl border-emerald-200 p-10">
            <div className="md:flex lg:flex grid grid-cols-1 items-start gap-8">
              {/* Enhanced Shield Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-6">
                  <h3 className="text-2xl lv-luxury text-md font-bold text-primary mb-2">
                    SECURE ACCOUNT
                  </h3>
                  <div className="w-12 h-px bg-emerald-600"></div>
                </div>

                <p className="lv-body text-gray-500 font-mono text-sm lv-transition mb-6">
                  Your personal information is protected with bank-level
                  encryption. We follow strict privacy guidelines and never
                  share your data without your explicit consent.
                </p>

                {/* Security Features */}
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

            {/* Decorative corner elements */}
            <div className="absolute top-4 rounded-lg right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-300 opacity-30"></div>
            <div className="absolute bottom-4 rounded-lg left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-300 opacity-30"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
