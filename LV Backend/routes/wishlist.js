const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'wishlist',
        match: { status: 'active' },
        select: 'name slug basePrice salePrice images averageRating totalReviews totalStock isOnSale'
      });

    res.json({
      success: true,
      data: { wishlist: user.wishlist }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching wishlist'
    });
  }
});

// @route   POST /api/wishlist/add
// @desc    Add product to wishlist
// @access  Private
router.post('/add', verifyToken, [
  body('productId').isMongoId().withMessage('Valid product ID is required')
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

    const { productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Product not found or inactive'
      });
    }

    const user = await User.findById(req.user._id);

    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();

    // Update product analytics
    product.addedToWishlist += 1;
    await product.save();

    res.json({
      success: true,
      message: 'Product added to wishlist successfully'
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to wishlist'
    });
  }
});

// @route   DELETE /api/wishlist/remove/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/remove/:productId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Check if product is in wishlist
    if (!user.wishlist.includes(req.params.productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product not in wishlist'
      });
    }

    // Remove from wishlist
    user.wishlist.pull(req.params.productId);
    await user.save();

    // Update product analytics
    const product = await Product.findById(req.params.productId);
    if (product) {
      product.addedToWishlist = Math.max(0, product.addedToWishlist - 1);
      await product.save();
    }

    res.json({
      success: true,
      message: 'Product removed from wishlist successfully'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from wishlist'
    });
  }
});

// @route   DELETE /api/wishlist/clear
// @desc    Clear wishlist
// @access  Private
router.delete('/clear', verifyToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { wishlist: [] }
    );

    res.json({
      success: true,
      message: 'Wishlist cleared successfully'
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing wishlist'
    });
  }
});

module.exports = router;