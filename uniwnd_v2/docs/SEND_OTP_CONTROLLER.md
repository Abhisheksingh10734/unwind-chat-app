# 📧 Send OTP Controller

## Overview
The `sendOtp` controller handles the first step of the authentication flow. It validates the user's email, enforces rate limiting, generates a secure OTP, hashes it, saves it to the database, and sends it to the user's email address.

---

## 📁 File Location
```
server/
└── controllers/
    └── auth.controller.js
```

---

## 📦 Dependencies

| Package | Use |
|---|---|
| `nodemailer` | Email bhejne ke liye |
| `bcrypt` | OTP hash karne ke liye |
| `crypto` | Secure random OTP generate karne ke liye |
| `pg` | PostgreSQL queries ke liye |

---

## 🔗 Internal Imports

| Import | Location | Use |
|---|---|---|
| `sendOtpEmail` | `services/nodemailer.services.js` | Email send karna |
| `db` | `db/index.js` | Database connection |
| `generateOTP` | `services/generateOtp.services.js` | Random OTP generate karna |
| `hashOtp` | `services/hashOtp.services.js` | OTP hash karna |
| `verifyEmail` | `utils/verifyEmail.utils.js` | Email format validate karna |

---

## 🛣️ Route

```
POST /api/auth/send-otp
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
    "message": "OTP sent successfully to user@example.com"
}
```

### Error Responses:

| Status Code | Message | Reason |
|---|---|---|
| 400 | Email is required | Email body mein nahi hai |
| 400 | Invalid email format | Email format galat hai |
| 429 | Please wait X seconds before requesting a new OTP | OTP abhi active hai |
| 400 | Error while generating OTP. Please try again | OTP generate nahi hua |
| 400 | Error while generating OTP. Please try again | OTP hash nahi hua |
| 500 | Something went wrong | DB insert fail hua |
| 500 | Failed to send email | Email send nahi hui |
| 500 | Internal server error | Unexpected error |

---

## 🔄 Flow

```
Request aati hai (email)
        ↓
Email present hai? → Nahi → 400
        ↓
Email format valid hai? → Nahi → 400
        ↓
Rate limit check — OTP abhi active hai?
        ↓
Haan → 429 (timeLeft seconds baad try karo)
        ↓
Nahi → OTP generate karo
        ↓
OTP generate hua? → Nahi → 400
        ↓
OTP hash karo
        ↓
Hash hua? → Nahi → 400
        ↓
Expiry time set karo (5 minutes)
        ↓
DB mein save karo (UPSERT)
        ↓
Save hua? → Nahi → 500
        ↓
Email bhejo
        ↓
Email gayi? → Nahi → 500
        ↓
200 Success
```

---

## 🔒 Security

### 1. Email Validation
User ka email ek regex se validate hota hai — galat format pe request reject ho jaati hai।

### 2. Rate Limiting (Two Layers)

**Layer 1 — IP wise (express-rate-limit):**
```
Ek IP se 5 min mein sirf 3 requests allow hain
```

**Layer 2 — Email wise (DB check):**
```
Agar OTP abhi active hai (expire nahi hua) toh naya OTP nahi milega
User ko bataya jaata hai ki kitne seconds baad try kare
```

### 3. OTP Hashing
OTP plain text mein DB mein save nahi hota — `bcrypt` se hash hota hai। Matlab DB leak hone pe bhi OTP safe rahega।

### 4. OTP Expiry
OTP sirf **5 minutes** ke liye valid hota hai — expire hone ke baad kaam nahi karega।

---

## 🗄️ Database

### Table: `unwind_otp`

| Column | Type | Value |
|---|---|---|
| id | SERIAL PK | Unique ID |
| email | VARCHAR UNIQUE | User ka email |
| hashed_otp | TEXT | Bcrypt hashed OTP |
| expires_at | TIMESTAMP | Current time + 5 min |
| attempts_left | INT | Default 3 |
| created_at | TIMESTAMP | Record creation time |

### Query Type: UPSERT
```
Email pehli baar → INSERT
Email pehle se hai → UPDATE (naya OTP, naya expiry, attempts reset)
```

---

## ⚙️ Environment Variables

```
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```
