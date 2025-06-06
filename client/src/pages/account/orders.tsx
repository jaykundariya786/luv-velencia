import { useAppSelector } from "@/hooks/redux";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  RotateCcw,
  Download,
  Star,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Orders() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trackingOrder, setTrackingOrder] = useState<string | null>(null);

  // Mock order data with enhanced details
  const orders = [
    {
      id: "LV-001234",
      date: "2025-01-15",
      status: "Delivered",
      total: 2250.0,
      estimatedDelivery: "2025-01-18",
      trackingNumber: "LV1234567890",
      items: [
        {
          name: "Luxury Velencia Handbag",
          image:
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
          price: 1890.0,
          color: "Black",
          size: "One Size",
          quantity: 1,
        },
        {
          name: "Designer Sunglasses",
          image:
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
          price: 360.0,
          color: "Tortoise",
          size: "One Size",
          quantity: 1,
        },
      ],
    },
    {
      id: "LV-001233",
      date: "2025-01-12",
      status: "In Transit",
      total: 1890.0,
      estimatedDelivery: "2025-01-16",
      trackingNumber: "LV0987654321",
      items: [
        {
          name: "Premium Leather Wallet",
          image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
          price: 1890.0,
          color: "Brown",
          size: "One Size",
          quantity: 1,
        },
      ],
    },
    {
      id: "LV-001232",
      date: "2025-01-08",
      status: "Processing",
      total: 3200.0,
      estimatedDelivery: "2025-01-20",
      trackingNumber: "LV1122334455",
      items: [
        {
          name: "Luxury Watch Collection",
          image:
            "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop",
          price: 3200.0,
          color: "Gold",
          size: "42mm",
          quantity: 1,
        },
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "In Transit":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "Processing":
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "In Transit":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Processing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getProgressWidth = (status: string) => {
    switch (status) {
      case "Delivered":
        return "100%";
      case "In Transit":
        return "66%";
      case "Processing":
        return "33%";
      default:
        return "0%";
    }
  };

  // Button handlers
  const handleTrackPackage = (order: any) => {
    setTrackingOrder(order.id);
    toast({
      title: "Tracking Package",
      description: `Tracking order ${order.id} with tracking number ${order.trackingNumber}`,
    });

    // Simulate tracking redirect
    setTimeout(() => {
      setTrackingOrder(null);
      toast({
        title: "Tracking Information",
        description: `Your package is currently ${order.status.toLowerCase()}. Estimated delivery: ${new Date(
          order.estimatedDelivery
        ).toLocaleDateString()}`,
      });
    }, 2000);
  };

  const handleViewDetails = (order: any) => {
    toast({
      title: "Order Details",
      description: `Viewing detailed information for order ${order.id}`,
    });
    // In a real app, this would navigate to a detailed order page
    console.log("Order details:", order);
  };

  const handleDownloadInvoice = (order: any) => {
    toast({
      title: "Downloading Invoice",
      description: `Invoice for order ${order.id} is being prepared`,
    });

    // Simulate invoice download
    setTimeout(() => {
      const element = document.createElement("a");
      const file = new Blob(
        [
          `Invoice for Order ${
            order.id
          }\nTotal: $${order.total.toLocaleString()}\nDate: ${order.date}`,
        ],
        { type: "text/plain" }
      );
      element.href = URL.createObjectURL(file);
      element.download = `invoice-${order.id}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast({
        title: "Invoice Downloaded",
        description: `Invoice for order ${order.id} has been downloaded`,
      });
    }, 1500);
  };

  const handleBuyAgain = (order: any) => {
    toast({
      title: "Adding to Cart",
      description: `Adding items from order ${order.id} to your shopping cart`,
    });

    setTimeout(() => {
      navigate("/shopping-bag");
    }, 1000);
  };

  const handleLeaveReview = (order: any) => {
    toast({
      title: "Leave Review",
      description: `Opening review form for order ${order.id}`,
    });
    // In a real app, this would open a review modal or navigate to review page
    console.log("Leave review for order:", order.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section - Wallet Style */}
      <div
        className="relative h-[400px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lv-luxury text-primary lv-fade-in tracking-[0.2em] drop-shadow-md">
              ORDER HISTORY
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
            O
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Orders Grid */}
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-xl border-2 border-gray-50 overflow-hidden hover:shadow-2xl hover:border-gray-100 transition-all duration-500 transform hover:-translate-y-1"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 px-6 py-6 border-b-2 border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="lv-luxury text-lg font-bold text-gray-900">
                      #{order.id}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 shadow-sm ${getStatusStyles(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="bg-white/60 p-3 rounded-xl border border-gray-100">
                      <span className="lv-luxury mb-4 text-xs font-bold text-primary">
                        Order Date
                      </span>
                      <div className="lv-body text-gray-700 font-mono lv-transition text-sm mt-1">
                        {new Date(order.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="bg-white/60 p-3 rounded-xl border border-gray-100">
                      <span className="lv-luxury mb-4 text-xs font-bold text-primary">
                        Tracking
                      </span>
                      <div className="lv-body text-gray-700 font-mono lv-transition text-sm mt-1">
                        {order.trackingNumber}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="lv-luxury text-xs text-gray-700 mb-2 font-bold">
                      Progress
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
                        <div
                          className="bg-gradient-to-r from-[#0b3e27] to-[#197149] h-2 rounded-full transition-all duration-1000 shadow-lg"
                          style={{ width: getProgressWidth(order.status) }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-100"
                      >
                        <div className="w-16 h-16 bg-white rounded-xl flex-shrink-0 overflow-hidden shadow-md border border-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="lv-luxury mb-2 text-xs font-bold text-primary text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <div className="flex justify-between text-xs">
                            <span className="lv-body text-gray-500 font-mono lv-transition">
                              {item.color} • {item.size}
                            </span>
                            <span className="lv-luxury text-sm font-bold text-primary">
                              $ {item.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-center text-sm text-gray-500">
                        +{order.items.length - 2} more item
                        {order.items.length - 2 > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>

                  {/* Order Total */}
                  <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl">
                    <span className="lv-luxury mb-4 text-xs font-bold text-black">
                      Total
                    </span>
                    <span className="lv-luxury mb-4 text-sm font-bold text-primary">
                      $ {order.total.toLocaleString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-6 lv-luxury mb-4 text-md font-bold">
                    <Button
                      onClick={() => handleTrackPackage(order)}
                      disabled={trackingOrder === order.id}
                      className="bg-gradient-to-r from-[#0b3e27] to-[#197149] text-white px-4 py-2 rounded-full font-bold flex items-center justify-center gap-2"
                    >
                      <Truck className="w-4 h-4" />
                      {trackingOrder === order.id ? "Tracking..." : "Track"}
                    </Button>
                    <Button
                      onClick={() => handleViewDetails(order)}
                      variant="outline"
                      className="border-2 border-gray-300 text-gray-700 hover:bg-primary/10 text-primary hover:border-primary px-4 py-2 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Details
                    </Button>
                    <Button
                      onClick={() => handleDownloadInvoice(order)}
                      variant="outline"
                      className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-4 py-2 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Invoice
                    </Button>
                    {order.status === "Delivered" && (
                      <>
                        <Button
                          onClick={() => handleLeaveReview(order)}
                          variant="outline"
                          className="border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 px-4 py-2 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                        >
                          <Star className="w-4 h-4" />
                          Review
                        </Button>
                        <Button
                          onClick={() => handleBuyAgain(order)}
                          variant="outline"
                          className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 px-4 py-2 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Buy Again
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-24">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-3xl md:text-5xl lv-luxury text-primary tracking-[0.2em] drop-shadow-2xl">
              No Orders Yet
            </h3>
            <p className="text-md md:text-xl my-8 lv-elegant delay-200 max-w-2xl mx-auto font-mono leading-relaxed">
              Discover our exquisite collection of luxury items and start your
              shopping journey.
            </p>
            <Button
              onClick={() => navigate("/products")}
              className="lv-luxury font-bold text-primary rounded-full items-center justify-center bg-primary hover:shadow-xl transition-all h-10 uppercase text-sm text-white px-12 py-6"
            >
              Explore Collection
            </Button>
          </div>
        )}

        {/* Services Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="lv-luxury mb-4 text-md font-bold text-primary">
              Real-Time Tracking
            </h4>
            <p className="lv-body text-gray-500 text-xs font-mono lv-transition">
              Monitor your orders every step of the way with live updates and
              notifications.
            </p>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h4 className="lv-luxury mb-4 text-md font-bold text-primary">
              Express Checkout
            </h4>
            <p className="lv-body text-gray-500 text-xs font-mono lv-transition">
              Streamlined checkout process with saved preferences and one-click
              ordering.
            </p>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <RotateCcw className="w-8 h-8 text-amber-600" />
            </div>
            <h4 className="lv-luxury mb-4 text-md font-bold text-primary">
              Hassle-Free Returns
            </h4>
            <p className="lv-body text-gray-500 text-xs font-mono lv-transition">
              Easy returns and exchanges within 30 days with complimentary
              shipping.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
