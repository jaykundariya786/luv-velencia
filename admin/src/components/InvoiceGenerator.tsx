
import React, { useState } from 'react';
import { Download, FileText, Printer, Mail } from 'lucide-react';

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface InvoiceData {
  orderId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customer: {
    name: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod?: string;
  notes?: string;
}

interface InvoiceGeneratorProps {
  order: any;
  onClose: () => void;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ order, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [invoiceData] = useState<InvoiceData>({
    orderId: order.id,
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customer: {
      name: order.customerName,
      email: order.customerEmail,
      address: order.shippingAddress,
    },
    items: order.items.map((item: any) => ({
      name: item.productName,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    })),
    subtotal: order.total * 0.9, // Assuming 10% tax
    tax: order.total * 0.1,
    shipping: 15.99,
    total: order.total + 15.99,
    paymentMethod: order.paymentMethod?.type || 'Credit Card',
    notes: 'Thank you for your business!',
  });

  const handleGenerateInvoice = async (format: 'pdf' | 'print') => {
    setIsGenerating(true);
    try {
      // Simulate invoice generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (format === 'pdf') {
        // In a real app, this would generate and download a PDF
        const blob = new Blob([generateInvoiceHTML()], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoiceData.invoiceNumber}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Print invoice
        const printWindow = window.open('', '_blank');
        printWindow?.document.write(generateInvoiceHTML());
        printWindow?.document.close();
        printWindow?.print();
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateInvoiceHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .invoice-header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
            .invoice-title { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .customer-info, .company-info { width: 45%; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items-table th { background-color: #f2f2f2; }
            .totals { margin-left: auto; width: 300px; }
            .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
            .total-row.final { font-weight: bold; font-size: 18px; border-top: 2px solid #000; margin-top: 10px; padding-top: 10px; }
            .notes { margin-top: 30px; font-style: italic; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div class="invoice-title">INVOICE</div>
            <div>Invoice #: ${invoiceData.invoiceNumber}</div>
            <div>Order #: ${invoiceData.orderId}</div>
            <div>Date: ${new Date(invoiceData.date).toLocaleDateString()}</div>
          </div>

          <div class="invoice-details">
            <div class="company-info">
              <h3>LUV VALENCIA</h3>
              <p>123 Fashion Street<br>
              New York, NY 10001<br>
              United States<br>
              Phone: (555) 123-4567<br>
              Email: orders@luvvalencia.com</p>
            </div>
            <div class="customer-info">
              <h3>Bill To:</h3>
              <p><strong>${invoiceData.customer.name}</strong><br>
              ${invoiceData.customer.email}<br>
              ${invoiceData.customer.address.street}<br>
              ${invoiceData.customer.address.city}, ${invoiceData.customer.address.state} ${invoiceData.customer.address.zipCode}<br>
              ${invoiceData.customer.address.country}</p>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>$${invoiceData.subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Tax (10%):</span>
              <span>$${invoiceData.tax.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Shipping:</span>
              <span>$${invoiceData.shipping.toFixed(2)}</span>
            </div>
            <div class="total-row final">
              <span>Total:</span>
              <span>$${invoiceData.total.toFixed(2)}</span>
            </div>
          </div>

          <div class="notes">
            <p><strong>Payment Method:</strong> ${invoiceData.paymentMethod}</p>
            <p><strong>Notes:</strong> ${invoiceData.notes}</p>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Generate Invoice</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Invoice Preview */}
          <div className="bg-gray-50 border rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
                <div className="text-sm text-gray-600">
                  <p>Invoice #: {invoiceData.invoiceNumber}</p>
                  <p>Order #: {invoiceData.orderId}</p>
                  <p>Date: {new Date(invoiceData.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-indigo-600 mb-2">LUV VALENCIA</h2>
                <div className="text-sm text-gray-600">
                  <p>123 Fashion Street</p>
                  <p>New York, NY 10001</p>
                  <p>orders@luvvalencia.com</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{invoiceData.customer.name}</p>
                  <p>{invoiceData.customer.email}</p>
                  <p>{invoiceData.customer.address.street}</p>
                  <p>{invoiceData.customer.address.city}, {invoiceData.customer.address.state} {invoiceData.customer.address.zipCode}</p>
                  <p>{invoiceData.customer.address.country}</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoiceData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm text-gray-900">${invoiceData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Tax (10%):</span>
                  <span className="text-sm text-gray-900">${invoiceData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Shipping:</span>
                  <span className="text-sm text-gray-900">${invoiceData.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-t border-gray-300 font-semibold">
                  <span className="text-lg text-gray-900">Total:</span>
                  <span className="text-lg text-gray-900">${invoiceData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p><strong>Payment Method:</strong> {invoiceData.paymentMethod}</p>
              <p><strong>Notes:</strong> {invoiceData.notes}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleGenerateInvoice('print')}
              disabled={isGenerating}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Invoice
            </button>
            <button
              onClick={() => handleGenerateInvoice('pdf')}
              disabled={isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {isGenerating ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Download className="w-4 h-4" />
              )}
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
