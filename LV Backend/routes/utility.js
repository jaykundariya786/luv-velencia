const express = require('express');
const router = express.Router();

// @route   GET /api/utility/materials-care
// @desc    Get materials care information
// @access  Public
router.get('/materials-care', (req, res) => {
  try {
    const materialsCare = [
      { fabric: "Cotton", care: "Machine wash cold, tumble dry low" },
      { fabric: "Silk", care: "Dry clean only or hand wash with silk detergent" },
      { fabric: "Wool", care: "Dry clean recommended, or hand wash cold" },
      { fabric: "Denim", care: "Wash inside out in cold water, air dry" },
      { fabric: "Linen", care: "Machine wash cold, iron while damp" },
      { fabric: "Cashmere", care: "Hand wash cold, lay flat to dry" },
      { fabric: "Polyester", care: "Machine wash warm, tumble dry medium" },
      { fabric: "Leather", care: "Professional cleaning only, condition regularly" }
    ];

    res.json({
      success: true,
      data: materialsCare
    });
  } catch (error) {
    console.error('Materials care error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching materials care data'
    });
  }
});

// @route   GET /api/utility/size-guide
// @desc    Get size guide information
// @access  Public
router.get('/size-guide', async (req, res) => {
  try {
    const sizeGuide = {
      clothing: {
        men: {
          sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          measurements: {
            chest: { XS: '34-36', S: '36-38', M: '38-40', L: '40-42', XL: '42-44', XXL: '44-46' },
            waist: { XS: '28-30', S: '30-32', M: '32-34', L: '34-36', XL: '36-38', XXL: '38-40' },
            hips: { XS: '34-36', S: '36-38', M: '38-40', L: '40-42', XL: '42-44', XXL: '44-46' }
          }
        },
        women: {
          sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          measurements: {
            bust: { XS: '32-34', S: '34-36', M: '36-38', L: '38-40', XL: '40-42', XXL: '42-44' },
            waist: { XS: '24-26', S: '26-28', M: '28-30', L: '30-32', XL: '32-34', XXL: '34-36' },
            hips: { XS: '34-36', S: '36-38', M: '38-40', L: '40-42', XL: '42-44', XXL: '44-46' }
          }
        }
      },
      footwear: {
        us: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
        eu: ['36', '37', '37.5', '38', '38.5', '39', '39.5', '40', '40.5', '41', '41.5', '42', '42.5'],
        uk: ['3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9']
      },
      tips: [
        'Measure yourself while wearing undergarments you plan to wear with the garment',
        'For the most accurate measurements, have someone else measure you',
        'Keep the measuring tape parallel to the floor',
        'Don\'t pull the measuring tape too tight',
        'If you\'re between sizes, we recommend sizing up for comfort'
      ]
    };

    res.json({
      success: true,
      data: sizeGuide
    });
  } catch (error) {
    console.error('Get size guide error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching size guide'
    });
  }
});

// @route   GET /api/utility/account-menu
// @desc    Get account menu configuration
// @access  Public
router.get('/account-menu', async (req, res) => {
  try {
    const accountMenu = {
      sections: [
        {
          title: 'My Account',
          items: [
            { label: 'Profile Settings', path: '/account/settings', icon: 'user' },
            { label: 'Order History', path: '/account/orders', icon: 'package' },
            { label: 'Saved Items', path: '/account/saved-items', icon: 'heart' },
            { label: 'Addresses', path: '/account/addresses', icon: 'map-pin' }
          ]
        },
        {
          title: 'Services',
          items: [
            { label: 'Book Appointment', path: '/book-appointment', icon: 'calendar' },
            { label: 'Gift Services', path: '/gift-services', icon: 'gift' },
            { label: 'Customer Support', path: '/contact', icon: 'headphones' }
          ]
        },
        {
          title: 'Information',
          items: [
            { label: 'Size Guide', path: '/size-guide', icon: 'ruler' },
            { label: 'Product Care', path: '/product-care', icon: 'shield' },
            { label: 'Shipping & Returns', path: '/shipping-returns', icon: 'truck' }
          ]
        }
      ]
    };

    res.json({
      success: true,
      data: accountMenu
    });
  } catch (error) {
    console.error('Get account menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching account menu'
    });
  }
});

// Search suggestions endpoint
router.get('/search-suggestions', async (req, res) => {
  try {
    const { q } = req.query;

    // Return enhanced static suggestions that match the expected frontend structure
    const suggestions = {
      trending: [
        { query: "Shirt", icon: "search" },
        { query: "Pant", icon: "search" },
        { query: "T-shirt", icon: "search" },
        { query: "Jeans", icon: "search" },
        { query: "Jacket", icon: "search" }
      ],
      newIn: [
        { query: "Giallo Collection", category: "new" },
        { query: "Women's Summer", category: "new" },
        { query: "Men's Casual", category: "new" },
        { query: "Street Style", category: "new" }
      ],
      featured: [
        { query: "Lido Collection", category: "collection" },
        { query: "Premium Line", category: "collection" },
        { query: "Vintage Series", category: "collection" }
      ],
    };

    // If a query is provided, filter suggestions
    if (q && q.length > 0) {
      const query = q.toLowerCase();
      const filteredSuggestions = {
        trending: suggestions.trending.filter(item => 
          item.query.toLowerCase().includes(query)
        ),
        newIn: suggestions.newIn.filter(item => 
          item.query.toLowerCase().includes(query)
        ),
        featured: suggestions.featured.filter(item => 
          item.query.toLowerCase().includes(query)
        )
      };

      return res.json({
        success: true,
        data: filteredSuggestions
      });
    }

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching search suggestions'
    });
  }
});

module.exports = router;