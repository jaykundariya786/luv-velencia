import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, CreditCard, Trash2, Shield, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/redux";
import { getUserPaymentMethods, addUserPaymentMethod, deleteUserPaymentMethod, updateUserPaymentMethod } from "@/services/api";

export default function Wallet() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [showAddForm, setShowAddForm] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const methods = await getUserPaymentMethods(user.id);
          setPaymentMethods(methods);
        }
      } catch (error) {
        console.error("Failed to fetch payment methods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [user?.id]);

  const [newCard, setNewCard] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    holderName: "",
    type: "",
  });

  const getCardIcon = (type: string) => {
    const icons = {
      Visa: "💳",
      Mastercard: "💳",
      "American Express": "💳",
      Discover: "💳",
    };
    return icons[type as keyof typeof icons] || "💳";
  };

  const handleAddCard = async () => {
    if (
      newCard.cardNumber &&
      newCard.expiryMonth &&
      newCard.expiryYear &&
      newCard.cvv &&
      newCard.holderName &&
      user?.id
    ) {
      try {
        let cardType = "Visa";
        if (newCard.cardNumber.startsWith("5")) cardType = "Mastercard";
        if (newCard.cardNumber.startsWith("3")) cardType = "American Express";
        if (newCard.cardNumber.startsWith("6")) cardType = "Discover";

        const cardData = {
          type: cardType,
          lastFour: newCard.cardNumber.slice(-4),
          expiryMonth: newCard.expiryMonth,
          expiryYear: newCard.expiryYear,
          holderName: newCard.holderName,
          isDefault: paymentMethods.length === 0,
        };
        
        const result = await addUserPaymentMethod(user.id, cardData);
        if (result.success) {
          const methods = await getUserPaymentMethods(user.id);
          setPaymentMethods(methods);
        }
        
        setNewCard({
          cardNumber: "",
          expiryMonth: "",
          expiryYear: "",
          cvv: "",
          holderName: "",
          type: "",
        });
        setShowAddForm(false);
      } catch (error) {
        console.error("Failed to add payment method:", error);
      }
    }
  };

  const handleDeleteCard = async (id: number) => {
    if (
      window.confirm("Are you sure you want to delete this payment method?") &&
      user?.id
    ) {
      try {
        await deleteUserPaymentMethod(user.id, id);
        setPaymentMethods(paymentMethods.filter((card) => card.id !== id));
      } catch (error) {
        console.error("Failed to delete payment method:", error);
      }
    }
  };

  const setDefaultCard = async (id: number) => {
    try {
      if (user?.id) {
        const cardToUpdate = paymentMethods.find(card => card.id === id);
        if (cardToUpdate) {
          await updateUserPaymentMethod(user.id, id, { ...cardToUpdate, isDefault: true });
          setPaymentMethods(
            paymentMethods.map((card) => ({
              ...card,
              isDefault: card.id === id,
            }))
          );
        }
      }
    } catch (error) {
      console.error("Failed to set default payment method:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="relative h-[400px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lv-luxury text-primary lv-fade-in tracking-[0.2em] drop-shadow-2xl">
              WALLET
            </h1>
          </div>
        </div>

        {/* Back Button */}
        <Button
          onClick={() => navigate("/account")}
          variant="ghost"
          size="sm"
          className="absolute top-8 left-8 text-white hover:bg-white/20 p-3 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Diamond Logo */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-[#0b3e27] to-[#197149] rotate-45 flex items-center justify-center">
          <span className="text-white text-lg font-bold transform -rotate-45">
            G
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Payment Cards Section */}
        <div className="text-center mb-16">
          <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-4">
            PAYMENT CARDS
          </h2>
          <div className="w-16 h-px bg-black mx-auto mb-12"></div>
        </div>

        {/* Add Card Section */}
        {paymentMethods.length === 0 && (
          <div
            onClick={() => setShowAddForm(true)}
            className="border-2 border-dashed border-gray-300 bg-gray-50/50 hover:bg-primary/10 hover:border-primary cursor-pointer transition-all duration-300 group aspect-[1.6/1] rounded-xl sm:rounded-2xl flex items-center justify-center max-w-sm mx-auto w-full"
          >
            <div className="text-center p-4 sm:p-6">
              <div className="p-6 bg-white border-2 rounded-full border-gray-200 group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-6 inline-block">
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
              </div>
              <h3 className="lv-luxury mb-2 text-md font-bold text-primary">
                Add New Card
              </h3>
              <p className="lv-body text-gray-500 text-sm font-mono lv-transition">
                Click to add a new payment method
              </p>
            </div>
          </div>
        )}

        {/* Payment Methods Grid */}
        {paymentMethods.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 lg:gap-8">
            {paymentMethods.map((card) => (
              <div key={card.id} className="group max-w-sm mx-auto w-full">
                {/* Credit Card */}
                <div
                  className={`relative w-full aspect-[1.6/1] rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${
                    card.type === "Visa"
                      ? "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900"
                      : card.type === "Mastercard"
                      ? "bg-gradient-to-br from-red-500 via-red-600 to-red-800"
                      : card.type === "American Express"
                      ? "bg-gradient-to-br from-green-600 via-green-700 to-green-900"
                      : "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900"
                  }`}
                >
                  {/* Card Pattern Overlay */}
                  <div className="absolute inset-0 opacity-10 rounded-xl sm:rounded-2xl overflow-hidden">
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 border border-white/20 rounded-full"></div>
                    <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-8 h-8 sm:w-12 sm:h-12 border border-white/20 rounded-full"></div>
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-16 h-16 sm:w-20 sm:h-20 border border-white/10 rounded-full"></div>
                  </div>

                  {/* Delete Button */}
                  <Button
                    onClick={() => handleDeleteCard(card.id)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 text-white/70 hover:text-red-400 hover:bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                    title="Delete card"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>

                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    {/* Card Type Logo */}
                    <div className="flex items-center">
                      {card.type === "Visa" && (
                        <div className="bg-white text-blue-700 px-2 py-0.5 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-bold tracking-wider">
                          VISA
                        </div>
                      )}
                      {card.type === "Mastercard" && (
                        <div className="flex items-center space-x-0.5 sm:space-x-1">
                          <div className="w-4 h-4 sm:w-6 sm:h-6 bg-red-500 rounded-full"></div>
                          <div className="w-4 h-4 sm:w-6 sm:h-6 bg-yellow-400 rounded-full -ml-2 sm:-ml-3"></div>
                        </div>
                      )}
                      {card.type === "American Express" && (
                        <div className="bg-white text-green-700 px-2 py-0.5 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-bold tracking-wider">
                          AMEX
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Chip */}
                  <div className="absolute top-12 sm:top-16 left-4 sm:left-6 w-8 h-6 sm:w-10 sm:h-8 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded border border-yellow-600/30 shadow-lg">
                    <div className="w-full h-full bg-gradient-to-br from-transparent via-white/10 to-transparent rounded grid grid-cols-3 gap-px p-0.5 sm:p-1">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-yellow-600/20 rounded-sm"
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Card Number */}
                  <div className="absolute bottom-16 sm:bottom-20 left-4 sm:left-6 right-4 sm:right-6">
                    <div className="text-lg sm:text-xl md:text-2xl font-mono tracking-widest font-light">
                      •••• •••• •••• {card.lastFour}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex justify-between items-end">
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] sm:text-xs text-white/70 uppercase tracking-wider mb-0.5 sm:mb-1">
                        Card Holder
                      </div>
                      <div className="font-medium text-xs sm:text-sm uppercase tracking-wider truncate">
                        {card.holderName}
                      </div>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <div className="text-[10px] sm:text-xs text-white/70 uppercase tracking-wider mb-0.5 sm:mb-1">
                        Expires
                      </div>
                      <div className="font-medium text-xs sm:text-sm tracking-wider">
                        {card.expiryMonth}/{card.expiryYear.slice(-2)}
                      </div>
                    </div>
                  </div>

                  {/* Contactless Symbol */}
                  <div className="absolute top-12 sm:top-16 right-4 sm:right-6">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 opacity-50">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-full h-full text-white"
                      >
                        <path
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 sm:mt-6">
                  {!card.isDefault ? (
                    <Button
                      onClick={() => setDefaultCard(card.id)}
                      variant="outline"
                      className="w-full border-2 border-gray-300 rounded-full text-gray-700 hover:bg-primary hover:text-white hover:border-primary py-4 text-sm uppercase tracking-[0.15em] font-bold transition-all duration-300"
                    >
                      Set as Default
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center py-3">
                      <span className="text-sm text-gray-500 uppercase tracking-[0.15em] font-bold">
                        Default Payment Method
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Add New Card */}
            <div
              onClick={() => setShowAddForm(true)}
              className="border-2 border-dashed border-gray-300 bg-gray-50/50 hover:bg-primary/10 hover:border-primary cursor-pointer transition-all duration-300 group aspect-[1.6/1] rounded-xl sm:rounded-2xl flex items-center justify-center max-w-sm mx-auto w-full"
            >
              <div className="text-center p-4 sm:p-6">
                <div className="p-6 bg-white border-2 rounded-full border-gray-200 group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-6 inline-block">
                  <Plus className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
                </div>
                <h3 className="lv-luxury mb-2 text-md font-bold text-primary">
                  Add New Card
                </h3>
                <p className="lv-body text-gray-500 text-sm font-mono lv-transition">
                  Click to add a new payment method
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add Payment Method Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-[600px] max-w-[90%] rounded-3xl max-h-[90vh] bg-white overflow-y-auto">
              <div className="p-12">
                <div className="flex justify-between mb-2">
                  <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-2">
                    Add PAYMENT
                  </h2>
                  <Button
                    onClick={() => setShowAddForm(false)}
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-gray-100 rounded-none"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </Button>
                </div>

                <div className="w-16 h-px bg-black mb-12"></div>
                <div className="space-y-6">
                  {/* Credit Card Number */}
                  <div>
                    <Label className="lv-luxury text-md font-bold text-primary text-sm mb-2 block">
                      CREDIT CARD NUMBER <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Enter your card number"
                        value={newCard.cardNumber}
                        onChange={(e) =>
                          setNewCard((prev) => ({
                            ...prev,
                            cardNumber: e.target.value.replace(/\s/g, ""),
                          }))
                        }
                        className="lv-body text-black font-mono lv-transition px-4 h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full bg-white text-sm uppercase tracking-wider placeholder:text-gray-400"
                      />
                    </div>
                    <div className="flex gap-1 mt-2">
                      <div className="w-7 h-4 bg-blue-600 rounded-sm text-white text-[9px] flex items-center justify-center font-bold">
                        VISA
                      </div>
                      <div className="w-7 h-4 bg-red-500 rounded-sm text-white text-[9px] flex items-center justify-center font-bold">
                        MC
                      </div>
                      <div className="w-7 h-4 bg-blue-500 rounded-sm text-white text-[9px] flex items-center justify-center font-bold">
                        AE
                      </div>
                      <div className="w-7 h-4 bg-gray-600 rounded-sm text-white text-[9px] flex items-center justify-center font-bold">
                        UN
                      </div>
                      <div className="w-7 h-4 bg-orange-500 rounded-sm text-white text-[9px] flex items-center justify-center font-bold">
                        DC
                      </div>
                      <div className="w-7 h-4 bg-red-600 rounded-sm text-white text-[9px] flex items-center justify-center font-bold">
                        JCB
                      </div>
                    </div>
                    <p className="lv-body text-gray-500 hover:text-primary font-mono lv-transition text-xs mt-1">
                      Accepted credit cards
                    </p>
                  </div>

                  {/* Security Code and Expiration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="lv-luxury text-md font-bold text-primary text-sm mb-2 block">
                        SECURITY CODE <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="3 - 4 Digits"
                        maxLength={4}
                        value={newCard.cvv}
                        onChange={(e) =>
                          setNewCard((prev) => ({
                            ...prev,
                            cvv: e.target.value,
                          }))
                        }
                        className="lv-body text-black font-mono lv-transition px-4 h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full bg-white text-sm uppercase tracking-wider placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <Label className="lv-luxury text-md font-bold text-primary text-sm mb-2 block">
                        EXPIRATION DATE <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          value={newCard.expiryMonth}
                          onValueChange={(value) =>
                            setNewCard((prev) => ({
                              ...prev,
                              expiryMonth: value,
                            }))
                          }
                        >
                          <SelectTrigger className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400">
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent className="bg-white rounded-3xl lv-body text-gray-500  font-mono lv-transition">
                            {Array.from({ length: 12 }, (_, i) => {
                              const month = (i + 1).toString().padStart(2, "0");
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
                          onValueChange={(value) =>
                            setNewCard((prev) => ({
                              ...prev,
                              expiryYear: value,
                            }))
                          }
                        >
                          <SelectTrigger className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400">
                            <SelectValue placeholder="YYYY" />
                          </SelectTrigger>
                          <SelectContent className="bg-white rounded-3xl lv-body text-gray-500  font-mono lv-transition">
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = (
                                new Date().getFullYear() + i
                              ).toString();
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
                    <Label className="lv-luxury text-md font-bold text-primary text-sm mb-2 block">
                      CARDHOLDER NAME <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={newCard.holderName}
                      onChange={(e) =>
                        setNewCard((prev) => ({
                          ...prev,
                          holderName: e.target.value.toUpperCase(),
                        }))
                      }
                      placeholder="Cardholder Name"
                      className="lv-body text-black font-mono lv-transition px-4 h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full bg-white text-sm uppercase tracking-wider placeholder:text-gray-400"
                    />
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-start space-x-3 pt-2">
                    <input
                      type="checkbox"
                      id="primary-payment"
                      className="w-4 h-4 mt-0.5 text-black border-gray-300 rounded focus:ring-black focus:ring-2"
                    />
                    <Label
                      htmlFor="primary-payment"
                      className="lv-body text-gray-500 font-mono lv-transition text-sm"
                    >
                      Make this my primary payment method.
                    </Label>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t">
                  <Button
                    onClick={handleAddCard}
                    className="w-full flex-1 bg-primary text-white h-12 uppercase tracking-[0.15em] text-sm font-medium rounded-full transition-all duration-300"
                  >
                    SAVE
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Security Notice */}
        <div className="mt-16 relative">
          {/* Background with subtle pattern */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"></div>
          <div className="relative border-2 rounded-3xl border-emerald-200 p-10">
            <div className="md:flex lg:flex grid grid-cols-1 items-start gap-8">
              {/* Enhanced Shield Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-6">
                  <h3 className="text-2xl lv-luxury text-md font-bold text-primary mb-2">
                    SECURE PAYMENT
                  </h3>
                  <div className="w-12 h-px bg-emerald-600"></div>
                </div>

                <p className="lv-body text-gray-500 font-mono text-sm lv-transition mb-6">
                  Your payment information is protected with bank-level
                  encryption. We never store your complete card details or CVV
                  codes for maximum security.
                </p>

                {/* Security Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                      SSL ENCRYPTION
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                      PCI COMPLIANT
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="lv-body text-gray-500 font-mono text-sm lv-transition">
                      24/7 MONITORING
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute top-4 rounded-lg right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-300 opacity-30"></div>
            <div className="absolute bottom-4 rounded-lg left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-300 opacity-30"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
