const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luv-valencia');
    console.log('✅ Connected to MongoDB for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedCategories = async () => {
  console.log('🌱 Seeding categories...');
  
  const categories = [
    {
      name: 'T-Shirts',
      slug: 't-shirts',
      description: 'Comfortable and stylish t-shirts for everyday wear',
      status: 'active',
      sortOrder: 1,
      isFeature: true
    },
    {
      name: 'Shirts',
      slug: 'shirts',
      description: 'Elegant shirts for formal and casual occasions',
      status: 'active',
      sortOrder: 2,
      isFeature: true
    },
    {
      name: 'Jeans',
      slug: 'jeans',
      description: 'Premium denim jeans with perfect fit',
      status: 'active',
      sortOrder: 3,
      isFeature: true
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Complete your look with our luxury accessories',
      status: 'active',
      sortOrder: 4,
      isFeature: false
    }
  ];

  await Category.deleteMany({});
  const createdCategories = await Category.insertMany(categories);
  console.log(`✅ Created ${createdCategories.length} categories`);
  return createdCategories;
};

const seedProducts = async (categories) => {
  console.log('🌱 Seeding products...');
  
  const tShirtCategory = categories.find(cat => cat.slug === 't-shirts');
  const shirtCategory = categories.find(cat => cat.slug === 'shirts');
  const jeansCategory = categories.find(cat => cat.slug === 'jeans');

  const products = [
    // T-Shirts
    {
      name: 'Oversized Premium T-Shirt',
      slug: 'oversized-premium-t-shirt',
      description: 'Ultra-comfortable oversized t-shirt made from premium organic cotton. Features a relaxed fit perfect for casual wear.',
      shortDescription: 'Premium organic cotton oversized tee',
      category: tShirtCategory._id,
      basePrice: 89.99,
      line: 'casual',
      tags: ['oversized', 'premium', 'organic'],
      status: 'active',
      isFeature: true,
      isBestseller: true,
      isNewArrival: true,
      variants: [
        {
          size: 'S',
          color: 'Black',
          colorCode: '#000000',
          sku: 'LV-TS-001-S-BLK',
          price: 89.99,
          stock: 25,
          images: [{
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
            alt: 'Black oversized premium t-shirt',
            isPrimary: true
          }]
        },
        {
          size: 'M',
          color: 'Black',
          colorCode: '#000000',
          sku: 'LV-TS-001-M-BLK',
          price: 89.99,
          stock: 30,
          images: [{
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
            alt: 'Black oversized premium t-shirt',
            isPrimary: true
          }]
        },
        {
          size: 'L',
          color: 'White',
          colorCode: '#FFFFFF',
          sku: 'LV-TS-001-L-WHT',
          price: 89.99,
          stock: 20,
          images: [{
            url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500',
            alt: 'White oversized premium t-shirt',
            isPrimary: true
          }]
        }
      ],
      materials: [
        { name: 'Organic Cotton', percentage: 100 }
      ],
      care: ['Machine wash cold', 'Tumble dry low', 'Do not bleach'],
      features: ['Oversized fit', 'Premium organic cotton', 'Sustainable production'],
      specifications: {
        fit: 'Oversized',
        origin: 'Portugal',
        season: ['Spring', 'Summer', 'Fall'],
        occasion: ['Casual', 'Weekend']
      }
    },
    {
      name: 'Classic Crew Neck T-Shirt',
      slug: 'classic-crew-neck-t-shirt',
      description: 'Timeless crew neck t-shirt crafted from soft cotton blend. Essential wardrobe staple with perfect fit.',
      shortDescription: 'Classic crew neck cotton tee',
      category: tShirtCategory._id,
      basePrice: 59.99,
      line: 'basic',
      tags: ['classic', 'crew neck', 'essential'],
      status: 'active',
      isBestseller: true,
      variants: [
        {
          size: 'S',
          color: 'Navy',
          colorCode: '#000080',
          sku: 'LV-TS-002-S-NVY',
          price: 59.99,
          stock: 15,
          images: [{
            url: 'https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=500',
            alt: 'Navy classic crew neck t-shirt',
            isPrimary: true
          }]
        },
        {
          size: 'M',
          color: 'Grey',
          colorCode: '#808080',
          sku: 'LV-TS-002-M-GRY',
          price: 59.99,
          stock: 18,
          images: [{
            url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500',
            alt: 'Grey classic crew neck t-shirt',
            isPrimary: true
          }]
        }
      ],
      materials: [
        { name: 'Cotton', percentage: 95 },
        { name: 'Elastane', percentage: 5 }
      ],
      care: ['Machine wash cold', 'Tumble dry low'],
      features: ['Classic fit', 'Soft cotton blend', 'Reinforced seams'],
      specifications: {
        fit: 'Regular',
        origin: 'Turkey',
        season: ['All seasons'],
        occasion: ['Casual', 'Everyday']
      }
    },
    // Shirts
    {
      name: 'Premium Oxford Shirt',
      slug: 'premium-oxford-shirt',
      description: 'Sophisticated oxford shirt made from finest cotton. Perfect for business and smart casual occasions.',
      shortDescription: 'Premium cotton oxford shirt',
      category: shirtCategory._id,
      basePrice: 149.99,
      salePrice: 119.99,
      isOnSale: true,
      line: 'formal',
      tags: ['oxford', 'premium', 'business'],
      status: 'active',
      isFeature: true,
      variants: [
        {
          size: 'M',
          color: 'Light Blue',
          colorCode: '#ADD8E6',
          sku: 'LV-SH-001-M-LBL',
          price: 119.99,
          stock: 12,
          images: [{
            url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
            alt: 'Light blue premium oxford shirt',
            isPrimary: true
          }]
        },
        {
          size: 'L',
          color: 'White',
          colorCode: '#FFFFFF',
          sku: 'LV-SH-001-L-WHT',
          price: 119.99,
          stock: 10,
          images: [{
            url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500',
            alt: 'White premium oxford shirt',
            isPrimary: true
          }]
        }
      ],
      materials: [
        { name: 'Cotton', percentage: 100 }
      ],
      care: ['Dry clean recommended', 'Iron on medium heat'],
      features: ['Button-down collar', 'Chest pocket', 'Premium cotton'],
      specifications: {
        fit: 'Slim',
        origin: 'Italy',
        season: ['All seasons'],
        occasion: ['Business', 'Smart casual']
      }
    },
    // Jeans
    {
      name: 'Slim Fit Dark Wash Jeans',
      slug: 'slim-fit-dark-wash-jeans',
      description: 'Premium slim fit jeans in dark indigo wash. Crafted from premium denim with perfect stretch.',
      shortDescription: 'Slim fit dark wash premium jeans',
      category: jeansCategory._id,
      basePrice: 199.99,
      line: 'modern',
      tags: ['slim fit', 'dark wash', 'premium denim'],
      status: 'active',
      isFeature: true,
      isBestseller: true,
      variants: [
        {
          size: '30',
          color: 'Dark Indigo',
          colorCode: '#1E3A8A',
          sku: 'LV-JN-001-30-DIN',
          price: 199.99,
          stock: 8,
          images: [{
            url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
            alt: 'Dark indigo slim fit jeans',
            isPrimary: true
          }]
        },
        {
          size: '32',
          color: 'Dark Indigo',
          colorCode: '#1E3A8A',
          sku: 'LV-JN-001-32-DIN',
          price: 199.99,
          stock: 12,
          images: [{
            url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
            alt: 'Dark indigo slim fit jeans',
            isPrimary: true
          }]
        },
        {
          size: '34',
          color: 'Black',
          colorCode: '#000000',
          sku: 'LV-JN-001-34-BLK',
          price: 199.99,
          stock: 6,
          images: [{
            url: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=500',
            alt: 'Black slim fit jeans',
            isPrimary: true
          }]
        }
      ],
      materials: [
        { name: 'Cotton', percentage: 92 },
        { name: 'Polyester', percentage: 6 },
        { name: 'Elastane', percentage: 2 }
      ],
      care: ['Machine wash cold', 'Hang dry', 'Iron inside out'],
      features: ['Slim fit', 'Stretch denim', 'Five-pocket styling'],
      specifications: {
        fit: 'Slim',
        origin: 'Japan',
        season: ['All seasons'],
        occasion: ['Casual', 'Smart casual']
      }
    }
  ];

  await Product.deleteMany({});
  const createdProducts = await Product.insertMany(products);
  console.log(`✅ Created ${createdProducts.length} products`);
  return createdProducts;
};

const seedUsers = async () => {
  console.log('🌱 Seeding users...');
  
  const users = [
    {
      firstName: 'Admin',
      lastName: 'User',
      email: process.env.ADMIN_EMAIL || 'admin@luvvalencia.com',
      password: process.env.ADMIN_PASSWORD || 'SecureAdminPassword123!',
      role: 'superadmin',
      isActive: true,
      isEmailVerified: true,
      tier: 'platinum',
      totalSpent: 15000,
      totalOrders: 25,
      loyaltyPoints: 15000
    },
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'UserPassword123!',
      role: 'customer',
      isActive: true,
      isEmailVerified: true,
      phone: '+1234567890',
      tier: 'gold',
      totalSpent: 2500,
      totalOrders: 8,
      loyaltyPoints: 2500,
      addresses: [{
        type: 'both',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
        phone: '+1234567890',
        isDefault: true
      }]
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      password: 'UserPassword123!',
      role: 'customer',
      isActive: true,
      isEmailVerified: true,
      tier: 'silver',
      totalSpent: 800,
      totalOrders: 3,
      loyaltyPoints: 800
    }
  ];

  await User.deleteMany({});
  const createdUsers = await User.insertMany(users);
  console.log(`✅ Created ${createdUsers.length} users`);
  return createdUsers;
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🚀 Starting database seeding...');
    
    const categories = await seedCategories();
    const products = await seedProducts(categories);
    const users = await seedUsers();
    
    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Products: ${products.length}`);
    console.log(`   Users: ${users.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedCategories, seedProducts, seedUsers };