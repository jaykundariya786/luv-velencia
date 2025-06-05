
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CreditCard, Trash2, Shield, Lock, Check, X } from 'lucide-react';
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
      {/* Hero Section */}
      <div className="relative h-[400px] bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')"
      }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-light text-white uppercase tracking-[0.4em] mb-8">
              WALLET
            </h1>
          </div>
        </div>
        
        {/* Back Button */}
        <Button
          onClick={() => navigate('/account')}
          variant="ghost"
          size="sm"
          className="absolute top-8 left-8 text-white hover:bg-white/20 p-3 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Diamond Logo */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black rotate-45 flex items-center justify-center">
          <span className="text-white text-lg font-bold transform -rotate-45">G</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Payment Cards Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light uppercase tracking-[0.3em] text-black mb-4">
            PAYMENT CARDS
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
        </div>

        {/* Add Card Section */}
        {paymentMethods.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="w-24 h-16 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-6">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-black mb-4 uppercase tracking-wider">
                Add Card
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Check out faster with saved cards.
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-black text-white hover:bg-gray-800 px-12 py-4 text-sm uppercase tracking-wider font-medium"
              >
                Add Payment Method
              </Button>
            </div>
          </div>
        )}

        {/* Add Card Button for existing cards */}
        {paymentMethods.length > 0 && (
          <div className="text-center mb-12">
            <Button
              onClick={() => setShowAddForm(true)}
              variant="outline"
              className="border-2 border-black text-black hover:bg-black hover:text-white px-12 py-4 text-sm uppercase tracking-wider font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Card
            </Button>
          </div>
        )}

        {/* Add Payment Method Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-y-auto max-h-[95vh]">
              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <Button
                    onClick={() => setShowAddForm(false)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </Button>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    NEW PAYMENT METHOD
                  </h2>
                  <div className="w-8 h-px bg-gray-300 mx-auto"></div>
                </div>

                <div className="space-y-6">
                  {/* Credit Card Number */}
                  <div>
                    <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-3 block">
                      CREDIT CARD NUMBER <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Enter your card number"
                        value={newCard.cardNumber}
                        onChange={(e) => setNewCard(prev => ({ ...prev, cardNumber: e.target.value.replace(/\s/g, '') }))}
                        className="h-11 border border-gray-200 focus:border-gray-400 rounded-md bg-white placeholder:text-gray-400 text-sm pr-4"
                      />
                    </div>
                    <div className="flex gap-1 mt-2">
                      <div className="w-7 h-4 bg-blue-600 rounded-sm text-white text-[9px] flex items-center justify-center font-bold">VISA</div>
                      <div className="w-7 h-4 bg-red-500 rounded-sm text-white text-[9px] flex items-center justify-center font-bold">MC</div>
                      <div className="w-7 h-4 bg-blue-500 rounded-sm text-white text-[9px] flex items-center justify-center font-bold">AE</div>
                      <div className="w-7 h-4 bg-gray-600 rounded-sm text-white text-[9px] flex items-center justify-center font-bold">UN</div>
                      <div className="w-7 h-4 bg-orange-500 rounded-sm text-white text-[9px] flex items-center justify-center font-bold">DC</div>
                      <div className="w-7 h-4 bg-red-600 rounded-sm text-white text-[9px] flex items-center justify-center font-bold">JCB</div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Accepted credit cards</p>
                  </div>

                  {/* Security Code and Expiration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-3 block">
                        SECURITY CODE <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="3 - 4 Digits"
                        maxLength={4}
                        value={newCard.cvv}
                        onChange={(e) => setNewCard(prev => ({ ...prev, cvv: e.target.value }))}
                        className="h-11 border border-gray-200 focus:border-gray-400 rounded-md bg-white placeholder:text-gray-400 text-sm"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-3 block">
                        EXPIRATION DATE <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          value={newCard.expiryMonth}
                          onValueChange={(value) => setNewCard(prev => ({ ...prev, expiryMonth: value }))}
                        >
                          <SelectTrigger className="h-11 border border-gray-200 focus:border-gray-400 rounded-md bg-white text-sm">
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
                        
                        <Select
                          value={newCard.expiryYear}
                          onValueChange={(value) => setNewCard(prev => ({ ...prev, expiryYear: value }))}
                        >
                          <SelectTrigger className="h-11 border border-gray-200 focus:border-gray-400 rounded-md bg-white text-sm">
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
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-3 block">
                      CARDHOLDER NAME <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={newCard.holderName}
                      onChange={(e) => setNewCard(prev => ({ ...prev, holderName: e.target.value.toUpperCase() }))}
                      className="h-11 border border-gray-200 focus:border-gray-400 rounded-md bg-white placeholder:text-gray-400 text-sm uppercase"
                    />
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-start space-x-3 pt-2">
                    <input
                      type="checkbox"
                      id="primary-payment"
                      className="w-4 h-4 mt-0.5 text-black border-gray-300 rounded focus:ring-black focus:ring-2"
                    />
                    <Label htmlFor="primary-payment" className="text-sm text-gray-700 leading-5">
                      Make this my primary payment method.
                    </Label>
                  </div>

                  {/* Billing Address Section */}
                  <div className="border-t pt-6 mt-6">
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        BILLING ADDRESS
                      </h3>
                      <p className="text-xs text-gray-500">
                        Billing address must match address on file for payment method.
                      </p>
                    </div>
                    
                    <div className="space-y-5">
                      <div>
                        <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-3 block">
                          COUNTRY/REGION <span className="text-red-500">*</span>
                        </Label>
                        <Select defaultValue="US">
                          <SelectTrigger className="h-11 border border-gray-200 focus:border-gray-400 rounded-md bg-white text-sm">
                            <SelectValue placeholder="United States" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-3 block">
                            FIRST NAME <span className="text-red-500">*</span>
                          </Label>
                          <Input className="h-11 border border-gray-200 focus:border-gray-400 rounded-md bg-white text-sm" />
                        </div>
                        
                        <div>
                          <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-3 block">
                            LAST NAME <span className="text-red-500">*</span>
                          </Label>
                          <Input className="h-11 border border-gray-200 focus:border-gray-400 rounded-md bg-white text-sm" />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-3 block">
                          ADDRESS LINE 1 <span className="text-red-500">*</span>
                        </Label>
                        <Input className="h-11 border border-gray-200 focus:border-gray-400 rounded-md bg-white text-sm" />
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-3 block">
                          ADDRESS LINE 2
                        </Label>
                        <Input className="h-11 border border-gray-200 focus:border-gray-400 rounded-md bg-white text-sm" />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-3 block">
                            CITY <span className="text-red-500">*</span>
                          </Label>
                          <Input className="h-11 border border-gray-200 focus:border-gray-400 rounded-md bg-white text-sm" />
                        </div>
                        
                        <div>
                          <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-3 block">
                            STATE <span className="text-red-500">*</span>
                          </Label>
                          <Select>
                            <SelectTrigger className="h-11 border border-gray-200 focus:border-gray-400 rounded-md bg-white text-sm">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CA">California</SelectItem>
                              <SelectItem value="NY">New York</SelectItem>
                              <SelectItem value="TX">Texas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-3 block">
                            ZIP CODE <span className="text-red-500">*</span>
                          </Label>
                          <Input className="h-11 border border-gray-200 focus:border-gray-400 rounded-md bg-white text-sm" />
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="business-address"
                          className="w-4 h-4 mt-0.5 text-black border-gray-300 rounded focus:ring-black focus:ring-2"
                        />
                        <Label htmlFor="business-address" className="text-sm text-gray-700 leading-5">
                          This is a business address.
                        </Label>
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-3 block">
                          CONTACT PHONE NUMBER <span className="text-red-500">*</span>
                        </Label>
                        <div className="grid grid-cols-5 gap-3">
                          <div className="col-span-2">
                            <Select defaultValue="+1">
                              <SelectTrigger className="h-11 border border-gray-200 focus:border-gray-400 rounded-md bg-white text-sm">
                                <SelectValue placeholder="+1 United States" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="+1">+1 United States</SelectItem>
                                <SelectItem value="+44">+44 United Kingdom</SelectItem>
                                <SelectItem value="+33">+33 France</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-3">
                            <Input className="h-11 border border-gray-200 focus:border-gray-400 rounded-md bg-white text-sm" />
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 mt-3">
                          <input
                            type="checkbox"
                            id="additional-contact"
                            className="w-4 h-4 mt-0.5 text-black border-gray-300 rounded focus:ring-black focus:ring-2"
                          />
                          <Label htmlFor="additional-contact" className="text-sm text-gray-700 leading-5">
                            Add additional contact number.
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t">
                  <Button 
                    onClick={handleAddCard}
                    className="w-full bg-black text-white hover:bg-gray-800 h-12 rounded-md font-medium text-sm tracking-wide transition-colors"
                  >
                    SAVE
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods List */}
        {paymentMethods.length > 0 && (
          <div className="space-y-6">
            {paymentMethods.map((card) => (
              <div key={card.id} className="border-2 border-gray-200 p-8 bg-white">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-10 bg-gray-100 border border-gray-300 flex items-center justify-center text-xl">
                      {getCardIcon(card.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-medium text-black uppercase tracking-[0.1em]">
                          {card.type} •••• {card.lastFour}
                        </h3>
                        {card.isDefault && (
                          <div className="flex items-center gap-2 bg-black text-white text-xs px-3 py-1 uppercase tracking-wider">
                            <Check className="w-3 h-3" />
                            Default
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm uppercase tracking-[0.1em]">
                        Expires {card.expiryMonth}/{card.expiryYear} • {card.holderName}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {!card.isDefault && (
                      <Button
                        onClick={() => setDefaultCard(card.id)}
                        variant="outline"
                        className="border-black text-black hover:bg-gray-50 px-6 py-2 text-xs uppercase tracking-[0.1em] font-medium"
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDeleteCard(card.id)}
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 text-xs uppercase tracking-[0.1em] font-medium"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-16 bg-gray-50 border-2 border-gray-200 p-8">
          <div className="flex gap-6">
            <Lock className="w-8 h-8 text-gray-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-medium text-black mb-4 uppercase tracking-[0.15em]">
                Secure Payment
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your payment information is protected with bank-level encryption. We never store your complete card details or CVV codes for maximum security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
