
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CreditCard, Trash2, Shield } from 'lucide-react';
import { useState } from 'react';

export default function Wallet() {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'Visa',
      lastFour: '4242',
      expiryMonth: '12',
      expiryYear: '2025',
      holderName: 'John Doe',
      isDefault: true
    },
    {
      id: 2,
      type: 'Mastercard',
      lastFour: '8888',
      expiryMonth: '08',
      expiryYear: '2026',
      holderName: 'John Doe',
      isDefault: false
    }
  ]);

  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: '',
    type: ''
  });

  const getCardIcon = (type: string) => {
    const icons = {
      'Visa': '💳',
      'Mastercard': '💳',
      'American Express': '💳',
      'Discover': '💳'
    };
    return icons[type as keyof typeof icons] || '💳';
  };

  const handleAddCard = () => {
    if (newCard.cardNumber && newCard.expiryMonth && newCard.expiryYear && newCard.cvv && newCard.holderName) {
      // Determine card type based on first digit (simplified)
      let cardType = 'Visa';
      if (newCard.cardNumber.startsWith('5')) cardType = 'Mastercard';
      if (newCard.cardNumber.startsWith('3')) cardType = 'American Express';
      if (newCard.cardNumber.startsWith('6')) cardType = 'Discover';

      const card = {
        id: Date.now(),
        type: cardType,
        lastFour: newCard.cardNumber.slice(-4),
        expiryMonth: newCard.expiryMonth,
        expiryYear: newCard.expiryYear,
        holderName: newCard.holderName,
        isDefault: paymentMethods.length === 0
      };
      setPaymentMethods([...paymentMethods, card]);
      setNewCard({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        holderName: '',
        type: ''
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteCard = (id: number) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(paymentMethods.filter(card => card.id !== id));
    }
  };

  const setDefaultCard = (id: number) => {
    setPaymentMethods(paymentMethods.map(card => ({
      ...card,
      isDefault: card.id === id
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
              Wallet
            </h1>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Secure Payment Information</h3>
              <p className="text-sm text-blue-700">
                Your payment information is encrypted and secure. We never store your full card number or CVV.
              </p>
            </div>
          </div>
        </div>

        {/* Add Payment Method Form */}
        {showAddForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-black mb-6">Add Payment Method</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard(prev => ({ ...prev, cardNumber: e.target.value.replace(/\s/g, '') }))}
                  className="mt-2"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="expiry-month">Expiry Month</Label>
                  <Select
                    value={newCard.expiryMonth}
                    onValueChange={(value) => setNewCard(prev => ({ ...prev, expiryMonth: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = (i + 1).toString().padStart(2, '0');
                        return (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expiry-year">Expiry Year</Label>
                  <Select
                    value={newCard.expiryYear}
                    onValueChange={(value) => setNewCard(prev => ({ ...prev, expiryYear: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = (new Date().getFullYear() + i).toString();
                        return (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    maxLength={4}
                    value={newCard.cvv}
                    onChange={(e) => setNewCard(prev => ({ ...prev, cvv: e.target.value }))}
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="holder-name">Cardholder Name</Label>
                <Input
                  id="holder-name"
                  placeholder="John Doe"
                  value={newCard.holderName}
                  onChange={(e) => setNewCard(prev => ({ ...prev, holderName: e.target.value }))}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleAddCard} className="bg-black text-white hover:bg-gray-800">
                Add Payment Method
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

        {/* Payment Methods List */}
        <div className="space-y-4">
          {paymentMethods.map((card) => (
            <div key={card.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xl">
                    {getCardIcon(card.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-black">
                        {card.type} •••• {card.lastFour}
                      </h3>
                      {card.isDefault && (
                        <span className="bg-black text-white text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      Expires {card.expiryMonth}/{card.expiryYear} • {card.holderName}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDeleteCard(card.id)}
                    variant="ghost"
                    size="sm"
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {!card.isDefault && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => setDefaultCard(card.id)}
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
        {paymentMethods.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">No payment methods saved</h3>
            <p className="text-gray-600 mb-6">Add a payment method to make checkout faster and more secure.</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-black text-white hover:bg-gray-800"
            >
              Add Your First Payment Method
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
