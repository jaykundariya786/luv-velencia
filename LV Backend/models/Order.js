const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variant: {
    size: String,
    color: String,
    sku: String
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  }
});

const shippingAddressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: String,
  address1: { type: String, required: true },
  address2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: String
});

const billingAddressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: String,
  address1: { type: String, required: true },
  address2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: String,
  email: String
});

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay', 'bank_transfer', 'gift_card'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  transactionId: String,
  paymentProcessor: String,
  processorTransactionId: String,
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paidAt: Date,
  refunds: [{
    amount: Number,
    reason: String,
    refundedAt: Date,
    transactionId: String
  }]
});

const trackingSchema = new mongoose.Schema({
  carrier: String,
  trackingNumber: String,
  trackingUrl: String,
  status: {
    type: String,
    enum: ['label_created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'exception', 'returned'],
    default: 'label_created'
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  updates: [{
    status: String,
    location: String,
    description: String,
    timestamp: Date
  }]
});

const orderSchema = new mongoose.Schema({
  // Order Identification
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  
  // Customer Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  guestEmail: String, // For guest checkout
  
  // Order Items
  items: [orderItemSchema],
  
  // Addresses
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  billingAddress: {
    type: billingAddressSchema,
    required: true
  },
  
  // Order Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'returned'],
    default: 'pending'
  },
  
  // Financial Information
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shipping: {
    method: String,
    cost: {
      type: Number,
      default: 0
    },
    estimatedDays: Number
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    amount: {
      type: Number,
      default: 0
    },
    code: String,
    type: {
      type: String,
      enum: ['percentage', 'fixed_amount', 'free_shipping']
    }
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  
  // Payment Information
  payment: paymentSchema,
  
  // Shipping & Tracking
  tracking: trackingSchema,
  
  // Order Notes
  customerNotes: String,
  internalNotes: String,
  
  // Fulfillment
  fulfillmentStatus: {
    type: String,
    enum: ['unfulfilled', 'partially_fulfilled', 'fulfilled'],
    default: 'unfulfilled'
  },
  shippedAt: Date,
  deliveredAt: Date,
  
  // Returns & Exchanges
  returnStatus: {
    type: String,
    enum: ['none', 'requested', 'approved', 'denied', 'received', 'processed'],
    default: 'none'
  },
  returnReason: String,
  returnRequestedAt: Date,
  
  // Communication
  emailsSent: [{
    type: {
      type: String,
      enum: ['confirmation', 'shipped', 'delivered', 'cancelled', 'refund', 'return_approved']
    },
    sentAt: Date,
    successful: Boolean
  }],
  
  // Analytics
  source: {
    type: String,
    enum: ['website', 'mobile_app', 'phone', 'in_store', 'marketplace'],
    default: 'website'
  },
  channel: String,
  campaignId: String,
  
  // Important Dates
  confirmedAt: Date,
  cancelledAt: Date,
  refundedAt: Date

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes (orderNumber already has unique: true which creates an index)
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ fulfillmentStatus: 1 });
orderSchema.index({ 'tracking.trackingNumber': 1 });

// Virtual for order age in days
orderSchema.virtual('ageInDays').get(function() {
  return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for can be cancelled
orderSchema.virtual('canBeCancelled').get(function() {
  return ['pending', 'confirmed'].includes(this.status);
});

// Virtual for can be returned
orderSchema.virtual('canBeReturned').get(function() {
  const deliveredDate = this.deliveredAt;
  if (!deliveredDate || this.status !== 'delivered') return false;
  
  const daysSinceDelivery = Math.floor((new Date() - deliveredDate) / (1000 * 60 * 60 * 24));
  return daysSinceDelivery <= 30; // 30-day return policy
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the last order number for today
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    
    const lastOrder = await this.constructor.findOne({
      createdAt: { $gte: todayStart, $lt: todayEnd }
    }).sort({ createdAt: -1 });
    
    let sequence = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-3));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `LV${year}${month}${day}${sequence.toString().padStart(3, '0')}`;
  }
  next();
});

// Static method to get order statistics
orderSchema.statics.getStatistics = async function(startDate, endDate) {
  const matchStage = {};
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' },
        pendingOrders: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        confirmedOrders: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
        shippedOrders: { $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] } },
        deliveredOrders: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
        cancelledOrders: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } }
      }
    }
  ]);

  return stats[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0
  };
};

// Static method to get orders by status
orderSchema.statics.findByStatus = function(status, options = {}) {
  const { page = 1, limit = 20, sort = '-createdAt' } = options;
  
  return this.find({ status })
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name slug')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Instance method to update status with automatic timestamps
orderSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  
  switch (newStatus) {
    case 'confirmed':
      this.confirmedAt = new Date();
      break;
    case 'shipped':
      this.shippedAt = new Date();
      this.fulfillmentStatus = 'fulfilled';
      break;
    case 'delivered':
      this.deliveredAt = new Date();
      break;
    case 'cancelled':
      this.cancelledAt = new Date();
      break;
    case 'refunded':
      this.refundedAt = new Date();
      break;
  }
  
  return this.save();
};

// Instance method to calculate totals
orderSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.total = this.subtotal + this.shipping.cost + this.tax - this.discount.amount;
  return this;
};

module.exports = mongoose.model('Order', orderSchema);