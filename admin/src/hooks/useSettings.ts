
import { useState, useEffect } from 'react';

interface PluginModule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'core' | 'advanced' | 'premium';
  requiredLicense?: 'basic' | 'pro' | 'enterprise';
}

interface AppSettings {
  brandName: string;
  brandLogo: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  deliveryCharges: number;
  taxRate: number;
  currency: string;
  minOrderAmount: number;
  plugins: PluginModule[];
}

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load settings from localStorage or API
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('admin_settings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        } else {
          // Default settings
          setSettings({
            brandName: 'LUV VELENCIA',
            brandLogo: '/api/placeholder/200/80',
            contactEmail: 'admin@luvvelencia.com',
            contactPhone: '+1 (555) 123-4567',
            contactAddress: '123 Fashion Avenue, New York, NY 10001',
            deliveryCharges: 15.00,
            taxRate: 8.5,
            currency: 'USD',
            minOrderAmount: 50.00,
            plugins: [
              { id: 'inventory', name: 'Inventory Management', description: 'Track stock levels', enabled: true, category: 'core' },
              { id: 'users', name: 'User Management', description: 'Manage customers', enabled: true, category: 'core' },
              { id: 'analytics', name: 'Sales Analytics', description: 'View reports', enabled: true, category: 'advanced', requiredLicense: 'pro' },
              { id: 'discounts', name: 'Discounts & Coupons', description: 'Manage offers', enabled: true, category: 'advanced' },
              { id: 'contact_messages', name: 'Contact Messages', description: 'Handle inquiries', enabled: true, category: 'core' },
              { id: 'delivery_tracking', name: 'Delivery Tracking', description: 'Track shipments', enabled: true, category: 'advanced', requiredLicense: 'pro' },
              { id: 'notifications', name: 'Push Notifications', description: 'Send notifications', enabled: false, category: 'premium', requiredLicense: 'enterprise' },
              { id: 'multi_currency', name: 'Multi-Currency Support', description: 'Multiple currencies', enabled: true, category: 'premium', requiredLicense: 'enterprise' },
            ],
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    if (settings) {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      localStorage.setItem('admin_settings', JSON.stringify(updatedSettings));
    }
  };

  const togglePlugin = (pluginId: string) => {
    if (settings) {
      const updatedPlugins = settings.plugins.map(plugin =>
        plugin.id === pluginId ? { ...plugin, enabled: !plugin.enabled } : plugin
      );
      updateSettings({ plugins: updatedPlugins });
    }
  };

  const isPluginEnabled = (pluginId: string): boolean => {
    if (!settings) return false;
    const plugin = settings.plugins.find(p => p.id === pluginId);
    return plugin?.enabled || false;
  };

  const hasRequiredLicense = (requiredLicense?: string): boolean => {
    // Mock license check - in real app, check actual subscription
    const currentLicense = 'enterprise'; // 'basic' | 'pro' | 'enterprise'
    
    if (!requiredLicense) return true;
    
    const licenseHierarchy: Record<string, number> = { basic: 1, pro: 2, enterprise: 3 };
    return licenseHierarchy[currentLicense] >= licenseHierarchy[requiredLicense];
  };

  return {
    settings,
    loading,
    updateSettings,
    togglePlugin,
    isPluginEnabled,
    hasRequiredLicense,
  };
};
