
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Check, Shield, AlertCircle } from 'lucide-react';
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
      <div className="min-h-screen bg-white font-['Helvetica_Neue',Arial,sans-serif]">
        {/* Hero Section */}
        <div className="relative h-[400px] bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
        }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl lv-luxury text-primary lv-fade-in tracking-[0.2em] drop-shadow-2xl">
                APPOINTMENT REQUESTED
              </h1>
            </div>
          </div>
          
          {/* Diamond Logo */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rotate-45 flex items-center justify-center">
            <span className="text-white text-lg font-bold transform -rotate-45">G</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
              Thank You for Your Request
            </h2>
            <div className="w-16 h-px bg-black mx-auto mb-12"></div>
            
            <p className="lv-body text-gray-500 font-mono lv-transition mb-8 leading-relaxed text-base">
              We have received your appointment request for <strong>{appointmentData.type}</strong> on{' '}
              <strong>{new Date(appointmentData.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</strong> at <strong>{appointmentData.time}</strong>.
            </p>
            
            <p className="lv-body text-gray-500 font-mono lv-transition mb-12">
              Our team will contact you at <strong>{appointmentData.phone}</strong> within 24 hours to confirm 
              your appointment details and answer any questions you may have.
            </p>
            
            <div className="space-y-6">
              <Button
                onClick={() => navigate('/account/appointments')}
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-12 py-6 text-xs lv-luxury font-bold rounded-full transition-all duration-300"
              >
                View My Appointments
              </Button>
              
              <div>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 px-12 py-6 text-xs lv-luxury font-bold rounded-full transition-all duration-300"
                >
                  Return Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
      }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lv-luxury text-primary lv-fade-in tracking-[0.2em] drop-shadow-2xl">
              BOOK APPOINTMENT
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
          <span className="text-white text-lg font-bold transform -rotate-45">G</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Service Information Section */}
          <div className="text-center mb-16">
            <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
              SERVICE INFORMATION
            </h2>
            <div className="w-16 h-px bg-black mx-auto mb-12"></div>
          </div>

          <div className="border-2 rounded-3xl border-gray-200 p-8 mb-12 bg-white">
            <div className="space-y-8">
              <div>
                <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
                  SERVICE TYPE <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={appointmentData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-3xl">
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
                    PREFERRED DATE <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={appointmentData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
                    PREFERRED TIME <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={appointmentData.time}
                    onValueChange={(value) => handleInputChange('time', value)}
                  >
                    <SelectTrigger className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-3xl">
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
                <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
                  STORE LOCATION <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={appointmentData.location}
                  onValueChange={(value) => handleInputChange('location', value)}
                >
                  <SelectTrigger className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400">
                    <SelectValue placeholder="Select store location" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-3xl">
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

          {/* Personal Information Section */}
          <div className="text-center mb-16">
            <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
              PERSONAL INFORMATION
            </h2>
            <div className="w-16 h-px bg-black mx-auto mb-12"></div>
          </div>

          <div className="border-2 rounded-3xl border-gray-200 p-8 mb-12 bg-white">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
                    FIRST NAME <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={appointmentData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400"
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div>
                  <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
                    LAST NAME <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={appointmentData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
                    EMAIL ADDRESS <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={appointmentData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
                    PHONE NUMBER <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="tel"
                    value={appointmentData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="text-center mb-16">
            <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
              ADDITIONAL INFORMATION
            </h2>
            <div className="w-16 h-px bg-black mx-auto mb-12"></div>
          </div>

          <div className="border-2 rounded-3xl border-gray-200 p-8 mb-12 bg-white">
            <div>
              <Label className="lv-luxury text-md font-bold text-primary text-sm mb-4 block">
                SPECIAL REQUESTS OR NOTES
              </Label>
              <Textarea
                placeholder="Any specific requests, preferences, or questions you'd like to share..."
                value={appointmentData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="lv-body text-gray-500 font-mono lv-transition min-h-[120px] border-2 border-gray-300 focus:border-gray-400 rounded-3xl px-4 bg-white placeholder:text-gray-400 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <Button
              type="submit"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-12 py-6 text-xs lv-luxury font-bold rounded-full transition-all duration-300"
            >
              Request Appointment
            </Button>
          </div>
        </form>

        {/* Enhanced Contact Information */}
        <div className="mt-16 relative overflow-hidden">
          {/* Background with subtle pattern */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
          
          <div className="relative border-2 rounded-3xl border-blue-200 p-10">
            <div className="md:flex lg:flex grid grid-cols-1 items-start gap-8">
              {/* Enhanced Phone Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Phone className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="mb-6">
                  <h3 className="text-2xl lv-luxury text-md font-bold text-primary mb-2">
                    NEED ASSISTANCE?
                  </h3>
                  <div className="w-12 h-px bg-blue-600"></div>
                </div>
                
                <p className="lv-body text-gray-500 font-mono text-sm lv-transition mb-6">
                  Our personal shopping experts are available to help you find exactly what you're looking for. 
                  Contact us for immediate assistance or questions about your appointment.
                </p>
                
                {/* Contact Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="lv-body text-gray-500 font-mono text-sm lv-transition">+1 (877) 482-2430</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="lv-body text-gray-500 font-mono text-sm lv-transition">MON - SAT: 9AM - 11PM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="lv-body text-gray-500 font-mono text-sm lv-transition">EXPERT CONSULTATION</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative corner elements */}
            <div className="absolute top-4 rounded-lg right-4 w-8 h-8 border-t-2 border-r-2 border-blue-300 opacity-30"></div>
            <div className="absolute bottom-4 rounded-lg left-4 w-8 h-8 border-b-2 border-l-2 border-blue-300 opacity-30"></div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 border-2 rounded-3xl border-gray-200 p-6 bg-gray-50">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="lv-body text-gray-500 font-mono text-sm lv-transition">
                By submitting this appointment request, you agree to our privacy policy and terms of service. 
                Your personal information will be used solely for appointment scheduling and client services. 
                We will never share your information with third parties without your explicit consent. For 
                questions about data handling, please contact us at{" "}
                <a
                  href="mailto:privacy@gucci.com"
                  className="text-black hover:underline font-medium transition-all"
                >
                  privacy@gucci.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
