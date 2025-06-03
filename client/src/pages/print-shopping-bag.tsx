import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShoppingBagContext } from "../contexts/shopping-bag-context";
import { Printer } from "lucide-react";

export default function PrintShoppingBag() {
  const navigate = useNavigate();
  const { items, getTotalPrice } = useShoppingBagContext();

  useEffect(() => {
    // Auto-print when component loads
    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = getTotalPrice();
  const shipping = 0; // Free Premium Express
  const tax = 0; // $0.00 as shown in image
  const total = subtotal;

  return (
    <div className="min-h-screen bg-white p-8 print:p-0">
      {/* Print Header */}
      <div className="max-w-4xl mx-auto">
        {/* Header with Logo and Print Button */}
        <div className="flex justify-between items-start mb-8 print:mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-[0.2em] mb-4">GUCCI</h1>
          </div>
          <div className="flex items-center gap-4 print:hidden">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button 
              onClick={() => navigate('/shopping-bag')}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Back
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex justify-between text-sm mb-8 print:mb-6">
          <div className="flex items-center gap-4">
            <span>📞 +1.877.482.2430</span>
            <span>|</span>
            <span>✉️ assistance@us-onlineshopping.gucci.com</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-8 print:mb-6">
          <h2 className="text-3xl font-bold tracking-[0.1em] mb-4">MY SHOPPING BAG</h2>
          <p className="text-sm font-semibold">BAG #USCART412345045</p>
        </div>

        {/* Items List */}
        <div className="space-y-8 mb-12">
          {items.map((item, index) => (
            <div key={`${item.id}-${item.size}`} className="border-b border-gray-200 pb-8 last:border-b-0">
              <div className="grid grid-cols-4 gap-8 items-start">
                {/* Product Image */}
                <div className="col-span-1">
                  <div className="aspect-square bg-gray-50 rounded overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="col-span-2 space-y-2">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm font-semibold">Style # {item.style}</p>
                  <p className="text-sm font-semibold">Style: light blue</p>
                  <p className="text-sm font-semibold">size: {item.size}</p>
                  <div className="mt-4">
                    <p className="text-sm font-bold text-green-600">AVAILABLE</p>
                    <p className="text-xs font-semibold text-gray-600">
                      Enjoy complimentary delivery or Collect In Store.
                    </p>
                  </div>
                </div>

                {/* Price and Quantity */}
                <div className="col-span-1 text-right">
                  <div className="text-xl font-bold mb-2">{formatPrice(item.price)}</div>
                  <p className="text-sm font-semibold">Qty: {item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-300 pt-8">
          <div className="max-w-md ml-auto space-y-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            <div className="flex justify-between text-lg font-bold">
              <span>Shipping</span>
              <span>Free (Premium Express)</span>
            </div>
            
            <div className="flex justify-between text-lg font-bold">
              <span>Estimated Tax</span>
              <span>$0.00</span>
            </div>
            
            <div className="border-t border-gray-300 pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Estimated Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer spacing for print */}
        <div className="h-16 print:h-8"></div>
      </div>

      {/* Print-specific styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body { 
              font-family: 'Inter', sans-serif !important;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
          }
        `
      }} />
    </div>
  );
}