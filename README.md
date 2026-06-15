# Unwind 💬

A real-time chat application built with the MERN stack, featuring OTP-based authentication, JWT authorization, secure cookie-based sessions, and protected routes.

## Features Implemented

### Authentication

* Email OTP based authentication
* Secure OTP hashing before database storage
* OTP expiration handling
* OTP verification system
* OTP resend functionality
* Verification attempt limiting
* User email verification (`is_verified` flag)

### Authorization

* JWT Access Token generation
* JWT Refresh Token generation
* HttpOnly cookie-based authentication
* Protected backend routes
* Protected frontend routes
* Persistent login after page refresh
* Session restoration using `/auth/me`

### Security

* OTP stored as hash
* HttpOnly cookies
* Secure JWT verification middleware
* Expired OTP cleanup
* Unauthorized access protection
* Email verification enforcement

## Tech Stack

### Frontend

* React
* React Router DOM
* Axios
* React Toastify
* Tailwind CSS

### Backend

* Node.js
* Express.js
* PostgreSQL
* JWT
* bcrypt
* cookie-parser

## Authentication Flow

```text
User enters email
        ↓
OTP generated
        ↓
OTP hashed and stored
        ↓
OTP sent to user
        ↓
User enters OTP
        ↓
OTP verified
        ↓
Access Token generated
        ↓
Refresh Token generated
        ↓
Cookies set
        ↓
User redirected to chats
```

## Session Flow

```text
User opens app
        ↓
AuthLoader runs
        ↓
GET /auth/me
        ↓
JWT verified
        ↓
User restored in context
        ↓
Protected routes accessible
```

## Project Structure

```text
unwind
│
├── frontend
│   ├── pages
│   ├── components
│   ├── context
│   └── routes
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── middlewares
│   ├── services
│   ├── db
│   └── utils
│
└── database
```

## Implemented Routes

### Authentication

```http
POST /api/send/otp
POST /api/verify/otp
POST /api/otp/resend
GET  /auth/me
```

## Database Tables

### unwind_users

```sql
id
email
refreshToken
is_verified
created_at
```

### unwind_otp

```sql
id
email
otp_hash
expires_at
created_at
```

## Current Progress

### Completed

* OTP Authentication
* JWT Authentication
* Protected Routes
* User Verification
* Session Persistence
* Cookie-Based Authentication

### Upcoming

* Refresh Token Rotation
* Logout System
* Socket.IO Authentication
* Online Users Tracking
* Real-Time Messaging
* Chat Rooms
* Message Persistence
* Typing Indicators
* Read Receipts

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Variables

```env
PORT=
DATABASE_URL=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

EMAIL_USER=
EMAIL_PASS=
```

### Run Backend

```bash
npm run dev
```

### Run Frontend

```bash
npm run dev
```

## Author

Abhishek Singh

## Project Status

🚧 Currently under active development.
