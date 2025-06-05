
import { useAppSelector } from '@/hooks/redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function AccountSettings() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    twoFactorAuth: false,
    privateAccount: false
  });

  const handleSave = () => {
    console.log('Saving settings:', settings);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-cover bg-center overflow-hidden" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
      }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <Button
              onClick={() => navigate('/account')}
              variant="ghost"
              size="sm"
              className="absolute top-8 left-8 text-white hover:bg-white/20 p-3 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-6xl font-light tracking-[0.3em] mb-8 lv-luxury">
              ACCOUNT SETTINGS
            </h1>
            <div className="w-16 h-16 mx-auto border-2 border-white transform rotate-45 flex items-center justify-center">
              <span className="text-3xl font-serif transform -rotate-45 font-bold">G</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Personal Details Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-light tracking-[0.2em] mb-12 text-black lv-luxury">
            MY PERSONAL DETAILS
          </h2>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm uppercase tracking-[0.15em] text-gray-500 font-medium">
                  TITLE*
                </Label>
                <select 
                  id="title"
                  className="w-full px-0 py-4 border-0 border-b-2 border-gray-200 bg-transparent focus:border-black focus:outline-none text-base font-medium transition-colors duration-300"
                >
                  <option>Mr.</option>
                  <option>Ms.</option>
                  <option>Mrs.</option>
                  <option>Dr.</option>
                </select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="firstName" className="text-sm uppercase tracking-[0.15em] text-gray-500 font-medium">
                  FIRST NAME*
                </Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  defaultValue={user?.name?.split(' ')[0] || ''}
                  className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-4 focus:border-black focus:ring-0 bg-transparent text-base font-medium transition-colors duration-300"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="lastName" className="text-sm uppercase tracking-[0.15em] text-gray-500 font-medium">
                  LAST NAME*
                </Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  defaultValue={user?.name?.split(' ')[1] || ''}
                  className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-4 focus:border-black focus:ring-0 bg-transparent text-base font-medium transition-colors duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-3">
                <Label htmlFor="country" className="text-sm uppercase tracking-[0.15em] text-gray-500 font-medium">
                  COUNTRY / REGION*
                </Label>
                <select 
                  id="country"
                  className="w-full px-0 py-4 border-0 border-b-2 border-gray-200 bg-transparent focus:border-black focus:outline-none text-base font-medium transition-colors duration-300"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>France</option>
                  <option>Italy</option>
                </select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="birthdate" className="text-sm uppercase tracking-[0.15em] text-gray-500 font-medium">
                  DATE OF BIRTH*
                </Label>
                <Input
                  id="birthdate"
                  type="date"
                  placeholder="2/5/1997"
                  className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-4 focus:border-black focus:ring-0 bg-transparent text-base font-medium transition-colors duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Credentials Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-light tracking-[0.2em] mb-12 text-black lv-luxury">
            MY CREDENTIALS
          </h2>

          <div className="max-w-lg">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm uppercase tracking-[0.15em] text-gray-500 font-medium">
                EMAIL*
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                defaultValue={user?.email || 'kthagith09@bestbait.com'}
                className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-4 focus:border-black focus:ring-0 bg-transparent text-base font-medium transition-colors duration-300"
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="mb-20">
          <h2 className="text-3xl font-light tracking-[0.2em] mb-12 text-black lv-luxury">
            PRIVACY SETTINGS
          </h2>

          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="flex items-start space-x-4">
              <input 
                type="checkbox" 
                id="privacy-consent"
                defaultChecked
                className="mt-2 w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-black accent-black"
              />
              <div className="flex-1 space-y-4">
                <Label htmlFor="privacy-consent" className="cursor-pointer text-base leading-relaxed text-gray-800 font-medium">
                  I would like to receive updates about GUCCI new activities, exclusive products, tailored services and to have a personalised client experience based on my interests.
                </Label>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Privacy laws may grant you certain rights such as the right to access, delete, modify and rectify your data, or to restrict or object to processing, as well as the right to data portability. You can also lodge a complaint with your competent regulator. You can withdraw your consent or delete your profile at any time. For further information regarding our privacy practices and your rights, please contact us at{' '}
                  <a href="mailto:privacy@gucci.com" className="underline hover:text-black transition-colors font-medium">
                    privacy@gucci.com
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-200">
          <Button
            onClick={handleDeleteAccount}
            variant="outline"
            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 uppercase tracking-[0.1em] text-sm px-10 py-4 font-medium transition-all duration-300"
          >
            Deactivate Account
          </Button>

          <Button
            onClick={handleSave}
            className="bg-black text-white hover:bg-gray-800 uppercase tracking-[0.1em] text-sm px-12 py-4 font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            SAVE CHANGES
          </Button>
        </div>
      </div>
    </div>
  );
}
