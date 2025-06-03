
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Clock, MapPin, User, Phone } from 'lucide-react';
import { useState } from 'react';

export default function Appointments() {
  const navigate = useNavigate();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      type: 'Personal Shopping',
      date: '2025-02-15',
      time: '2:00 PM',
      location: 'Gucci Fifth Avenue, New York',
      stylist: 'Maria Rodriguez',
      status: 'Confirmed',
      notes: 'Looking for evening wear collection'
    },
    {
      id: 2,
      type: 'Product Consultation',
      date: '2025-01-28',
      time: '11:00 AM',
      location: 'Gucci SoHo, New York',
      stylist: 'Alessandro Chen',
      status: 'Completed',
      notes: 'Handbag consultation for spring collection'
    }
  ]);

  const [newAppointment, setNewAppointment] = useState({
    type: '',
    date: '',
    time: '',
    location: '',
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

  const handleBookAppointment = () => {
    if (newAppointment.type && newAppointment.date && newAppointment.time && newAppointment.location) {
      const appointment = {
        id: Date.now(),
        ...newAppointment,
        status: 'Pending',
        stylist: 'TBD'
      };
      setAppointments([appointment, ...appointments]);
      setNewAppointment({
        type: '',
        date: '',
        time: '',
        location: '',
        notes: ''
      });
      setShowBookingForm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/account')}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-light uppercase tracking-wider text-black">
              My Appointments
            </h1>
          </div>
          <Button
            onClick={() => setShowBookingForm(true)}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </div>

        {/* Book Appointment Form */}
        {showBookingForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-black mb-6">Book New Appointment</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="appointment-type">Service Type</Label>
                <Select
                  value={newAppointment.type}
                  onValueChange={(value) => setNewAppointment(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="mt-2">
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
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="time">Preferred Time</Label>
                  <Select
                    value={newAppointment.time}
                    onValueChange={(value) => setNewAppointment(prev => ({ ...prev, time: value }))}
                  >
                    <SelectTrigger className="mt-2">
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
                <Label htmlFor="location">Store Location</Label>
                <Select
                  value={newAppointment.location}
                  onValueChange={(value) => setNewAppointment(prev => ({ ...prev, location: value }))}
                >
                  <SelectTrigger className="mt-2">
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

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific requests or preferences..."
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                  className="mt-2"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button onClick={handleBookAppointment} className="bg-black text-white hover:bg-gray-800">
                Book Appointment
              </Button>
              <Button
                onClick={() => setShowBookingForm(false)}
                variant="outline"
                className="border-gray-300 text-gray-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Appointments List */}
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-black text-lg">{appointment.type}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(appointment.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{appointment.location}</span>
                    </div>
                    {appointment.stylist !== 'TBD' && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Stylist: {appointment.stylist}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {appointment.status === 'Confirmed' && (
                    <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
                      Reschedule
                    </Button>
                  )}
                  {appointment.status !== 'Completed' && (
                    <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
              
              {appointment.notes && (
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="text-sm text-gray-700">
                    <strong>Notes:</strong> {appointment.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {appointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">No appointments scheduled</h3>
            <p className="text-gray-600 mb-6">
              Book a personal shopping session or consultation with our experts.
            </p>
            <Button
              onClick={() => setShowBookingForm(true)}
              className="bg-black text-white hover:bg-gray-800"
            >
              Book Your First Appointment
            </Button>
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="font-medium text-black mb-4">Need Help?</h3>
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>Call us at +1 (877) 482-2430</span>
            </div>
            <span className="hidden sm:block">•</span>
            <span>Monday - Saturday: 9 AM - 11 PM (EST)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
