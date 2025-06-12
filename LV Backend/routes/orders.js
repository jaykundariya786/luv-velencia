const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { verifyToken, requireAdmin, checkOwnership } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/orders
// @desc    Get orders (user's own orders or all orders for admin)
// @access  Private
router.get('/', verifyToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'returned']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      status,
      startDate,
      endDate,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = {};

    // Non-admin users can only see their own orders
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      query.user = req.user._id;
    }

    if (status) query.status = status;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name slug images')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name slug images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check ownership (non-admin users can only see their own orders)
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && 
        order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', verifyToken, [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.variant.size').optional().notEmpty().withMessage('Size is required'),
  body('items.*.variant.color').optional().notEmpty().withMessage('Color is required'),
  body('shippingAddress.firstName').notEmpty().withMessage('First name is required'),
  body('shippingAddress.lastName').notEmpty().withMessage('Last name is required'),
  body('shippingAddress.address1').notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.country').notEmpty().withMessage('Country is required'),
  body('payment.method').isIn(['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay']).withMessage('Valid payment method is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { items, shippingAddress, billingAddress, payment, customerNotes } = req.body;

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || product.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product} not found or inactive`
        });
      }

      // Check stock availability
      if (item.variant && item.variant.sku) {
        const variant = product.variants.find(v => v.sku === item.variant.sku);
        if (!variant || variant.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name} - ${item.variant.size} ${item.variant.color}`
          });
        }
      } else if (product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      const price = product.currentPrice;
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        variant: item.variant,
        quantity: item.quantity,
        price: price,
        total: itemTotal
      });
    }

    // Calculate shipping and tax
    const shippingCost = subtotal >= 100 ? 0 : 9.99; // Free shipping over $100
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shippingCost + tax;

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      subtotal,
      shipping: {
        method: 'standard',
        cost: shippingCost,
        estimatedDays: 5
      },
      tax,
      total,
      payment: {
        method: payment.method,
        amount: total,
        status: 'pending'
      },
      customerNotes
    });

    await order.save();

    // Update product stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (item.variant && item.variant.sku) {
        const variantIndex = product.variants.findIndex(v => v.sku === item.variant.sku);
        if (variantIndex !== -1) {
          product.variants[variantIndex].stock -= item.quantity;
        }
      }
      product.purchases += item.quantity;
      await product.save();
    }

    // Update user statistics
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        totalOrders: 1,
        totalSpent: total,
        loyaltyPoints: Math.floor(total)
      }
    });

    await order.populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'items.product', select: 'name slug images' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', [verifyToken, requireAdmin], [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'returned']).withMessage('Valid status is required'),
  body('trackingNumber').optional().notEmpty().withMessage('Tracking number cannot be empty'),
  body('carrier').optional().notEmpty().withMessage('Carrier cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, trackingNumber, carrier, internalNotes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update tracking info if provided
    if (trackingNumber || carrier) {
      order.tracking = {
        ...order.tracking,
        trackingNumber: trackingNumber || order.tracking.trackingNumber,
        carrier: carrier || order.tracking.carrier,
        status: status === 'shipped' ? 'picked_up' : order.tracking.status
      };
    }

    if (internalNotes) {
      order.internalNotes = internalNotes;
    }

    await order.updateStatus(status);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check ownership (non-admin users can only cancel their own orders)
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && 
        order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if order can be cancelled
    if (!order.canBeCancelled) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    await order.updateStatus('cancelled');

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product && item.variant && item.variant.sku) {
        const variantIndex = product.variants.findIndex(v => v.sku === item.variant.sku);
        if (variantIndex !== -1) {
          product.variants[variantIndex].stock += item.quantity;
        }
      }
      if (product) {
        product.purchases = Math.max(0, product.purchases - item.quantity);
        await product.save();
      }
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order'
    });
  }
});

// @route   POST /api/orders/:id/return
// @desc    Request order return
// @access  Private
router.post('/:id/return', verifyToken, [
  body('reason').notEmpty().withMessage('Return reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check ownership
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if order can be returned
    if (!order.canBeReturned) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be returned at this stage or return period has expired'
      });
    }

    order.returnStatus = 'requested';
    order.returnReason = req.body.reason;
    order.returnRequestedAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: 'Return request submitted successfully'
    });
  } catch (error) {
    console.error('Request return error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while requesting return'
    });
  }
});

// @route   GET /api/orders/statistics
// @desc    Get order statistics
// @access  Private/Admin
router.get('/admin/statistics', [verifyToken, requireAdmin], [
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { startDate, endDate } = req.query;
    const statistics = await Order.getStatistics(startDate, endDate);

    res.json({
      success: true,
      data: { statistics }
    });
  } catch (error) {
    console.error('Get order statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order statistics'
    });
  }
});

module.exports = router;