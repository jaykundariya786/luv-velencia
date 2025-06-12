
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../lib/use-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { Mail, Phone, MapPin, Clock, Save } from 'lucide-react';

interface ContactInfo {
  id?: number;
  title: string;
  subtitle: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  hours: string;
  mapUrl?: string;
}

const ContactSettings: React.FC = () => {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    title: 'GET IN TOUCH',
    subtitle: 'We\'d love to hear from you',
    description: 'Have a question about our products or services? Need styling advice? Our team is here to help.',
    email: 'hello@luvvencencia.com',
    phone: '+1 (555) 123-4567',
    address: '123 Fashion Street, Style City, SC 12345',
    hours: 'Monday - Friday: 9AM - 6PM\nSaturday: 10AM - 4PM\nSunday: Closed',
    mapUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/admin/contact-settings');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setContactInfo(data);
        }
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/contact-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactInfo),
      });

      if (!response.ok) throw new Error('Failed to save contact settings');

      toast({ title: "Success", description: "Contact settings saved successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save contact settings" });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold lv-heading">Contact Page Settings</h1>
        <p className="text-gray-600 lv-body mt-2">
          Manage contact information displayed on the contact page
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Page Header
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={contactInfo.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Main page title"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={contactInfo.subtitle}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                placeholder="Page subtitle"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={contactInfo.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={contactInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={contactInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Full address"
              />
            </div>
            <div>
              <Label htmlFor="hours">Business Hours</Label>
              <Textarea
                id="hours"
                value={contactInfo.hours}
                onChange={(e) => handleInputChange('hours', e.target.value)}
                placeholder="Business hours (one per line)"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="mapUrl">Map URL (Optional)</Label>
              <Input
                id="mapUrl"
                value={contactInfo.mapUrl || ''}
                onChange={(e) => handleInputChange('mapUrl', e.target.value)}
                placeholder="Google Maps embed URL"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="min-w-32">
            {saving ? (
              <>Loading...</>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactSettings;
