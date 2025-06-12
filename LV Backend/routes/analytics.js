const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const router = express.Router();

// Analytics overview
router.get('/', adminAuth, async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    // Calculate date range based on period
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Get sales data
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $in: ['confirmed', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Get top products
    const topProducts = await Product.find()
      .sort({ sales: -1 })
      .limit(10)
      .select('name sales price');

    // Get category data
    const categoryData = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, sales: { $sum: '$sales' } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'categoryInfo' } }
    ]);

    res.json({
      success: true,
      data: {
        period: { start: startDate, end: endDate },
        salesData,
        topProducts,
        categoryData
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
});

module.exports = router;
