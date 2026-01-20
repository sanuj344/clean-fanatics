# Clean Fanatics - Full Stack Application

A service booking platform with role-based access control (Customer, Provider, Admin) built with React 18, Vite, and Node.js/Express backend. Includes Razorpay payment integration for credit purchases.

## 🏗️ Architecture

### Frontend
- **React 18** with Vite for fast development and builds
- **React Router v6** for client-side routing
- **Context API** for authentication state management
- **Axios** for HTTP requests with automatic token injection
- **Plain CSS** for styling (Urban-Company-like design)

### Backend
- **Node.js/Express** REST API
- **Prisma ORM** with PostgreSQL
- **JWT** authentication
- **Role-based access control** (RBAC)

## 🔐 Authentication Model

- JWT-based authentication
- Token stored in `localStorage`
- Axios interceptors automatically attach token as `Authorization: Bearer <TOKEN>`
- Token verification on app load
- Auto-redirect to login on 401 errors

## 👥 User Roles

### CUSTOMER
- Browse available services
- Book services (credits deducted immediately)
- View booking details and timeline
- See credit balance

### PROVIDER
- View assigned bookings (ASSIGNED status)
- Accept bookings (status → IN_PROGRESS)
- Reject bookings (status → PENDING, provider removed)
- Event logging for all actions

### ADMIN
- View all bookings across the platform
- Override booking status with reason
- Manage services
- **⚠️ Demo Mode**: Admin signup is enabled for demonstration purposes only. In production, admin accounts should be created through secure channels.

## 📋 Booking Lifecycle

1. **PENDING** - Customer creates booking, credits deducted
2. **ASSIGNED** - System auto-assigns provider
3. **IN_PROGRESS** - Provider accepts booking
4. **COMPLETED** - Service completed
5. **CANCELLED** - Booking cancelled (admin override)

### Booking Events
Every status change is logged as an event with:
- `fromStatus` - Previous status
- `toStatus` - New status
- `actor` - Who made the change (CUSTOMER, PROVIDER, SYSTEM, ADMIN)
- `createdAt` - Timestamp

## 💳 Credit System

- Credits are deducted immediately when booking is created
- UI updates credits after booking using `/api/auth/me`
- Insufficient credits prevent booking
- Credit balance displayed in customer header
- **Razorpay Integration**: Customers can purchase credits (50/100/200 packages)
- Credit-to-amount ratio: ₹1 = 1 credit
- Payment verification ensures secure transactions
- Credits added immediately after successful payment

## 🚀 How to Run

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- Backend server configured

### Backend Setup

```bash
cd backend
npm install
```

Set up environment variables (create `.env`):
```
DATABASE_URL="postgresql://user:password@localhost:5432/cleanfanatics"
JWT_SECRET="your-secret-key"
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
ALLOW_ADMIN_SIGNUP="true"  # Demo only - set to false in production
```

Run migrations:
```bash
npx prisma migrate dev
```

Start backend server:
```bash
npm start
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

## 📁 Project Structure

```
clean-fanatics/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & role middleware
│   │   └── config/          # Database & config
│   └── prisma/             # Database schema & migrations
│
└── frontend/                # React frontend
    ├── src/
    │   ├── api/            # API client (api.js)
    │   ├── auth/           # AuthContext
    │   ├── routes/         # ProtectedRoute component
    │   ├── pages/          # Page components
    │   │   ├── customer/   # Customer pages
    │   │   ├── provider/   # Provider dashboard
    │   │   └── admin/      # Admin dashboard
    │   ├── App.jsx         # Main app with routing
    │   └── main.jsx        # Entry point
    ├── package.json
    └── vite.config.js
```

## 🛣️ Routes

### Public Routes
- `/login` - Login page
- `/signup` - Signup page

### Customer Routes (requires CUSTOMER role)
- `/customer/home` - Browse services
- `/customer/service/:id` - Service details & booking
- `/customer/booking-success` - Booking confirmation
- `/customer/booking/:id` - Booking details & timeline

### Provider Routes (requires PROVIDER role)
- `/provider/dashboard` - View assigned bookings, accept/reject

### Admin Routes (requires ADMIN role)
- `/admin/dashboard` - View all bookings, override status

## 🔌 API Endpoints

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login (returns token + user)
- `GET /api/auth/me` - Get current user (JWT required)

### Services
- `GET /api/services` - List all services

### Bookings
- `POST /api/bookings` - Create booking (CUSTOMER only)
- `GET /api/bookings/:id` - Get booking with events

### Provider
- `GET /api/provider/bookings` - Get assigned bookings
- `POST /api/provider/bookings/:id/accept` - Accept booking
- `POST /api/provider/bookings/:id/reject` - Reject booking

### Admin
- `GET /api/admin/bookings` - Get all bookings
- `POST /api/admin/bookings/:id/override` - Override booking status

### Payments (Razorpay)
- `POST /api/payments/create-order` - Create Razorpay order for credit purchase
  - Request: `{ "credits": 100 }`
  - Response: `{ "orderId": "...", "amount": 10000, "currency": "INR", "key": "RAZORPAY_KEY_ID" }`
- `POST /api/payments/verify` - Verify payment and add credits
  - Request: `{ "razorpay_order_id": "...", "razorpay_payment_id": "...", "razorpay_signature": "...", "credits": 100 }`

## 🎨 Features

- ✅ Role-based routing and access control
- ✅ JWT authentication with auto token injection
- ✅ Credit system with real-time balance updates
- ✅ **Razorpay payment integration** for credit purchases
- ✅ Booking timeline with event history
- ✅ Provider accept/reject workflow
- ✅ Admin override capabilities
- ✅ Responsive UI design
- ✅ Error handling and loading states
- ✅ Auto-redirect after login based on role
- ✅ No blank screens, all states handled

## 🔒 Security

- JWT tokens stored in localStorage
- Automatic token expiration handling
- Protected routes with role checking
- API requests include Authorization header
- 401 errors trigger logout and redirect

## 🔄 Provider Workflow

1. **System Auto-Assignment**: When customer creates booking, system automatically assigns to first available provider
2. **Provider Views**: Provider sees all ASSIGNED bookings in dashboard
3. **Accept**: Provider accepts → Status changes to IN_PROGRESS, event logged
4. **Reject**: Provider rejects → Status reverts to PENDING, provider removed, system can reassign
5. **Event Tracking**: All actions logged with actor (PROVIDER) and timestamps

## 💰 Razorpay Credit System

### Flow
1. Customer clicks "Buy Credits" button
2. Selects credit package (50/100/200 credits)
3. Frontend creates order via `/api/payments/create-order`
4. Razorpay checkout opens with order details
5. Customer completes payment
6. Frontend verifies payment via `/api/payments/verify`
7. Backend verifies signature, adds credits to user account
8. Frontend refreshes user data via `/api/auth/me`
9. Success message displayed, credits updated in UI

### Pricing
- ₹1 = 1 credit
- Packages: 50 credits (₹50), 100 credits (₹100), 200 credits (₹200)

### Security
- Payment signature verification on backend
- Razorpay key_id (public) sent from backend
- Key_secret never exposed to frontend
- All transactions logged in database

## 📝 Notes

- Frontend expects backend API to match the contracts exactly
- Admin endpoint `GET /api/admin/bookings` must return array of bookings
- All API responses must match the documented shapes
- Credits update immediately after booking via `/api/auth/me`
- **Admin Signup**: Enabled for demo purposes only. Set `ALLOW_ADMIN_SIGNUP=true` in backend `.env` to enable. Document this clearly in production.
- Razorpay credentials must be set in backend `.env`:
  - `RAZORPAY_KEY_ID` (public key)
  - `RAZORPAY_KEY_SECRET` (secret key, never expose)

## 🧪 Testing

1. Create accounts for each role (CUSTOMER, PROVIDER, ADMIN)
2. Login as CUSTOMER and browse services
3. Book a service (credits should deduct)
4. Login as PROVIDER and accept/reject bookings
5. Login as ADMIN and override booking statuses

## 📄 License

MIT
