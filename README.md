# CarRental — Full-Stack Car Rental Platform

A modern, production-ready car rental web application built with Next.js and Node.js. The platform enables users to browse, book, and pay for rental cars, while providing fleet owners with a comprehensive admin dashboard for managing vehicles, bookings, customers, and analytics.

---

## Features

### User-Facing

- Browse available cars with filtering and search
- Detailed car pages with image galleries and specifications
- Date-based booking with real-time availability checks
- OTP-based email verification and authentication
- Personal profile with booking history and status tracking
- Booking confirmation flow with payment integration
- Responsive, mobile-first design with smooth animations

### Owner / Admin

- Secure admin dashboard with analytics and KPIs
- Fleet management — add, edit, delete, and toggle car availability
- Booking management — approve, reject, and complete rentals
- Customer management with booking and spending statistics
- Revenue analytics with visual charts (Recharts)
- Image upload and management via ImageKi
- Role-based access control (user / owner)

---

## Tech Stack

| Layer       | Technology                                             |
| ----------- | ------------------------------------------------------ |
| Frontend    | Next.js 16 (App Router), React 19, TypeScript          |
| Styling     | Tailwind CSS 4, Framer Motion                          |
| Forms       | React Hook Form, Zod validation                        |
| Backend     | Node.js, Express.js, TypeScript                        |
| Database    | MongoDB with Mongoose ODM                              |
| Auth        | JWT (HttpOnly cookies), bcrypt, OTP email verification |
| File Upload | Multer + ImageKit                                      |
| Email       | Nodemailer                                             |
| Deployment  | Vercel (frontend), Node.js server (backend)            |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                    Client                       │
│         Next.js App Router (SSR/CSR)            │
│    React Context → API Layer → fetchAPI()       │
└──────────────────────┬──────────────────────────┘
                       │ REST API (JSON)
┌──────────────────────▼──────────────────────────┐
│                    Server                       │
│            Express.js + TypeScript              │
│   Routes → Controllers → Models (Mongoose)      │
│   Middlewares: auth, owner, multer              │
└──────────────────────┬──────────────────────────┘
                       │
          ┌────────────▼────────────┐
          │   MongoDB   │  ImageKit │
          │  (Database) │  (Media)  │
          └─────────────┴───────────┘
```

---

## Authentication & Roles

The application uses JWT tokens stored in HttpOnly cookies for session management.

| Role    | Access                                                           |
| ------- | ---------------------------------------------------------------- |
| `user`  | Browse cars, create bookings, view profile and booking history   |
| `owner` | Full admin dashboard, fleet management, booking and customer ops |

**Auth flows:**

- **Email + Password** — Standard registration and login
- **OTP Verification** — Email-based one-time password for identity confirmation
- **Role Elevation** — Users can request owner role via `/owner/change-role`

---

## Installation

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- ImageKit account (for image uploads)

### 1. Clone the repository

```bash
git clone https://github.com/CarRentOrg/CarRental.git
cd CarRental
```

### 2. Install dependencies

```bash
# Install root workspace dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Configure environment variables

Create `.env` files in both `server/` and `client/` directories (see section below).

### 4. Start development servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

The client runs on `http://localhost:3000` and the server on `http://localhost:3001`.

---

## Environment Variables

### Server (`server/.env`)

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/car-rental
JWT_SECRET=your_jwt_secret_key

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_account

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Client URL (CORS)
CLIENT_URL=http://localhost:3000
```

### Client (`client/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# ImageKit (public)
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_account
```

---

## API Structure

All endpoints are prefixed with `/api`.

| Module    | Base Path    | Key Endpoints                                                           |
| --------- | ------------ | ----------------------------------------------------------------------- |
| Auth      | `/auth`      | `POST /login`, `POST /register`, `GET /data`, `POST /otp/*`             |
| Cars      | `/user/cars` | `GET /`, `GET /:id`                                                     |
| Bookings  | `/bookings`  | `POST /init`, `POST /confirm`, `GET /my-bookings`, `PUT /:id`           |
| Payment   | `/payment`   | `POST /create-intent`, `POST /verify`                                   |
| Owner     | `/owner`     | `GET /cars`, `POST /add-car`, `PUT /update-car/:id`, `POST /toggle-car` |
| Owner Ops | `/owner`     | `GET /dashboard`, `GET /bookings`, `GET /customers`                     |
| Users     | `/users`     | `GET /:id`                                                              |

**Authentication:** JWT via HttpOnly cookies. Protected routes use `protect` middleware; owner routes additionally use `requireOwner`.

---

## Deployment

### Frontend (Vercel)

1. Connect the GitHub repository to Vercel
2. Set **Root Directory** to `client`
3. Set **Build Command** to `npm run build`
4. Set **Output Directory** to `.next`
5. Add all `NEXT_PUBLIC_*` environment variables
6. Deploy

### Backend

Deploy the `server` directory to any Node.js hosting provider (Railway, Render, Fly.io, etc.):

```bash
cd server
npm run build
npm start
```

Ensure the `CLIENT_URL` environment variable matches your Vercel deployment URL for CORS.

---

## Folder Structure

```
CarRental/
├── client/                     # Next.js frontend
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── admin/          # Admin dashboard, cars, bookings, analytics
│   │   │   ├── booking/        # Booking flow
│   │   │   ├── cars/           # Car listing and detail pages
│   │   │   ├── profile/        # User profile and booking history
│   │   │   ├── login/          # Authentication pages
│   │   │   └── ...
│   │   ├── components/         # Reusable UI components
│   │   │   ├── admin/          # Admin-specific components
│   │   │   ├── booking/        # Booking cards, modals, forms
│   │   │   ├── auth/           # OTP modal, login forms
│   │   │   └── ui/             # Shared UI primitives
│   │   ├── contexts/           # React Context providers
│   │   ├── lib/                # API client, utilities
│   │   ├── types/              # TypeScript type definitions
│   │   └── hooks/              # Custom React hooks
│   └── package.json
│
├── server/                     # Express.js backend
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── models/             # Mongoose schemas (User, Car, Booking, OTP)
│   │   ├── routes/             # Express route definitions
│   │   ├── middlewares/        # Auth, owner, multer middlewares
│   │   ├── services/           # Business logic services
│   │   ├── utils/              # ImageKit upload, helpers
│   │   ├── config/             # Database connection
│   │   └── index.ts            # Server entry point
│   └── package.json
│
├── vercel.json                 # Vercel deployment config
└── package.json                # Workspace root
```

---

## Screenshots

> Screenshots coming soon. Add screenshots of the homepage, car detail page, booking flow, and admin dashboard here.

---

## License

This project is proprietary software. All rights reserved.

---

<p align="center">
  Built with Next.js, Express, and MongoDB
</p>
