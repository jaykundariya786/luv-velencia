const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { verifyToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Mock products for when database is not available
const mockProducts = [
  {
    _id: '1',
    name: 'Luxury Silk Shirt',
    slug: 'luxury-silk-shirt',
    description: 'Premium silk shirt with elegant design',
    category: { name: 'Shirts', slug: 'shirts' },
    basePrice: 299.99,
    salePrice: 249.99,
    isOnSale: true,
    totalStock: 15,
    status: 'active',
    isFeature: true,
    isBestseller: false,
    isNewArrival: true,
    averageRating: 4.8,
    totalReviews: 24,
    variants: [{
      size: 'M',
      color: 'White',
      sku: 'LSS-001-M-WHITE',
      price: 299.99,
      salePrice: 249.99,
      stock: 5,
      images: [{
        url: 'https://via.placeholder.com/400x500/f8f9fa/6c757d?text=Luxury+Shirt',
        alt: 'Luxury Silk Shirt',
        isPrimary: true
      }]
    }],
    images: [{
      url: 'https://via.placeholder.com/400x500/f8f9fa/6c757d?text=Luxury+Shirt',
      alt: 'Luxury Silk Shirt',
      isPrimary: true
    }]
  },
  {
    _id: '2',
    name: 'Classic Wool Coat',
    slug: 'classic-wool-coat',
    description: 'Timeless wool coat for sophisticated style',
    category: { name: 'Coats', slug: 'coats' },
    basePrice: 699.99,
    totalStock: 8,
    status: 'active',
    isFeature: false,
    isBestseller: true,
    isNewArrival: false,
    averageRating: 4.9,
    totalReviews: 31,
    variants: [{
      size: 'L',
      color: 'Black',
      sku: 'CWC-002-L-BLACK',
      price: 699.99,
      stock: 3,
      images: [{
        url: 'https://via.placeholder.com/400x500/212529/adb5bd?text=Wool+Coat',
        alt: 'Classic Wool Coat',
        isPrimary: true
      }]
    }],
    images: [{
      url: 'https://via.placeholder.com/400x500/212529/adb5bd?text=Wool+Coat',
      alt: 'Classic Wool Coat',
      isPrimary: true
    }]
  }
];

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isMongoId().withMessage('Invalid category ID'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('sort').optional().isIn(['price', '-price', 'name', '-name', 'createdAt', '-createdAt', 'rating', '-rating']).withMessage('Invalid sort option')
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

    // Check if MongoDB is connected
    if (!process.env.MONGODB_URI || require('mongoose').connection.readyState !== 1) {
      console.log('[LV Backend] Using mock products data');
      const { page = 1, limit = 20, featured, bestseller, newArrival } = req.query;
      
      let filteredProducts = [...mockProducts];
      
      if (featured === 'true') filteredProducts = filteredProducts.filter(p => p.isFeature);
      if (bestseller === 'true') filteredProducts = filteredProducts.filter(p => p.isBestseller);
      if (newArrival === 'true') filteredProducts = filteredProducts.filter(p => p.isNewArrival);
      
      return res.json({
        success: true,
        data: {
          products: filteredProducts,
          pagination: {
            currentPage: parseInt(page),
            totalPages: 1,
            totalProducts: filteredProducts.length,
            hasNextPage: false,
            hasPrevPage: false,
            limit: parseInt(limit)
          }
        }
      });
    }

    const {
      page = 1,
      limit = 20,
      category,
      subcategory,
      minPrice,
      maxPrice,
      tags,
      line,
      sort = '-createdAt',
      search,
      featured,
      bestseller,
      newArrival,
      inStock = true
    } = req.query;

    // Build query
    const query = { status: 'active' };

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (line) query.line = line;
    if (featured === 'true') query.isFeature = true;
    if (bestseller === 'true') query.isBestseller = true;
    if (newArrival === 'true') query.isNewArrival = true;
    if (inStock === 'true') query.totalStock = { $gt: 0 };

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      query.tags = { $in: tagArray };
    }

    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.basePrice.$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Execute query
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts: total,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
});

// @route   GET /api/products/search
// @desc    Search products
// @access  Public
router.get('/search', [
  query('q').exists().withMessage('Search query is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
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

    const { q, page = 1, limit = 20, category, minPrice, maxPrice, tags, line } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      tags: tags ? tags.split(',') : undefined,
      line
    };

    const products = await Product.searchProducts(q, options);
    const total = await Product.countDocuments({
      $text: { $search: q },
      status: 'active'
    });

    res.json({
      success: true,
      data: {
        products,
        searchQuery: q,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching products'
    });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({
      status: 'active',
      isFeature: true,
      totalStock: { $gt: 0 }
    })
      .populate('category', 'name slug')
      .sort('-createdAt')
      .limit(12)
      .lean();

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured products'
    });
  }
});

// @route   GET /api/products/bestsellers
// @desc    Get bestseller products
// @access  Public
router.get('/bestsellers', async (req, res) => {
  try {
    const products = await Product.find({
      status: 'active',
      isBestseller: true,
      totalStock: { $gt: 0 }
    })
      .populate('category', 'name slug')
      .sort('-purchases')
      .limit(12)
      .lean();

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get bestsellers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bestseller products'
    });
  }
});

// @route   GET /api/products/new-arrivals
// @desc    Get new arrival products
// @access  Public
router.get('/new-arrivals', async (req, res) => {
  try {
    const products = await Product.find({
      status: 'active',
      isNewArrival: true,
      totalStock: { $gt: 0 }
    })
      .populate('category', 'name slug')
      .sort('-createdAt')
      .limit(12)
      .lean();

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get new arrivals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching new arrival products'
    });
  }
});

// @route   GET /api/products/search-suggestions
// @desc    Get search suggestions
// @access  Public
router.get('/search-suggestions', [
  query('q').optional().isLength({ min: 1 }).withMessage('Search query required')
], async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.json({
        success: true,
        data: { suggestions: [] }
      });
    }

    // Get product name suggestions
    const productSuggestions = await Product.find({
      status: 'active',
      $text: { $search: q }
    })
      .select('name slug')
      .limit(5)
      .lean();

    // Get category suggestions
    const categorySuggestions = await Category.find({
      name: { $regex: q, $options: 'i' },
      status: 'active'
    })
      .select('name slug')
      .limit(3)
      .lean();

    const suggestions = [
      ...productSuggestions.map(p => ({ type: 'product', name: p.name, slug: p.slug })),
      ...categorySuggestions.map(c => ({ type: 'category', name: c.name, slug: c.slug }))
    ];

    res.json({
      success: true,
      data: { suggestions }
    });
  } catch (error) {
    console.error('Get search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching search suggestions'
    });
  }
});

// @route   GET /api/products/:slug
// @desc    Get single product by slug
// @access  Public
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      status: 'active'
    })
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .populate('relatedProducts', 'name slug basePrice salePrice images')
      .populate({
        path: 'reviews.user',
        select: 'firstName lastName'
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    await product.incrementViews();

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private/Admin
router.post('/', [verifyToken, requireAdmin], [
  body('name').trim().isLength({ min: 1 }).withMessage('Product name is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required'),
  body('category').isMongoId().withMessage('Valid category is required'),
  body('basePrice').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
  body('variants').isArray({ min: 1 }).withMessage('At least one variant is required')
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

    // Check if category exists
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Generate slug from name
    const slug = req.body.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this name already exists'
      });
    }

    const product = new Product({
      ...req.body,
      slug
    });

    await product.save();
    await product.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product'
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin
router.put('/:id', [verifyToken, requireAdmin], [
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Product name cannot be empty'),
  body('description').optional().trim().isLength({ min: 1 }).withMessage('Description cannot be empty'),
  body('category').optional().isMongoId().withMessage('Valid category is required'),
  body('basePrice').optional().isFloat({ min: 0 }).withMessage('Base price must be a positive number')
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

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // If name is being updated, regenerate slug
    if (req.body.name && req.body.name !== product.name) {
      const newSlug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      const existingProduct = await Product.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Product with this name already exists'
        });
      }
      req.body.slug = newSlug;
    }

    // If category is being updated, check if it exists
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete('/:id', [verifyToken, requireAdmin], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Soft delete by changing status
    product.status = 'discontinued';
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Add product review
// @access  Private
router.post('/:id/reviews', [verifyToken], [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Review title is required and must be under 100 characters'),
  body('comment').trim().isLength({ min: 1, max: 1000 }).withMessage('Review comment is required and must be under 1000 characters')
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

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
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

    const review = {
      user: req.user._id,
      rating: req.body.rating,
      title: req.body.title,
      comment: req.body.comment,
      images: req.body.images || []
    };

    await product.addReview(review);

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding review'
    });
  }
});

module.exports = router;