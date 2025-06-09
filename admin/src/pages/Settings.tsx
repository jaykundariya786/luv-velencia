import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Save, 
  Upload, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  Percent,
  Settings2,
  ToggleLeft,
  ToggleRight,
  Crown,
  Package,
  Users,
  BarChart3,
  MessageSquare,
  Truck,
  Bell,
  Globe
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { toast } from 'react-hot-toast';

const settingsSchema = z.object({
  brandName: z.string().min(1, 'Brand name is required'),
  brandDescription: z.string().optional(),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(1, 'Phone number is required'),
  contactAddress: z.string().min(1, 'Address is required'),
  deliveryCharges: z.number().min(0, 'Delivery charges must be positive'),
  taxRate: z.number().min(0).max(100, 'Tax rate must be between 0-100'),
  currency: z.string().min(1, 'Currency is required'),
  minOrderAmount: z.number().min(0, 'Minimum order amount must be positive'),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface PluginModule {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  category: 'core' | 'advanced' | 'premium';
  requiredLicense?: 'basic' | 'pro' | 'enterprise';
}

const Settings: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('/api/placeholder/200/80');
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'pricing' | 'plugins'>('general');

  const [plugins, setPlugins] = useState<PluginModule[]>([
    {
      id: 'inventory',
      name: 'Inventory Management',
      description: 'Track stock levels and get low stock alerts',
      icon: Package,
      enabled: true,
      category: 'core',
    },
    {
      id: 'users',
      name: 'User Management',
      description: 'Manage customers and admin users',
      icon: Users,
      enabled: true,
      category: 'core',
    },
    {
      id: 'analytics',
      name: 'Sales Analytics',
      description: 'View detailed sales reports and analytics',
      icon: BarChart3,
      enabled: true,
      category: 'advanced',
      requiredLicense: 'pro',
    },
    {
      id: 'discounts',
      name: 'Discounts & Coupons',
      description: 'Create and manage promotional offers',
      icon: Percent,
      enabled: true,
      category: 'advanced',
    },
    {
      id: 'contact_messages',
      name: 'Contact Messages',
      description: 'Handle customer inquiries and feedback',
      icon: MessageSquare,
      enabled: true,
      category: 'core',
    },
    {
      id: 'delivery_tracking',
      name: 'Delivery Tracking',
      description: 'Track order shipments and deliveries',
      icon: Truck,
      enabled: true,
      category: 'advanced',
      requiredLicense: 'pro',
    },
    {
      id: 'notifications',
      name: 'Push Notifications',
      description: 'Send email and SMS notifications',
      icon: Bell,
      enabled: false,
      category: 'premium',
      requiredLicense: 'enterprise',
    },
    {
      id: 'multi_currency',
      name: 'Multi-Currency Support',
      description: 'Support multiple currencies and exchange rates',
      icon: Globe,
      enabled: true,
      category: 'premium',
      requiredLicense: 'enterprise',
    },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      brandName: 'LUV VELENCIA',
      brandDescription: 'Luxury fashion brand with timeless elegance',
      contactEmail: 'admin@luvvelencia.com',
      contactPhone: '+1 (555) 123-4567',
      contactAddress: '123 Fashion Avenue, New York, NY 10001',
      deliveryCharges: 15.00,
      taxRate: 8.5,
      currency: 'USD',
      minOrderAmount: 50.00,
    },
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo file size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogoPreview(e.target.result as string);
          toast.success('Logo uploaded successfully');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    try {
      // Mock API call - in real app, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Saving settings:', data);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlugin = (pluginId: string) => {
    setPlugins(prev => prev.map(plugin => 
      plugin.id === pluginId 
        ? { ...plugin, enabled: !plugin.enabled }
        : plugin
    ));

    const plugin = plugins.find(p => p.id === pluginId);
    toast.success(`${plugin?.name} ${plugin?.enabled ? 'disabled' : 'enabled'}`);
  };

  const canEnablePlugin = (plugin: PluginModule) => {
    // Mock license check - in real app, check actual subscription
    const currentLicense = 'enterprise'; // 'basic' | 'pro' | 'enterprise'

    if (!plugin.requiredLicense) return true;

    const licenseHierarchy = { basic: 1, pro: 2, enterprise: 3 };
    return licenseHierarchy[currentLicense] >= licenseHierarchy[plugin.requiredLicense];
  };

  const getCategoryColor = (category: PluginModule['category']) => {
    switch (category) {
      case 'core': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'contact', label: 'Contact Info', icon: Phone },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'plugins', label: 'Plugins', icon: Settings2 },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-admin-primary to-admin-sidebar rounded-lg flex items-center justify-center">
            <Settings2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold lv-heading bg-gradient-to-r from-admin-primary to-admin-sidebar bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-600 lv-body">Configure your store settings and manage plugins</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-admin-primary text-admin-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold lv-heading mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-admin-primary" />
                Brand Information
              </h3>

              {/* Logo Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Logo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={logoPreview}
                      alt="Brand Logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Logo</span>
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 5MB. Recommended: 400x160px
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name *
                  </label>
                  <input
                    {...register('brandName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary"
                  />
                  {errors.brandName && (
                    <p className="text-red-500 text-sm mt-1">{errors.brandName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency *
                  </label>
                  <select
                    {...register('currency')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Description
                </label>
                <textarea
                  {...register('brandDescription')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary"
                  placeholder="Describe your brand..."
                />
              </div>
            </Card>
          </div>
        )}

        {/* Contact Information */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold lv-heading mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-admin-primary" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Contact Email *
                  </label>
                  <input
                    {...register('contactEmail')}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary"
                  />
                  {errors.contactEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactEmail.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Contact Phone *
                  </label>
                  <input
                    {...register('contactPhone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary"
                  />
                  {errors.contactPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactPhone.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Business Address *
                </label>
                <textarea
                  {...register('contactAddress')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary"
                  placeholder="Enter your business address..."
                />
                {errors.contactAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactAddress.message}</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Pricing Configuration */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold lv-heading mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-admin-primary" />
                Pricing Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Charges *
                  </label>
                  <input
                    {...register('deliveryCharges', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary"
                  />
                  {errors.deliveryCharges && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryCharges.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Rate (%) *
                  </label>
                  <input
                    {...register('taxRate', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary"
                  />
                  {errors.taxRate && (
                    <p className="text-red-500 text-sm mt-1">{errors.taxRate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Order Amount *
                  </label>
                  <input
                    {...register('minOrderAmount', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-admin-primary"
                  />
                  {errors.minOrderAmount && (
                    <p className="text-red-500 text-sm mt-1">{errors.minOrderAmount.message}</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Plugin System */}
        {activeTab === 'plugins' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold lv-heading mb-4 flex items-center">
                <Settings2 className="w-5 h-5 mr-2 text-admin-primary" />
                Plugin Management
              </h3>
              <p className="text-gray-600 mb-6">
                Enable or disable features based on your needs and subscription level.
              </p>

              <div className="space-y-4">
                {plugins.map((plugin) => {
                  const Icon = plugin.icon;
                  const canEnable = canEnablePlugin(plugin);

                  return (
                    <div
                      key={plugin.id}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                        plugin.enabled 
                          ? 'border-green-200 bg-green-50' 
                          : canEnable 
                          ? 'border-gray-200 bg-white hover:bg-gray-50'
                          : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          plugin.enabled 
                            ? 'bg-green-500 text-white' 
                            : canEnable
                            ? 'bg-gray-200 text-gray-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{plugin.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(plugin.category)}`}>
                              {plugin.category}
                            </span>
                            {plugin.requiredLicense && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Crown className="w-3 h-3 inline mr-1" />
                                {plugin.requiredLicense}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{plugin.description}</p>
                          {!canEnable && (
                            <p className="text-xs text-red-600 mt-1">
                              Requires {plugin.requiredLicense} subscription
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => canEnable && togglePlugin(plugin.id)}
                        disabled={!canEnable}
                        className={`transition-colors ${
                          canEnable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                        }`}
                      >
                        {plugin.enabled ? (
                          <ToggleRight className="w-8 h-8 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-gray-400" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Save Button */}
        {activeTab !== 'plugins' && (
          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="admin-btn-primary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Settings;