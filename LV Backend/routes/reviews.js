const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/product/:productId', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  query('sort').optional().isIn(['newest', 'oldest', 'highest', 'lowest', 'helpful']).withMessage('Invalid sort option')
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
      limit = 10,
      rating,
      sort = 'newest'
    } = req.query;

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let reviews = product.reviews.filter(review => {
      if (rating) return review.rating === parseInt(rating);
      return true;
    });

    // Sort reviews
    switch (sort) {
      case 'newest':
        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        reviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'highest':
        reviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        reviews.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        reviews.sort((a, b) => b.helpful - a.helpful);
        break;
    }

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedReviews = reviews.slice(startIndex, endIndex);

    // Populate user data
    await Product.populate(paginatedReviews, {
      path: 'user',
      select: 'firstName lastName'
    });

    // Calculate rating distribution
    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: product.reviews.filter(review => review.rating === rating).length,
      percentage: product.reviews.length > 0 ? 
        Math.round((product.reviews.filter(review => review.rating === rating).length / product.reviews.length) * 100) : 0
    }));

    res.json({
      success: true,
      data: {
        reviews: paginatedReviews,
        summary: {
          totalReviews: product.totalReviews,
          averageRating: product.averageRating,
          ratingDistribution
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(reviews.length / limit),
          totalReviews: reviews.length,
          hasNextPage: endIndex < reviews.length,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
});

// @route   POST /api/reviews/product/:productId
// @desc    Add review to product
// @access  Private
router.post('/product/:productId', verifyToken, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Review title is required and must be under 100 characters'),
  body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Review comment must be between 10 and 1000 characters')
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

    const product = await Product.findById(req.params.productId);
    if (!product || product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Product not found or inactive'
      });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Check if user has purchased this product (verified review)
    const userOrder = await Order.findOne({
      user: req.user._id,
      'items.product': req.params.productId,
      status: 'delivered'
    });

    const review = {
      user: req.user._id,
      rating: req.body.rating,
      title: req.body.title,
      comment: req.body.comment,
      verified: !!userOrder,
      images: req.body.images || []
    };

    product.reviews.push(review);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: { verified: review.verified }
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding review'
    });
  }
});

// @route   PUT /api/reviews/:reviewId/helpful
// @desc    Mark review as helpful
// @access  Private
router.put('/:reviewId/helpful', verifyToken, async (req, res) => {
  try {
    const product = await Product.findOne({ 'reviews._id': req.params.reviewId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Prevent users from marking their own reviews as helpful
    if (review.user.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot mark your own review as helpful'
      });
    }

    review.helpful += 1;
    await product.save();

    res.json({
      success: true,
      message: 'Review marked as helpful'
    });
  } catch (error) {
    console.error('Mark review helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking review as helpful'
    });
  }
});

// @route   DELETE /api/reviews/:reviewId
// @desc    Delete review (user can delete their own, admin can delete any)
// @access  Private
router.delete('/:reviewId', verifyToken, async (req, res) => {
  try {
    const product = await Product.findOne({ 'reviews._id': req.params.reviewId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user can delete this review
    const canDelete = review.user.toString() === req.user._id.toString() || 
                     req.user.role === 'admin' || 
                     req.user.role === 'superadmin';

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    product.reviews.pull(req.params.reviewId);
    await product.save();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review'
    });
  }
});

module.exports = router;