
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, Edit, Trash2 } from 'lucide-react';
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
              Address Book
            </h1>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </div>

        {/* Add Address Form */}
        {showAddForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-black mb-6">Add New Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="address-type">Address Type</Label>
                <Select
                  value={newAddress.type}
                  onValueChange={(value) => setNewAddress(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-2"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  value={newAddress.country}
                  onValueChange={(value) => setNewAddress(prev => ({ ...prev, country: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
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
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleAddAddress} className="bg-black text-white hover:bg-gray-800">
                Save Address
              </Button>
              <Button
                onClick={() => setShowAddForm(false)}
                variant="outline"
                className="border-gray-300 text-gray-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Addresses List */}
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-black">{address.type}</h3>
                      {address.isDefault && (
                        <span className="bg-black text-white text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-black font-medium">{address.name}</p>
                    <p className="text-gray-600">{address.street}</p>
                    <p className="text-gray-600">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-gray-600">{address.country}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="p-2">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteAddress(address.id)}
                    variant="ghost"
                    size="sm"
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {!address.isDefault && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => setDefaultAddress(address.id)}
                    variant="outline"
                    size="sm"
                    className="border-black text-black hover:bg-gray-50"
                  >
                    Set as Default
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {addresses.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">No addresses saved</h3>
            <p className="text-gray-600 mb-6">Add an address to make checkout faster.</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-black text-white hover:bg-gray-800"
            >
              Add Your First Address
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
