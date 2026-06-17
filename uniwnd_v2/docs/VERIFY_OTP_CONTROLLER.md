# ✅ Verify OTP Controller

## Overview
The `verifyOtp` controller handles the second step of the authentication flow. It validates the OTP entered by the user, checks expiry, tracks attempts, compares the OTP with the hashed version in the database, and returns a success or error response.

---

## 📁 File Location
```
server/
└── controllers/
    └── verifyOtp.controller.js
```

---

## 📦 Dependencies

| Package | Use |
|---|---|
| `bcrypt` | To compare the OTP with the hashed version |
| `pg` | To run PostgreSQL queries |

---

## 🔗 Internal Imports

| Import | Location | Use |
|---|---|---|
| `db` | `db/index.js` | Database connection |
| `compareOtp` | `services/compareOtp.services.js` | Compare user OTP with hashed OTP |

---

## 🛣️ Route

```
POST /api/auth/verify-otp
```

**Access:** Public
**Rate Limit:** 5 requests per 15 minutes (IP wise)

---

## 📥 Request

### Body:
```json
{
    "email": "user@example.com",
    "userOtp": "123456"
}
```

---

## 📤 Response

### Success:
```json
{
    "success": true,
    "email": "user@example.com",
    "message": "OTP verified successfully"
}
```

### Error Responses:

| Status Code | Message | Reason |
|---|---|---|
| 400 | Email and OTP are required | Email or OTP missing from request body |
| 404 | OTP not found. Request a new OTP | No OTP record found in the database |
| 400 | OTP expired. Request a new OTP | OTP expiry time has passed |
| 403 | Too many attempts. Request a new OTP | More than 3 incorrect attempts made |
| 400 | Invalid OTP. X attempts left | OTP does not match |
| 500 | Internal server error | Unexpected error |

---

## 🔄 Flow

```
Request received (email, userOtp)
        ↓
Email and OTP present? → No → 400
        ↓
Convert OTP to Number
        ↓
Fetch OTP record from DB
        ↓
Record exists? → No → 404
        ↓
OTP expired? → Yes → Delete from DB → 400
        ↓
Attempts left > 0? → No → Delete from DB → 403
        ↓
Compare OTP (String vs String)
        ↓
No match? → Decrement attempts_left → 400 (X attempts left)
        ↓
Match → Delete OTP from DB
        ↓
200 Success
```

---

## 🔒 Security

### 1. OTP Expiry Check
OTP is valid for **5 minutes** only. Once expired, it is deleted from the database and the user must request a new OTP.

### 2. Attempts Tracking
A maximum of **3 attempts** are allowed. After 3 incorrect attempts, the OTP is deleted from the database and the user must request a new OTP.

### 3. String Comparison
Both the user OTP and the hashed OTP are converted to `String()` before comparison to avoid type mismatch issues.

### 4. OTP Cleanup
After successful verification, the OTP is **deleted from the database** to prevent reuse.

---

## 🗄️ Database

### Table: `unwind_otp`

| Column | Type | Value |
|---|---|---|
| id | SERIAL PK | Unique ID |
| email | VARCHAR UNIQUE | User's email address |
| hashed_otp | TEXT | Bcrypt hashed OTP |
| expires_at | TIMESTAMP | Current time + 5 minutes |
| attempts_left | INT | Default 3 |
| created_at | TIMESTAMP | Record creation time |

### Queries Used:

| Query | When |
|---|---|
| SELECT * | Fetch OTP record |
| UPDATE attempts_left - 1 | On incorrect OTP |
| DELETE | On expiry, attempts exhausted, or success |
