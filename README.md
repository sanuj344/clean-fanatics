# Clean Fanatics - Full Stack Application

A service booking platform with role-based access control (Customer, Provider, Admin) built with React 18, Vite, and Node.js/Express backend.

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
- View assigned bookings
- Accept/Reject bookings
- Update booking status

### ADMIN
- View all bookings
- Override booking status
- Manage services

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

## 🎨 Features

- ✅ Role-based routing and access control
- ✅ JWT authentication with auto token injection
- ✅ Credit system with real-time balance updates
- ✅ Booking timeline with event history
- ✅ Responsive UI design
- ✅ Error handling and loading states
- ✅ Auto-redirect after login based on role

## 🔒 Security

- JWT tokens stored in localStorage
- Automatic token expiration handling
- Protected routes with role checking
- API requests include Authorization header
- 401 errors trigger logout and redirect

## 📝 Notes

- Frontend expects backend API to match the contracts exactly
- Admin endpoint `GET /api/admin/bookings` must return array of bookings
- All API responses must match the documented shapes
- Credits update immediately after booking via `/api/auth/me`

## 🧪 Testing

1. Create accounts for each role (CUSTOMER, PROVIDER, ADMIN)
2. Login as CUSTOMER and browse services
3. Book a service (credits should deduct)
4. Login as PROVIDER and accept/reject bookings
5. Login as ADMIN and override booking statuses

## 📄 License

MIT
