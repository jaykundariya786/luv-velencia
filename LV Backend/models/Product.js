const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44']
  },
  color: {
    type: String,
    required: true
  },
  colorCode: String,
  sku: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  salePrice: {
    type: Number,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  images: [{
    url: { type: String, required: true },
    publicId: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  }
});

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  verified: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  images: [{
    url: String,
    publicId: String
  }]
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  
  // Categorization
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  brand: {
    type: String,
    default: 'LUV VALENCIA'
  },
  tags: [String],
  
  // Product Line/Collection
  line: {
    type: String,
    enum: ['streetwear', 'vintage', 'athletic', 'premium', 'casual', 'basic', 'graphic', 'formal', 'summer', 'smart-casual', 'comfort', 'modern', 'classic', 'slim'],
    default: 'casual'
  },
  
  // Variants (sizes, colors, etc.)
  variants: [variantSchema],
  
  // Pricing
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  salePrice: {
    type: Number,
    min: 0
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  saleStartDate: Date,
  saleEndDate: Date,
  
  // Inventory
  totalStock: {
    type: Number,
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  
  // Product Details
  materials: [{
    name: String,
    percentage: Number
  }],
  care: [String],
  features: [String],
  specifications: {
    fit: String,
    origin: String,
    season: [String],
    occasion: [String]
  },
  
  // SEO & Marketing
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'discontinued'],
    default: 'draft'
  },
  isFeature: {
    type: Boolean,
    default: false
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  
  // Reviews & Ratings
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  purchases: {
    type: Number,
    default: 0
  },
  addedToCart: {
    type: Number,
    default: 0
  },
  addedToWishlist: {
    type: Number,
    default: 0
  },
  
  // Related Products
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  
  // Shipping
  shippingInfo: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: { type: Boolean, default: false },
    shippingClass: String
  },
  
  // Dates
  launchDate: Date,
  discontinuedDate: Date

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance (slug and variants.sku already have unique: true which creates indexes)
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ isFeature: 1 });
productSchema.index({ isBestseller: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ basePrice: 1 });
productSchema.index({ averageRating: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ tags: 1 });
productSchema.index({ line: 1 });

// Text search index
productSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  'specifications.fit': 'text'
});

// Virtual for current price (considering sale)
productSchema.virtual('currentPrice').get(function() {
  if (this.isOnSale && this.salePrice && this.salePrice < this.basePrice) {
    const now = new Date();
    const saleStart = this.saleStartDate || new Date(0);
    const saleEnd = this.saleEndDate || new Date('2099-12-31');
    
    if (now >= saleStart && now <= saleEnd) {
      return this.salePrice;
    }
  }
  return this.basePrice;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.isOnSale && this.salePrice && this.salePrice < this.basePrice) {
    return Math.round(((this.basePrice - this.salePrice) / this.basePrice) * 100);
  }
  return 0;
});

// Virtual for availability
productSchema.virtual('isAvailable').get(function() {
  return this.status === 'active' && this.totalStock > 0;
});

// Virtual for low stock warning
productSchema.virtual('isLowStock').get(function() {
  return this.totalStock <= this.lowStockThreshold && this.totalStock > 0;
});

// Pre-save middleware to calculate total stock
productSchema.pre('save', function(next) {
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((total, variant) => total + variant.stock, 0);
  }
  next();
});

// Pre-save middleware to calculate average rating
productSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
    this.totalReviews = this.reviews.length;
  }
  next();
});

// Static method to get products by category
productSchema.statics.findByCategory = function(categoryId, options = {}) {
  const {
    page = 1,
    limit = 20,
    sort = '-createdAt',
    minPrice,
    maxPrice,
    inStock = true
  } = options;

  const query = { category: categoryId, status: 'active' };
  
  if (minPrice || maxPrice) {
    query.basePrice = {};
    if (minPrice) query.basePrice.$gte = minPrice;
    if (maxPrice) query.basePrice.$lte = maxPrice;
  }
  
  if (inStock) {
    query.totalStock = { $gt: 0 };
  }

  return this.find(query)
    .populate('category', 'name slug')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Static method to search products
productSchema.statics.searchProducts = function(searchTerm, options = {}) {
  const {
    page = 1,
    limit = 20,
    category,
    minPrice,
    maxPrice,
    tags,
    line
  } = options;

  const query = {
    $text: { $search: searchTerm },
    status: 'active'
  };

  if (category) query.category = category;
  if (tags && tags.length > 0) query.tags = { $in: tags };
  if (line) query.line = line;
  
  if (minPrice || maxPrice) {
    query.basePrice = {};
    if (minPrice) query.basePrice.$gte = minPrice;
    if (maxPrice) query.basePrice.$lte = maxPrice;
  }

  return this.find(query, { score: { $meta: 'textScore' } })
    .populate('category', 'name slug')
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Instance method to add review
productSchema.methods.addReview = function(reviewData) {
  this.reviews.push(reviewData);
  return this.save();
};

// Instance method to increment view count
productSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

module.exports = mongoose.model('Product', productSchema);