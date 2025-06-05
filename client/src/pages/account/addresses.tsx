
import { useAppSelector } from '@/hooks/redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, Edit, Trash2, X } from 'lucide-react';
import { useState } from 'react';

export default function Addresses() {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true
    },
    {
      id: 2,
      type: 'Work',
      name: 'John Doe',
      street: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States',
      isDefault: false
    }
  ]);

  const [newAddress, setNewAddress] = useState({
    type: '',
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const handleAddAddress = () => {
    if (newAddress.name && newAddress.street && newAddress.city) {
      const address = {
        id: Date.now(),
        ...newAddress,
        isDefault: addresses.length === 0
      };
      setAddresses([...addresses, address]);
      setNewAddress({
        type: '',
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteAddress = (id: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const setDefaultAddress = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[300px] bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop')"
      }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-4xl md:text-5xl font-light text-white uppercase tracking-[0.3em]">
            ADDRESS BOOK
          </h1>
        </div>
        {/* Diamond Logo */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black rotate-45 flex items-center justify-center">
          <span className="text-white text-lg font-bold transform -rotate-45">G</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/account')}
          variant="ghost"
          size="sm"
          className="mb-8 p-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Add Address Section */}
        {addresses.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-white border border-gray-300 text-black hover:bg-gray-50 px-8 py-3 mb-6 uppercase tracking-wider text-sm font-medium"
              >
                Add New Address
              </Button>
              <p className="text-gray-600 text-sm leading-relaxed">
                Check out faster with<br />
                saved addresses.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Add New Address Button */}
            <div className="text-center mb-12">
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-white border border-gray-300 text-black hover:bg-gray-50 px-8 py-3 mb-4 uppercase tracking-wider text-sm font-medium"
              >
                Add New Address
              </Button>
              <p className="text-gray-600 text-sm">
                Check out faster with saved addresses.
              </p>
            </div>

            {/* Addresses List */}
            <div className="space-y-6">
              {addresses.map((address) => (
                <div key={address.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gray-50 rounded-full">
                          <MapPin className="w-5 h-5 text-gray-700" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-black uppercase tracking-wider">{address.type}</h3>
                            {address.isDefault && (
                              <span className="bg-black text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider font-medium">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-full">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteAddress(address.id)}
                          variant="ghost"
                          size="sm"
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="ml-16 space-y-1">
                      <p className="text-black font-semibold text-base">{address.name}</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{address.street}</p>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className="text-gray-600 text-sm">{address.country}</p>
                    </div>
                    
                    {!address.isDefault && (
                      <div className="mt-6 ml-16">
                        <Button
                          onClick={() => setDefaultAddress(address.id)}
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-4 py-2 text-sm uppercase tracking-wider font-medium"
                        >
                          Set as Default
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Add Address Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-[580px] max-w-[90%] max-h-[90vh] bg-white overflow-hidden">
              <div className="p-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-light uppercase tracking-[0.3em] text-black">
                    NEW ADDRESS
                  </h2>
                  <Button
                    onClick={() => setShowAddForm(false)}
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </Button>
                </div>

                {/* Small diamond separator */}
                <div className="flex justify-center mb-8">
                  <div className="w-2 h-2 bg-gray-300 rotate-45"></div>
                </div>

                <div className="space-y-8">
                  <div>
                    <Label htmlFor="country" className="text-xs font-normal text-black uppercase tracking-[0.1em] mb-3 block">
                      COUNTRY, REGION
                    </Label>
                    <Select
                      value={newAddress.country}
                      onValueChange={(value) => setNewAddress(prev => ({ ...prev, country: value }))}
                    >
                      <SelectTrigger className="h-12 border-gray-200 border-t-0 border-l-0 border-r-0 border-b-2 rounded-none px-0 focus:border-black focus:ring-0 bg-transparent">
                        <SelectValue placeholder="United States" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Italy">Italy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Label htmlFor="first-name" className="text-xs font-normal text-black uppercase tracking-[0.1em] mb-3 block">
                        FIRST NAME
                      </Label>
                      <Input
                        id="first-name"
                        value={newAddress.name.split(' ')[0] || ''}
                        onChange={(e) => {
                          const lastName = newAddress.name.split(' ').slice(1).join(' ');
                          setNewAddress(prev => ({ ...prev, name: `${e.target.value} ${lastName}`.trim() }));
                        }}
                        className="h-12 border-gray-200 border-t-0 border-l-0 border-r-0 border-b-2 rounded-none px-0 focus:border-black focus:ring-0 bg-transparent"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last-name" className="text-xs font-normal text-black uppercase tracking-[0.1em] mb-3 block">
                        LAST NAME
                      </Label>
                      <Input
                        id="last-name"
                        value={newAddress.name.split(' ').slice(1).join(' ') || ''}
                        onChange={(e) => {
                          const firstName = newAddress.name.split(' ')[0] || '';
                          setNewAddress(prev => ({ ...prev, name: `${firstName} ${e.target.value}`.trim() }));
                        }}
                        className="h-12 border-gray-200 border-t-0 border-l-0 border-r-0 border-b-2 rounded-none px-0 focus:border-black focus:ring-0 bg-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address-line-1" className="text-xs font-normal text-black uppercase tracking-[0.1em] mb-3 block">
                      ADDRESS LINE 1
                    </Label>
                    <Input
                      id="address-line-1"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                      className="h-12 border-gray-200 border-t-0 border-l-0 border-r-0 border-b-2 rounded-none px-0 focus:border-black focus:ring-0 bg-transparent"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address-line-2" className="text-xs font-normal text-black uppercase tracking-[0.1em] mb-3 block">
                      ADDRESS LINE 2
                    </Label>
                    <Input
                      id="address-line-2"
                      className="h-12 border-gray-200 border-t-0 border-l-0 border-r-0 border-b-2 rounded-none px-0 focus:border-black focus:ring-0 bg-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="city" className="text-xs font-normal text-black uppercase tracking-[0.1em] mb-3 block">
                        CITY
                      </Label>
                      <Input
                        id="city"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                        className="h-12 border-gray-200 border-t-0 border-l-0 border-r-0 border-b-2 rounded-none px-0 focus:border-black focus:ring-0 bg-transparent"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-xs font-normal text-black uppercase tracking-[0.1em] mb-3 block">
                        STATE
                      </Label>
                      <Select
                        value={newAddress.state}
                        onValueChange={(value) => setNewAddress(prev => ({ ...prev, state: value }))}
                      >
                        <SelectTrigger className="h-12 border-gray-200 border-t-0 border-l-0 border-r-0 border-b-2 rounded-none px-0 focus:border-black focus:ring-0 bg-transparent">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zip" className="text-xs font-normal text-black uppercase tracking-[0.1em] mb-3 block">
                        ZIP CODE
                      </Label>
                      <Input
                        id="zip"
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                        className="h-12 border-gray-200 border-t-0 border-l-0 border-r-0 border-b-2 rounded-none px-0 focus:border-black focus:ring-0 bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <input 
                        type="checkbox" 
                        id="primary-shipping"
                        className="w-4 h-4 border-gray-300 mt-0.5"
                      />
                      <Label htmlFor="primary-shipping" className="text-sm text-black leading-relaxed">
                        Make this my primary shipping address.
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <input 
                        type="checkbox" 
                        id="business-address"
                        className="w-4 h-4 border-gray-300 mt-0.5"
                      />
                      <Label htmlFor="business-address" className="text-sm text-black leading-relaxed">
                        This is a business address.
                      </Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-xs font-normal text-black uppercase tracking-[0.1em] mb-3 block">
                      CONTACT PHONE NUMBER
                    </Label>
                    <div className="flex gap-4">
                      <Select defaultValue="+1">
                        <SelectTrigger className="w-44 h-12 border-gray-200 border-t-0 border-l-0 border-r-0 border-b-2 rounded-none px-0 focus:border-black focus:ring-0 bg-transparent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+1">+1 United States</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        className="flex-1 h-12 border-gray-200 border-t-0 border-l-0 border-r-0 border-b-2 rounded-none px-0 focus:border-black focus:ring-0 bg-transparent"
                      />
                    </div>
                    <div className="flex items-start space-x-3 mt-4">
                      <input 
                        type="checkbox" 
                        id="additional-contact"
                        className="w-4 h-4 border-gray-300 mt-0.5"
                      />
                      <Label htmlFor="additional-contact" className="text-sm text-black leading-relaxed">
                        Add additional contact number.
                      </Label>
                    </div>
                  </div>

                  <div className="pt-8">
                    <Button 
                      onClick={handleAddAddress}
                      className="w-full bg-black text-white hover:bg-gray-800 h-12 uppercase tracking-[0.2em] text-sm font-light"
                    >
                      SAVE
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
