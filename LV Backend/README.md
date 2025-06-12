# LUV VALENCIA Backend API

A comprehensive Node.js and MongoDB backend API for the LUV VALENCIA luxury fashion e-commerce platform.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: Full CRUD operations with variants, reviews, and categories
- **Order Management**: Complete order lifecycle with payment tracking
- **User Management**: Customer profiles, addresses, wishlist, and loyalty program
- **Shopping Cart**: Persistent cart with stock validation
- **Admin Dashboard**: Analytics, user management, and inventory control
- **File Upload**: Image upload handling for products and reviews
- **Analytics**: Comprehensive sales and customer insights
- **Security**: Rate limiting, input validation, and secure headers

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT
- **Validation**: Express Validator
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd LV\ Backend
```

2. Install dependencies
```bash
npm install
```

3. Environment Configuration
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/luv-valencia
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

4. Seed the database
```bash
npm run seed
```

5. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout user |
| GET | `/auth/me` | Get current user |
| PUT | `/auth/profile` | Update user profile |
| PUT | `/auth/change-password` | Change password |
| POST | `/auth/forgot-password` | Request password reset |
| PUT | `/auth/reset-password` | Reset password |

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/search` | Search products |
| GET | `/products/featured` | Get featured products |
| GET | `/products/bestsellers` | Get bestseller products |
| GET | `/products/new-arrivals` | Get new arrivals |
| GET | `/products/:slug` | Get single product |
| POST | `/products` | Create product (Admin) |
| PUT | `/products/:id` | Update product (Admin) |
| DELETE | `/products/:id` | Delete product (Admin) |
| POST | `/products/:id/reviews` | Add product review |

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | Get orders |
| GET | `/orders/:id` | Get single order |
| POST | `/orders` | Create new order |
| PUT | `/orders/:id/status` | Update order status (Admin) |
| PUT | `/orders/:id/cancel` | Cancel order |
| POST | `/orders/:id/return` | Request return |
| GET | `/orders/admin/statistics` | Get order statistics (Admin) |

### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/profile` | Get user profile |
| PUT | `/users/profile` | Update user profile |
| POST | `/users/addresses` | Add address |
| PUT | `/users/addresses/:id` | Update address |
| DELETE | `/users/addresses/:id` | Delete address |
| GET | `/users/orders` | Get user orders |
| GET | `/users/loyalty` | Get loyalty information |

### Shopping Cart

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart` | Get cart |
| POST | `/cart/add` | Add item to cart |
| PUT | `/cart/update/:itemId` | Update cart item |
| DELETE | `/cart/remove/:itemId` | Remove item from cart |
| DELETE | `/cart/clear` | Clear cart |

### Wishlist

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wishlist` | Get wishlist |
| POST | `/wishlist/add` | Add to wishlist |
| DELETE | `/wishlist/remove/:productId` | Remove from wishlist |
| DELETE | `/wishlist/clear` | Clear wishlist |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | Get all categories |
| GET | `/categories/tree` | Get category tree |
| GET | `/categories/:slug` | Get single category |
| POST | `/categories` | Create category (Admin) |
| PUT | `/categories/:id` | Update category (Admin) |
| DELETE | `/categories/:id` | Delete category (Admin) |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard` | Get dashboard stats |
| GET | `/admin/users` | Get all users |
| GET | `/admin/users/:id` | Get user details |
| PUT | `/admin/users/:id/status` | Update user status |
| PUT | `/admin/users/:id/role` | Update user role (SuperAdmin) |
| GET | `/admin/products` | Get all products |
| GET | `/admin/analytics` | Get analytics data |
| POST | `/admin/create-admin` | Create admin user (SuperAdmin) |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/overview` | Get analytics overview |
| GET | `/analytics/sales-chart` | Get sales chart data |
| GET | `/analytics/top-products` | Get top products |
| GET | `/analytics/category-performance` | Get category performance |
| GET | `/analytics/customer-insights` | Get customer insights |

### File Upload

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload/image` | Upload single image (Admin) |
| POST | `/upload/images` | Upload multiple images (Admin) |

## Data Models

### User Schema
- Personal information (name, email, phone)
- Authentication (password, email verification)
- Addresses (billing, shipping)
- Loyalty program (points, tier)
- Preferences and settings

### Product Schema
- Basic information (name, description, price)
- Variants (size, color, SKU, stock)
- Categories and tags
- Reviews and ratings
- Analytics (views, purchases)

### Order Schema
- Customer and items information
- Shipping and billing addresses
- Payment details and status
- Tracking information
- Order lifecycle management

### Category Schema
- Hierarchical structure (parent/child)
- SEO optimization
- Status management

## Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Comprehensive validation using Express Validator
- **Authentication**: JWT-based with secure token handling
- **Authorization**: Role-based access control (Customer, Admin, SuperAdmin)
- **Security Headers**: Helmet.js for security headers
- **CORS**: Configurable cross-origin resource sharing
- **Password Security**: bcrypt hashing with salt rounds

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5001 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/luv-valencia |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `ALLOWED_ORIGINS` | CORS allowed origins | localhost:3000,localhost:5173 |

## Scripts

```bash
# Start development server
npm run dev

# Start production server
npm start

# Seed database with sample data
npm run seed

# Run tests
npm test
```

## Project Structure

```
LV Backend/
├── config/           # Configuration files
├── middleware/       # Custom middleware
├── models/          # Mongoose models
├── routes/          # Express routes
├── scripts/         # Utility scripts
├── utils/           # Helper functions
├── server.js        # Main server file
├── package.json     # Dependencies
└── README.md        # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.