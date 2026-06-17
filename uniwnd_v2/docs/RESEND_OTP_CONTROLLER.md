# 🔄 Resend OTP Controller

## Overview
The `resendOtp` controller handles the case where a user requests a new OTP. It validates the email, checks if an OTP record exists, enforces rate limiting, generates a new OTP, hashes it, updates the database, and sends the new OTP to the user's email address.

---

## 📁 File Location
```
server/
└── controllers/
    └── resendOtp.controller.js
```

---

## 📦 Dependencies

| Package | Use |
|---|---|
| `nodemailer` | To send the OTP email |
| `bcrypt` | To hash the new OTP |
| `crypto` | To generate a secure random OTP |
| `pg` | To run PostgreSQL queries |

---

## 🔗 Internal Imports

| Import | Location | Use |
|---|---|---|
| `db` | `db/index.js` | Database connection |
| `sendOtpEmail` | `services/nodemailer.services.js` | Send OTP email |
| `generateOTP` | `services/generateOtp.services.js` | Generate random OTP |
| `hashOtp` | `services/hashOtp.services.js` | Hash the OTP |
| `verifyEmail` | `utils/verifyEmail.utils.js` | Validate email format |

---

## 🛣️ Route

```
POST /api/auth/resend-otp
```

**Access:** Public
**Rate Limit:** 3 requests per 5 minutes (IP wise)

---

## 📥 Request

### Body:
```json
{
    "email": "user@example.com"
}
```

---

## 📤 Response

### Success:
```json
{
    "success": true,
    "email": "user@example.com",
    "message": "OTP resent successfully to user@example.com"
}
```

### Error Responses:

| Status Code | Message | Reason |
|---|---|---|
| 400 | Email is required | Email missing from request body |
| 400 | Invalid email format | Email format is invalid |
| 404 | No OTP request found for this email. Please request a new OTP | No OTP record exists in the database |
| 429 | Please wait X seconds before requesting a new OTP | OTP is still active |
| 400 | Error while generating OTP. Please try again | OTP generation failed |
| 400 | Error while generating OTP. Please try again | OTP hashing failed |
| 500 | Something went wrong | DB update failed |
| 500 | Failed to send email | Email sending failed |
| 500 | Internal server error | Unexpected error |

---

## 🔄 Flow

```
Request received (email)
        ↓
Email present? → No → 400
        ↓
Email format valid? → No → 400
        ↓
OTP record exists in DB? → No → 404
        ↓
OTP still active? → Yes → 429 (wait X seconds)
        ↓
Generate new OTP
        ↓
OTP generated? → No → 400
        ↓
Hash the OTP
        ↓
Hashed? → No → 400
        ↓
Generate expiry time (5 minutes)
        ↓
Update DB (new OTP, new expiry, reset attempts to 3)
        ↓
Updated? → No → 500
        ↓
Send OTP email
        ↓
Email sent? → No → 500
        ↓
200 Success
```

---

## 🔒 Security

### 1. Email Validation
The email is validated using a regex — invalid format requests are rejected immediately.

### 2. OTP Record Check
If no OTP record exists for the given email, a `404` is returned. This prevents attackers from resending OTPs to emails that never requested one.

### 3. Rate Limiting (Two Layers)

**Layer 1 — IP wise (express-rate-limit):**
```
Max 3 requests per 5 minutes per IP
```

**Layer 2 — Email wise (DB check):**
```
If the current OTP has not expired yet, the user must wait before requesting a new one
```

### 4. Attempts Reset
Every time a new OTP is resent, `attempts_left` is reset back to `3`.

### 5. OTP Hashing
The new OTP is hashed using `bcrypt` before being stored in the database.

---

## 🗄️ Database

### Table: `unwind_otp`

| Column | Type | Value |
|---|---|---|
| id | SERIAL PK | Unique ID |
| email | VARCHAR UNIQUE | User's email address |
| hashed_otp | TEXT | Bcrypt hashed OTP |
| expires_at | TIMESTAMP | Current time + 5 minutes |
| attempts_left | INT | Reset to 3 on resend |
| created_at | TIMESTAMP | Record creation time |

### Query Type: UPDATE
```
Unlike sendOtp (UPSERT), resendOtp uses UPDATE only
Because the record must already exist — if not, 404 is returned
```

### Queries Used:

| Query | When |
|---|---|
| SELECT expires_at | Check if OTP record exists and rate limit |
| UPDATE hashed_otp, expires_at, attempts_left | Update with new OTP |

---

## 🆚 Difference from sendOtp

| | sendOtp | resendOtp |
|---|---|---|
| DB Query | UPSERT (INSERT or UPDATE) | UPDATE only |
| Record Check | Not required | Required (404 if missing) |
| Rate Limit | OTP active check | OTP active check |
| Attempts | Set to 3 on insert | Reset to 3 on update |