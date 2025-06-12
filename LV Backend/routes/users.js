const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist', 'name slug basePrice salePrice images')
      .select('-password');

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', verifyToken, [
  body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name cannot be empty'),
  body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Please enter a valid phone number'),
  body('dateOfBirth').optional().isISO8601().withMessage('Please enter a valid date'),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer-not-to-say']).withMessage('Invalid gender')
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

    const allowedUpdates = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'gender', 'preferences'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @route   POST /api/users/addresses
// @desc    Add new address
// @access  Private
router.post('/addresses', verifyToken, [
  body('type').isIn(['billing', 'shipping', 'both']).withMessage('Valid address type is required'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('address1').trim().isLength({ min: 1 }).withMessage('Address is required'),
  body('city').trim().isLength({ min: 1 }).withMessage('City is required'),
  body('state').trim().isLength({ min: 1 }).withMessage('State is required'),
  body('zipCode').trim().isLength({ min: 1 }).withMessage('Zip code is required'),
  body('country').trim().isLength({ min: 1 }).withMessage('Country is required')
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

    const user = await User.findById(req.user._id);
    
    // If this is the first address or marked as default, set as default
    if (user.addresses.length === 0 || req.body.isDefault) {
      // Remove default from other addresses
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
      req.body.isDefault = true;
    }

    user.addresses.push(req.body);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: { addresses: user.addresses }
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding address'
    });
  }
});

// @route   PUT /api/users/addresses/:addressId
// @desc    Update address
// @access  Private
router.put('/addresses/:addressId', verifyToken, [
  body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name cannot be empty'),
  body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
  body('address1').optional().trim().isLength({ min: 1 }).withMessage('Address cannot be empty'),
  body('city').optional().trim().isLength({ min: 1 }).withMessage('City cannot be empty'),
  body('state').optional().trim().isLength({ min: 1 }).withMessage('State cannot be empty'),
  body('zipCode').optional().trim().isLength({ min: 1 }).withMessage('Zip code cannot be empty'),
  body('country').optional().trim().isLength({ min: 1 }).withMessage('Country cannot be empty')
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

    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Update address fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        address[key] = req.body[key];
      }
    });

    // If setting as default, remove default from others
    if (req.body.isDefault) {
      user.addresses.forEach(addr => {
        if (addr._id.toString() !== req.params.addressId) {
          addr.isDefault = false;
        }
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: { addresses: user.addresses }
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating address'
    });
  }
});

// @route   DELETE /api/users/addresses/:addressId
// @desc    Delete address
// @access  Private
router.delete('/addresses/:addressId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const wasDefault = address.isDefault;
    user.addresses.pull(req.params.addressId);

    // If deleted address was default, set first remaining address as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully',
      data: { addresses: user.addresses }
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting address'
    });
  }
});

// @route   GET /api/users/orders
// @desc    Get user's orders
// @access  Private
router.get('/orders', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user._id };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('items.product', 'name slug images')
      .sort('-createdAt')
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
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// @route   GET /api/users/loyalty
// @desc    Get user's loyalty information
// @access  Private
router.get('/loyalty', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('loyaltyPoints tier totalSpent totalOrders');

    // Calculate points needed for next tier
    const tierThresholds = {
      bronze: { min: 0, max: 999, next: 'silver', pointsNeeded: 1000 },
      silver: { min: 1000, max: 4999, next: 'gold', pointsNeeded: 5000 },
      gold: { min: 5000, max: 9999, next: 'platinum', pointsNeeded: 10000 },
      platinum: { min: 10000, max: Infinity, next: null, pointsNeeded: null }
    };

    const currentTier = tierThresholds[user.tier];
    const pointsToNextTier = currentTier.next ? 
      currentTier.pointsNeeded - user.totalSpent : null;

    res.json({
      success: true,
      data: {
        loyaltyPoints: user.loyaltyPoints,
        tier: user.tier,
        totalSpent: user.totalSpent,
        totalOrders: user.totalOrders,
        pointsToNextTier,
        nextTier: currentTier.next,
        tierBenefits: {
          bronze: ['Free shipping on orders over $100'],
          silver: ['Free shipping on orders over $75', '5% birthday discount'],
          gold: ['Free shipping on all orders', '10% birthday discount', 'Early access to sales'],
          platinum: ['Free shipping and returns', '15% birthday discount', 'Early access to sales', 'Personal stylist consultation']
        }
      }
    });
  } catch (error) {
    console.error('Get loyalty info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching loyalty information'
    });
  }
});

module.exports = router;