# WhatNext Vision Motors
> **"Shaping the Future of Mobility with Innovation and Excellence"**

WhatNext Vision Motors is a full-stack automotive web application engineered to showcase luxury electric and next-generation mobility vehicles. Built with modern web technologies, it features dynamic vehicle inventory management, test-drive booking workflows, secure JWT/bcrypt authentication with role-based access control (RBAC), user profiles, an executive admin management dashboard, and clean RESTful APIs connected to MongoDB.

---

## 🌟 Key Features

### 1. 🏎️ Dynamic Vehicle Showcase & Inventory
- **Real-Time Filtering & Search:** Search vehicles by keyword regex, vehicle type (*Hypercar, SUV, Sedan, Coupe, Crossover, Concept*), powertrain (*EV, Hybrid, Hydrogen*), price range slider, and availability.
- **Dynamic Database Fetching:** Vehicle data and imagery are stored in and fetched dynamically from MongoDB through Express.js REST endpoints.
- **Interactive Specs Badges:** Real-time metrics including 0-60 MPH acceleration, range/mileage, horsepower, and charging speeds.

### 2. 🔍 Vehicle Deep-Dive & Gallery Details
- High-resolution interactive gallery with image preview switcher.
- Architectural overviews and standard/optional feature checklists.
- Comprehensive technical specifications table (Powertrain, Drivetrain, Battery Pack, Dimensions, Cargo Space, Factory Warranty).
- Interactive 5-year financing EMI estimator widget.
- Direct test-drive scheduling integration.

### 3. 📅 Working Test Drive Booking System
- Interactive reservation system with date constraints (prevents past dates).
- Time window selection and global experience studio location picker.
- Generates unique tracking booking references (e.g., `WNV-TD-XXXX`).
- Automatically associates bookings with logged-in user accounts while also supporting guest reservations.
- Instant booking receipt confirmation modal.

### 4. 🔐 Secure Authentication & User Profiles
- User registration and login with encrypted password storage using **bcryptjs** (salt rounds = 10).
- Stateless **JWT (JSON Web Token)** authentication stored in client-side secure tokens.
- **Role-Based Access Control (RBAC):** Distinction between regular `user` and `admin` roles.
- Customer account portal to update personal details and track the status of all reserved test drives.

### 5. ⚡ Executive Admin Dashboard
- **Live KPI Analytics:** Instant metrics for total inventory, total users, scheduled test drives, pending approvals, and unread inquiries.
- **Vehicle Fleet CRUD Operations:** Add new vehicles with multi-image URLs and rich specifications, edit existing models, or delete vehicles from MongoDB.
- **Test Drive Approval Engine:** Update booking statuses (*Pending*, *Confirmed*, *Completed*, *Cancelled*) with immediate database reflection.
- **Client Inquiry Center:** Review contact messages, mark inquiries as *Read* or *Replied*, and manage customer service notes.
- **User Role Management:** View all registered accounts and promote/demote user administrative privileges.

### 6. 💬 Contact & Concierge Portal
- Direct message transmission with categorized department routing (*Vehicle Purchase, Fleet Solutions, Investor Relations, Press & Media*).
- Global studio location directory and interactive FAQ accordion.

---

## 🛠️ Technology Stack

- **Frontend:**
  - HTML5 (Semantic, SEO-optimized tags and OpenGraph meta)
  - CSS3 (Custom responsive luxury dark design system, Glassmorphism, CSS Variables, Neon Glow Accents, Google Fonts *Outfit* & *Space Grotesk*)
  - JavaScript (ES6+ Modules, Fetch API, dynamic DOM manipulation, Toast notifications)
- **Backend:**
  - Node.js & Express.js RESTful API architecture
  - CORS, JSON body parsers, Morgan logging
  - Custom JWT auth & role authorization middleware
  - Centralized error handling and Mongoose CastError/duplicate key formatting
- **Database:**
  - MongoDB with Mongoose ODM
  - Schemas with validation, indexes, and virtual hooks
  - **Zero-Config In-Memory Fallback:** Seamlessly launches `mongodb-memory-server` if local MongoDB is not running, ensuring instant evaluation without external setup!
  - Auto-seeding mechanism with 10+ realistic futuristic vehicle models, admin account, and demo data.

---

## 📁 Project Structure

```
project-hari/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection + Zero-Config fallback & auto-seed
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile updates
│   │   ├── vehicleController.js  # Vehicle CRUD, search, filter, and metrics
│   │   ├── bookingController.js  # Test drive booking scheduling and admin status
│   │   ├── contactController.js  # Customer inquiry submission and management
│   │   └── adminController.js    # Dashboard analytics and user role operations
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification and RBAC authorization
│   │   └── errorMiddleware.js    # 404 handler and global exception wrapper
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt pre-save hook
│   │   ├── Vehicle.js            # Vehicle schema with specs, badges, and search index
│   │   ├── TestDriveBooking.js   # Booking schema with reference code generator
│   │   └── ContactMessage.js     # Contact messages schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── vehicleRoutes.js      # /api/vehicles
│   │   ├── bookingRoutes.js      # /api/bookings
│   │   ├── contactRoutes.js      # /api/contact
│   │   └── adminRoutes.js        # /api/admin
│   └── seeders/
│       ├── seedData.js           # 10+ Vehicles, Admin & Demo User accounts
│       └── runSeed.js            # Standalone CLI seeder script
├── frontend/
│   ├── css/
│   │   ├── style.css             # Main theme, tokens, navbar, hero, cards, toasts
│   │   ├── vehicle-details.css   # Vehicle deep-dive gallery, specs table, sticky card
│   │   └── admin.css             # Admin dashboard sidebar, KPI metrics, tables
│   ├── js/
│   │   ├── api.js                # Central API client, token manager, formatters
│   │   ├── auth.js               # Auth state manager, navbar integration, login logic
│   │   ├── main.js               # Home page controller, featured fleet loader
│   │   ├── vehicles.js           # Inventory search, multi-filtering, sorting
│   │   ├── vehicle-detail.js     # Single vehicle specifications & gallery
│   │   ├── booking.js            # Test drive booking form & confirmation receipt
│   │   ├── contact.js            # Contact form submission & FAQ accordion
│   │   ├── profile.js            # User profile view & personal booking history
│   │   └── admin.js              # Admin operations, vehicle CRUD, bookings/users
│   ├── index.html                # Home Page
│   ├── vehicles.html             # Vehicle Fleet Catalog & Search Page
│   ├── vehicle-details.html      # Vehicle Detailed Specifications Page
│   ├── test-drive.html           # VIP Test Drive Booking Page
│   ├── contact.html              # Contact & Concierge Page
│   ├── login.html                # Authentication Portal (Sign In / Register)
│   ├── profile.html              # User Profile & Bookings History Page
│   └── admin.html                # Admin Control Center
├── .env.example                  # Environment variables template
├── .env                          # Local environment variables
├── package.json                  # Dependencies and execution scripts
├── server.js                     # Main server entry point
└── README.md                     # Documentation
```

---

## 🚀 Quick Start & Installation Instructions

### Prerequisites
- **Node.js**: Version 18+ (Tested on Node v20/v24)
- **MongoDB**: Optional (If MongoDB is installed locally or via MongoDB Atlas URI, it connects directly. If not running, the application automatically uses an embedded in-memory MongoDB instance with zero manual setup required!)

### 1. Clone & Install Dependencies
```bash
# Navigate into the project folder
cd project-hari

# Install backend dependencies
npm install
```

### 2. Environment Configuration
Verify or create the `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/whatnext_motors
JWT_SECRET=whatnext_vision_motors_ultra_secure_jwt_secret_key_2026_x7
JWT_EXPIRE=30d
```

### 3. Start the Server
```bash
# Start the full-stack server (automatically seeds the database on first run)
npm start
```

### 4. Open in Browser
Visit **`http://localhost:5000`** in your browser.

---

## 🔑 Pre-Seeded Demo Accounts

The application automatically seeds default accounts on launch:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@whatnext.com` | `Admin@1234` | Full access to Admin Dashboard, Vehicle CRUD, Bookings, Inquiries, User management |
| **Standard User** | `sarah.chen@example.com` | `User@1234` | Public browsing, booking test drives, viewing personal booking history |

*(Note: The login page at `login.html` features quick one-click buttons to auto-fill these demo credentials for fast demonstration!)*

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create new user account (*Public*)
- `POST /api/auth/login` - Sign in and receive JWT token (*Public*)
- `GET /api/auth/me` - Get profile of authenticated user (*Private*)
- `PUT /api/auth/profile` - Update profile name, phone, or password (*Private*)

### Vehicles (`/api/vehicles`)
- `GET /api/vehicles` - Retrieve vehicles with search, filtering, and sorting (*Public*)
- `GET /api/vehicles/featured` - Retrieve top featured vehicles (*Public*)
- `GET /api/vehicles/filters` - Get distinct filter categories & price bounds (*Public*)
- `GET /api/vehicles/:id` - Get vehicle details by ID (*Public*)
- `POST /api/vehicles` - Add new vehicle (*Admin Only*)
- `PUT /api/vehicles/:id` - Update vehicle specifications (*Admin Only*)
- `DELETE /api/vehicles/:id` - Delete vehicle from inventory (*Admin Only*)

### Test Drive Bookings (`/api/bookings`)
- `POST /api/bookings` - Create a test drive reservation (*Public / Authenticated*)
- `GET /api/bookings/my-bookings` - Get test drives of logged-in user (*Private*)
- `GET /api/bookings` - Get all bookings with status filter (*Admin Only*)
- `PUT /api/bookings/:id/status` - Update booking status (*Admin Only*)
- `DELETE /api/bookings/:id` - Delete booking record (*Admin Only*)

### Client Inquiries (`/api/contact`)
- `POST /api/contact` - Submit contact inquiry message (*Public*)
- `GET /api/contact` - Get all inquiries (*Admin Only*)
- `PUT /api/contact/:id` - Update inquiry status (*Admin Only*)
- `DELETE /api/contact/:id` - Delete inquiry record (*Admin Only*)

### Admin Operations (`/api/admin`)
- `GET /api/admin/stats` - Get dashboard KPIs and metrics (*Admin Only*)
- `GET /api/admin/users` - Get all registered users (*Admin Only*)
- `PUT /api/admin/users/:id/role` - Toggle user role between `user` and `admin` (*Admin Only*)
- `DELETE /api/admin/users/:id` - Remove user account (*Admin Only*)

---

## 🛡️ Security Features
- **Password Hashing:** Passwords encrypted using bcrypt before storage.
- **JWT Verification:** Secure token transmission with 30-day expiration.
- **RBAC:** Protected admin API routes and UI views.
- **Input Validation:** Required field validations and Mongoose schema constraints.
- **Environment Isolation:** Secrets kept in `.env` and excluded from client bundles.

---

## 🚗 Brand Manifesto
*"WhatNext Vision Motors stands at the intersection of aeronautical design, quantum intelligence, and uncompromising electrification. We are not merely building vehicles; we are crafting the transcendent future of human mobility."*
