import { useAppSelector } from "@/hooks/redux";
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
import { ArrowLeft, Plus, MapPin, Edit, Trash2, X, Check } from "lucide-react";
import { useState } from "react";

export default function Addresses() {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      name: "John Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      isDefault: true,
    },
    {
      id: 2,
      type: "Work",
      name: "John Doe",
      street: "456 Business Ave",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      country: "United States",
      isDefault: false,
    },
  ]);

  const [editingAddress, setEditingAddress] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    type: "",
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [newAddress, setNewAddress] = useState({
    type: "",
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const handleAddAddress = () => {
    if (newAddress.name && newAddress.street && newAddress.city) {
      const address = {
        id: Date.now(),
        ...newAddress,
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, address]);
      setNewAddress({
        type: "",
        name: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteAddress = (id: number) => {
    const addressToDelete = addresses.find((addr) => addr.id === id);
    const confirmMessage = `Are you sure you want to delete the ${addressToDelete?.type} address?\n\nThis action cannot be undone.`;

    if (window.confirm(confirmMessage)) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
    }
  };

  const handleEditAddress = (id: number) => {
    const addressToEdit = addresses.find((addr) => addr.id === id);
    if (addressToEdit) {
      setEditFormData({
        type: addressToEdit.type,
        name: addressToEdit.name,
        street: addressToEdit.street,
        city: addressToEdit.city,
        state: addressToEdit.state,
        zipCode: addressToEdit.zipCode,
        country: addressToEdit.country,
      });
      setEditingAddress(id);
    }
  };

  const handleSaveEdit = () => {
    if (
      editFormData.name &&
      editFormData.street &&
      editFormData.city &&
      editingAddress
    ) {
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddress ? { ...addr, ...editFormData } : addr
        )
      );
      setEditingAddress(null);
      setEditFormData({
        type: "",
        name: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
    setEditFormData({
      type: "",
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    });
  };

  const setDefaultAddress = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-white font-['Helvetica_Neue',Arial,sans-serif]">
      {/* Hero Section */}
      <div
        className="relative h-[400px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop')",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lv-luxury text-primary lv-fade-in tracking-[0.2em] drop-shadow-2xl">
              ADDRESS BOOK
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
        {/* Add Address Section */}
        {addresses.length === 0 ? (
          <div
            onClick={() => setShowAddForm(true)}
            className="max-w-xs mx-auto border-2 border-dashed rounded-3xl border-gray-300 bg-gray-50/50 hover:bg-primary/10 hover:border-primary cursor-pointer transition-all duration-300 group min-h-[400px] flex items-center justify-center"
          >
            <div className="text-center p-8">
              <div className="p-6 bg-white border-2 rounded-full border-gray-200 group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-6 inline-block">
                <Plus className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="lv-luxury mb-2 text-md font-bold text-primary">
                Add Address
              </h3>
              <p className="lv-body text-gray-500 text-sm font-mono lv-transition">
                Click to add a shipping address
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-16">
              <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-2">
                MY ADDRESSES
              </h2>
              <div className="w-16 h-px bg-black mx-auto mb-12"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="border-2 border-gray-200 bg-white hover:border-primary rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Header Section */}
                  <div className="p-6 border-b border-gray-200 bg-gray-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-full border border-gray-200 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="lv-luxury text-lg font-bold text-primary">
                            {address.type}
                          </h3>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          onClick={() => handleEditAddress(address.id)}
                          variant="ghost"
                          size="sm"
                          className="p-2 hover:bg-blue-50 rounded-full hover:text-blue-700 border border-blue-200"
                          title="Edit address"
                        >
                          <Edit className="w-4 h-4 text-blue-700" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteAddress(address.id)}
                          variant="ghost"
                          size="sm"
                          className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 border border-red-200"
                          title="Delete address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Address Details Section */}
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Recipient */}
                      <div>
                        <Label className="lv-luxury text-md font-bold text-primary text-sm mb-2 block">
                          RECIPIENT
                        </Label>
                        <p className="lv-body text-gray-700 text-md font-mono lv-transition font-normal">
                          {address.name}
                        </p>
                      </div>

                      {/* Address */}
                      <div>
                        <Label className="lv-luxury text-md font-bold text-primary text-sm mb-2 block">
                          ADDRESS
                        </Label>
                        <div className="space-y-1 lv-body text-gray-700 text-xs font-mono lv-transition font-normal">
                          <p>{address.street}</p>
                          <p>
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-gray-600">{address.country}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-8 pt-6 border-t  border-gray-200">
                      {!address.isDefault ? (
                        <Button
                          onClick={() => setDefaultAddress(address.id)}
                          variant="outline"
                          className="w-full border-2 border-gray-300 rounded-full text-gray-700 hover:bg-primary hover:text-white hover:border-primary py-4 text-sm uppercase tracking-[0.15em] font-bold transition-all duration-300"
                        >
                          Set as Default
                        </Button>
                      ) : (
                        <div className="flex items-center justify-center py-3">
                          <span className="text-sm text-gray-500 uppercase tracking-[0.15em] font-bold">
                            Default Address
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Address Card */}
              <div
                onClick={() => setShowAddForm(true)}
                className="border-2 border-dashed rounded-3xl border-gray-300 bg-gray-50/50 hover:bg-primary/10 hover:border-primary cursor-pointer transition-all duration-300 group min-h-[400px] flex items-center justify-center"
              >
                <div className="text-center p-8">
                  <div className="p-6 bg-white border-2 rounded-full border-gray-200 group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-6 inline-block">
                    <Plus className="w-8 h-8 mx-auto" />
                  </div>
                  <h3 className="lv-luxury mb-2 text-md font-bold text-primary">
                    Add New Address
                  </h3>
                  <p className="lv-body text-gray-500 text-sm font-mono lv-transition">
                    Click to add a new shipping address
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Edit Address Modal */}
        {editingAddress && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-[600px] max-w-[90%] rounded-3xl max-h-[90vh] bg-white overflow-y-auto">
              <div className="p-12">
                <div className="flex justify-between mb-2">
                  <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-2">
                    EDIT ADDRESS
                  </h2>
                  <Button
                    onClick={handleCancelEdit}
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-gray-100 rounded-none"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </Button>
                </div>

                {/* Divider */}
                <div className="w-16 h-px bg-black mb-12"></div>
                <div className="space-y-8">
                  <div>
                    <Label
                      htmlFor="edit-country"
                      className="lv-luxury text-md font-bold text-primary text-sm mb-2 block"
                    >
                      COUNTRY / REGION <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={editFormData.country}
                      onValueChange={(value) =>
                        setEditFormData((prev) => ({ ...prev, country: value }))
                      }
                    >
                      <SelectTrigger className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400">
                        <SelectValue placeholder="United States" />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-3xl lv-body text-gray-500  font-mono lv-transition">
                        <SelectItem value="United States">
                          United States
                        </SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">
                          United Kingdom
                        </SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Italy">Italy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Label
                        htmlFor="edit-first-name"
                        className="lv-luxury text-md font-bold text-primary text-sm mb-2 block"
                      >
                        FIRST NAME <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="edit-first-name"
                        value={editFormData.name.split(" ")[0] || ""}
                        onChange={(e) => {
                          const lastName = editFormData.name
                            .split(" ")
                            .slice(1)
                            .join(" ");
                          setEditFormData((prev) => ({
                            ...prev,
                            name: `${e.target.value} ${lastName}`.trim(),
                          }));
                        }}
                        className="lv-body text-black font-mono lv-transition px-4 h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full bg-white text-sm uppercase tracking-wider placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="edit-last-name"
                        className="lv-luxury text-md font-bold text-primary text-sm mb-2 block"
                      >
                        LAST NAME <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="edit-last-name"
                        value={
                          editFormData.name.split(" ").slice(1).join(" ") || ""
                        }
                        onChange={(e) => {
                          const firstName =
                            editFormData.name.split(" ")[0] || "";
                          setEditFormData((prev) => ({
                            ...prev,
                            name: `${firstName} ${e.target.value}`.trim(),
                          }));
                        }}
                        className="lv-body text-black font-mono lv-transition px-4 h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full bg-white text-sm uppercase tracking-wider placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="edit-address-line-1"
                      className="lv-luxury text-md font-bold text-primary text-sm mb-2 block"
                    >
                      ADDRESS LINE 1 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-address-line-1"
                      value={editFormData.street}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          street: e.target.value,
                        }))
                      }
                      className="lv-body text-black font-mono lv-transition px-4 h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full bg-white text-sm uppercase tracking-wider placeholder:text-gray-400"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <Label
                        htmlFor="edit-city"
                        className="lv-luxury text-md font-bold text-primary text-sm mb-2 block"
                      >
                        CITY <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="edit-city"
                        value={editFormData.city}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        className="lv-body text-black font-mono lv-transition px-4 h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full bg-white text-sm uppercase tracking-wider placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="edit-state"
                        className="lv-luxury text-md font-bold text-primary text-sm mb-2 block"
                      >
                        STATE <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={editFormData.state}
                        onValueChange={(value) =>
                          setEditFormData((prev) => ({ ...prev, state: value }))
                        }
                      >
                        <SelectTrigger className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-3xl lv-body text-gray-500  font-mono lv-transition">
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        htmlFor="edit-zip"
                        className="lv-luxury text-md font-bold text-primary text-sm mb-2 block"
                      >
                        ZIP CODE <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="edit-zip"
                        value={editFormData.zipCode}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            zipCode: e.target.value,
                          }))
                        }
                        className="lv-body text-black font-mono lv-transition px-4 h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full bg-white text-sm uppercase tracking-wider placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="flex-1 border-2 border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 h-12 uppercase tracking-[0.15em] text-sm font-medium transition-all duration-300"
                    >
                      CANCEL
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-primary text-white h-12 uppercase tracking-[0.15em] text-sm font-medium rounded-full transition-all duration-300"
                    >
                      SAVE CHANGES
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Address Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-[600px] max-w-[90%] rounded-3xl max-h-[90vh] bg-white overflow-y-auto">
              <div className="p-12">
                <div className="flex justify-between mb-2">
                  <h2 className="lv-luxury font-bold text-primary text-3xl text-black mb-2">
                    NEW ADDRESS
                  </h2>
                  <Button
                    onClick={() => setShowAddForm(false)}
                    variant="ghost"
                    size="sm"
                    className="p-3 hover:bg-gray-100 rounded-none"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </Button>
                </div>

                {/* Divider */}
                <div className="w-16 h-px bg-black mb-12"></div>
                <div className="space-y-8">
                  <div>
                    <Label
                      htmlFor="country"
                      className="lv-luxury text-md font-bold text-primary text-sm mb-2 block"
                    >
                      COUNTRY / REGION <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newAddress.country}
                      onValueChange={(value) =>
                        setNewAddress((prev) => ({ ...prev, country: value }))
                      }
                    >
                      <SelectTrigger className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400">
                        <SelectValue placeholder="United States" />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-3xl lv-body text-gray-500  font-mono lv-transition">
                        <SelectItem value="United States">
                          United States
                        </SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">
                          United Kingdom
                        </SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Italy">Italy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Label
                        htmlFor="first-name"
                        className="lv-luxury text-md font-bold text-primary text-sm mb-2 block"
                      >
                        FIRST NAME <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="first-name"
                        value={newAddress.name.split(" ")[0] || ""}
                        onChange={(e) => {
                          const lastName = newAddress.name
                            .split(" ")
                            .slice(1)
                            .join(" ");
                          setNewAddress((prev) => ({
                            ...prev,
                            name: `${e.target.value} ${lastName}`.trim(),
                          }));
                        }}
                        className="lv-body text-black font-mono lv-transition px-4 h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full bg-white text-sm uppercase tracking-wider placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="last-name"
                        className="lv-luxury text-md font-bold text-primary text-sm mb-2 block"
                      >
                        LAST NAME <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="last-name"
                        value={
                          newAddress.name.split(" ").slice(1).join(" ") || ""
                        }
                        onChange={(e) => {
                          const firstName = newAddress.name.split(" ")[0] || "";
                          setNewAddress((prev) => ({
                            ...prev,
                            name: `${firstName} ${e.target.value}`.trim(),
                          }));
                        }}
                        className="lv-body text-black font-mono lv-transition px-4 h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full bg-white text-sm uppercase tracking-wider placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="address-line-1"
                      className="lv-luxury text-md font-bold text-primary text-sm mb-2 block"
                    >
                      ADDRESS LINE 1 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address-line-1"
                      value={newAddress.street}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          street: e.target.value,
                        }))
                      }
                      className="lv-body text-black font-mono lv-transition px-4 h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full bg-white text-sm uppercase tracking-wider placeholder:text-gray-400"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <Label
                        htmlFor="city"
                        className="lv-luxury text-md font-bold text-primary text-sm mb-2 block"
                      >
                        CITY <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        className="lv-body text-black font-mono lv-transition px-4 h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full bg-white text-sm uppercase tracking-wider placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="state"
                        className="lv-luxury text-md font-bold text-primary text-sm mb-2 block"
                      >
                        STATE <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={newAddress.state}
                        onValueChange={(value) =>
                          setNewAddress((prev) => ({ ...prev, state: value }))
                        }
                      >
                        <SelectTrigger className="lv-body text-gray-500 font-mono lv-transition h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full px-4 bg-white placeholder:text-gray-400">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-3xl lv-body text-gray-500  font-mono lv-transition">
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        htmlFor="zip"
                        className="lv-luxury text-md font-bold text-primary text-sm mb-2 block"
                      >
                        ZIP CODE <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="zip"
                        value={newAddress.zipCode}
                        onChange={(e) =>
                          setNewAddress((prev) => ({
                            ...prev,
                            zipCode: e.target.value,
                          }))
                        }
                        className="lv-body text-black font-mono lv-transition px-4 h-12 border-2 border-gray-300 focus:border-gray-400 rounded-full bg-white text-sm uppercase tracking-wider placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 border-2 border-black rounded-sm flex items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                          <Check className="w-3 h-3 text-black" />
                        </div>
                      </div>
                      <Label
                        htmlFor="primary-shipping"
                        className="lv-body text-gray-500 font-mono lv-transition text-sm"
                      >
                        Make this my primary shipping address.
                      </Label>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 border-2 border-black rounded-sm flex items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                          <Check className="w-3 h-3 text-black" />
                        </div>
                      </div>
                      <Label
                        htmlFor="business-address"
                        className="lv-body text-gray-500 font-mono lv-transition text-sm"
                      >
                        This is a business address.
                      </Label>
                    </div>
                  </div>

                  <div className="">
                    <Button
                      onClick={handleAddAddress}
                      className="w-full flex-1 bg-primary text-white h-12 uppercase tracking-[0.15em] text-sm font-medium rounded-full transition-all duration-300"
                    >
                      SAVE ADDRESS
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
