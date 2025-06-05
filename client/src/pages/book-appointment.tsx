
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BookAppointment() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [appointmentData, setAppointmentData] = useState({
    type: '',
    date: '',
    time: '',
    location: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });

  const appointmentTypes = [
    'Personal Shopping',
    'Product Consultation',
    'Styling Session',
    'Private Viewing',
    'Repair Service',
    'Custom Orders'
  ];

  const locations = [
    'Gucci Fifth Avenue, New York',
    'Gucci SoHo, New York',
    'Gucci Rodeo Drive, Beverly Hills',
    'Gucci Michigan Avenue, Chicago',
    'Gucci Union Square, San Francisco'
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleInputChange = (field: string, value: string) => {
    setAppointmentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const required = ['type', 'date', 'time', 'location', 'firstName', 'lastName', 'email', 'phone'];
    const missing = required.filter(field => !appointmentData[field as keyof typeof appointmentData]);
    
    if (missing.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields."
      });
      return;
    }

    // Simulate booking
    setIsSubmitted(true);
    
    toast({
      title: "Appointment Requested",
      description: "We'll contact you within 24 hours to confirm your appointment."
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative h-[300px] bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop')"
        }}>
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <h1 className="text-4xl md:text-5xl font-light text-white uppercase tracking-[0.3em]">
              APPOINTMENT REQUESTED
            </h1>
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black rotate-45 flex items-center justify-center">
            <span className="text-white text-lg font-bold transform -rotate-45">G</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-light text-black mb-4 uppercase tracking-wider">
            Thank You for Your Request
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            We have received your appointment request for <strong>{appointmentData.type}</strong> on{' '}
            <strong>{new Date(appointmentData.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</strong> at <strong>{appointmentData.time}</strong>.
          </p>
          
          <p className="text-gray-600 mb-8">
            Our team will contact you at <strong>{appointmentData.phone}</strong> within 24 hours to confirm 
            your appointment details and answer any questions you may have.
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={() => navigate('/account/appointments')}
              className="bg-black text-white hover:bg-gray-800 px-8 py-3"
            >
              View My Appointments
            </Button>
            
            <div>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-black text-black hover:bg-gray-50 px-8 py-3"
              >
                Return Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[300px] bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop')"
      }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-4xl md:text-5xl font-light text-white uppercase tracking-[0.3em]">
            BOOK APPOINTMENT
          </h1>
        </div>
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black rotate-45 flex items-center justify-center">
          <span className="text-white text-lg font-bold transform -rotate-45">G</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          size="sm"
          className="mb-8 p-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Service Information */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-xl font-medium text-black mb-6 uppercase tracking-wider">
              Service Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="appointment-type" className="text-sm font-medium uppercase tracking-wider">
                  Service Type *
                </Label>
                <Select
                  value={appointmentData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="date" className="text-sm font-medium uppercase tracking-wider">
                    Preferred Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={appointmentData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="mt-2 h-12"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <Label htmlFor="time" className="text-sm font-medium uppercase tracking-wider">
                    Preferred Time *
                  </Label>
                  <Select
                    value={appointmentData.time}
                    onValueChange={(value) => handleInputChange('time', value)}
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="location" className="text-sm font-medium uppercase tracking-wider">
                  Store Location *
                </Label>
                <Select
                  value={appointmentData.location}
                  onValueChange={(value) => handleInputChange('location', value)}
                >
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder="Select store location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-xl font-medium text-black mb-6 uppercase tracking-wider">
              Personal Information
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium uppercase tracking-wider">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={appointmentData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="mt-2 h-12"
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium uppercase tracking-wider">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={appointmentData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="mt-2 h-12"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium uppercase tracking-wider">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={appointmentData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-2 h-12"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium uppercase tracking-wider">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={appointmentData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-2 h-12"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-xl font-medium text-black mb-6 uppercase tracking-wider">
              Additional Information
            </h2>
            
            <div>
              <Label htmlFor="notes" className="text-sm font-medium uppercase tracking-wider">
                Special Requests or Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Any specific requests, preferences, or questions you'd like to share..."
                value={appointmentData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="mt-2 min-h-[120px]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-8">
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800 px-12 py-4 text-lg uppercase tracking-wider"
            >
              Request Appointment
            </Button>
          </div>
        </form>

        {/* Contact Information */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-black mb-4 uppercase tracking-wider">
            Need Assistance?
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>+1 (877) 482-2430</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Monday - Saturday: 9 AM - 11 PM (EST)</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Our personal shopping experts are here to help you find exactly what you're looking for.
          </p>
        </div>
      </div>
    </div>
  );
}
