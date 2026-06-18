# `profileSetup` Controller

Handles new user profile creation — validates input, uploads avatar to Cloudinary, inserts user into the database, generates JWT tokens, and returns them via HTTP-only cookies.

---

## Table of Contents

- [Endpoint](#endpoint)
- [Request](#request)
- [Validation Rules](#validation-rules)
- [Flow](#flow)
- [Response](#response)
- [Error Codes](#error-codes)
- [Dependencies](#dependencies)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Notes](#notes)

---

## Endpoint

```
POST /api/v1/auth/profile-setup
```

> Route and prefix may vary depending on your Express router configuration.

---

## Request

**Content-Type:** `application/json`

### Body

| Field      | Type     | Required | Description                                      |
|------------|----------|----------|--------------------------------------------------|
| `avatar`   | `string` | Yes      | Base64 string, URL, or local file path of image  |
| `username` | `string` | Yes      | 2–30 characters, auto-capitalized on each word   |
| `email`    | `string` | Yes      | Valid email address format                        |

### Example Request Body

```json
{
  "avatar": "https://example.com/photo.jpg",
  "username": "john doe",
  "email": "john@example.com"
}
```

---

## Validation Rules

| Field      | Rule                                              |
|------------|---------------------------------------------------|
| `avatar`   | Must be present (non-empty)                       |
| `username` | 2–30 characters after trimming and capitalizing   |
| `email`    | Validated via `verifyEmail()` utility             |
| Uniqueness | Both `username` and `email` must not already exist in DB |

> Username is automatically trimmed and each word is capitalized. Example: `"john doe"` → `"John Doe"`

---

## Flow

```
POST /profile-setup
  │
  ├── 1. Extract avatar, username, email from req.body
  │
  ├── 2. Missing fields check → 400 if any missing
  │
  ├── 3. Capitalize username (trim + title case)
  │
  ├── 4. Validate email format via verifyEmail() → 400 if invalid
  │
  ├── 5. Username length check (2–30 chars) → 400 if out of range
  │
  ├── 6. Check DB for duplicate username or email → 409 if exists
  │
  ├── 7. Upload avatar to Cloudinary
  │     └── folder: unwind/avatars
  │     └── transformation: 400×400 face crop, auto quality/format
  │
  ├── 8. Verify uploadResult has secure_url → 500 if missing
  │
  ├── 9. INSERT user into unwind_users table
  │     └── username, email, avatar, avatar_public_id,
  │         is_verified=false, is_online=false, refresh_token=null
  │
  ├── 10. Generate accessToken + refreshToken via JWT services
  │
  ├── 11. UPDATE unwind_users SET refresh_token in DB
  │
  ├── 12. Set HTTP-only cookies (accessToken + refreshToken)
  │
  └── 13. Return 201 with user object + accessToken in body
```

---

## Response

### Success — `201 Created`

```json
{
  "success": true,
  "message": "Profile setup successfully!",
  "user": {
    "id": 1,
    "username": "John Doe",
    "email": "john@example.com",
    "avatar": "https://res.cloudinary.com/your-cloud/image/upload/...",
    "is_verified": false,
    "is_online": false,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "<jwt_access_token>"
}
```

**Cookies set:**

| Cookie         | MaxAge   | HttpOnly | Secure (prod) | SameSite |
|----------------|----------|----------|----------------|----------|
| `accessToken`  | 15 min   | Yes      | Yes            | Strict   |
| `refreshToken` | 7 days   | Yes      | Yes            | Strict   |

---

## Error Codes

| Status | Scenario                                     |
|--------|----------------------------------------------|
| `400`  | Missing fields (avatar / username / email)   |
| `400`  | Invalid email format                         |
| `400`  | Username out of range (< 2 or > 30 chars)    |
| `409`  | Username or email already exists in DB       |
| `500`  | Cloudinary upload failed                     |
| `500`  | No `secure_url` returned from Cloudinary     |
| `500`  | Internal server error (DB or unknown)        |

### Error Response Shape

```json
{
  "success": false,
  "message": "Human-readable error message."
}
```

> In `development` mode, an additional `error` field with the raw error message is included.

---

## Dependencies

| Module / File                          | Purpose                               |
|----------------------------------------|---------------------------------------|
| `../config/cloudinary.config.js`       | Cloudinary v2 SDK instance            |
| `../db/index.js`                       | PostgreSQL DB connection (via pg pool)|
| `../services/jwt.services.js`          | `generateAccessToken`, `generateRefreshToken` |
| `../utils/verifyEmail.utils.js`        | Email format validation utility       |

---

## Environment Variables

| Variable                  | Description                            | Example          |
|---------------------------|----------------------------------------|------------------|
| `CLOUDINARY_CLOUD_NAME`   | Your Cloudinary cloud name             | `my-cloud`       |
| `CLOUDINARY_API_KEY`      | Cloudinary API key                     | `123456789`      |
| `CLOUDINARY_API_SECRET`   | Cloudinary API secret                  | `abc123secret`   |
| `ACCESS_TOKEN_SECRET`     | JWT secret for access token signing    | `strongsecret1`  |
| `REFRESH_TOKEN_SECRET`    | JWT secret for refresh token signing   | `strongsecret2`  |
| `ACCESS_TOKEN_EXPIRY`     | Access token TTL                       | `15m`            |
| `REFRESH_TOKEN_EXPIRY`    | Refresh token TTL                      | `7d`             |
| `NODE_ENV`                | Environment (`development`/`production`) | `development`  |

---

## Database

### Table: `unwind_users`

```sql
CREATE TABLE unwind_users (
  id               SERIAL PRIMARY KEY,
  username         VARCHAR(30) UNIQUE NOT NULL,
  email            VARCHAR(255) UNIQUE NOT NULL,
  avatar           TEXT,
  avatar_public_id TEXT,
  is_verified      BOOLEAN DEFAULT FALSE,
  is_online        BOOLEAN DEFAULT FALSE,
  refresh_token    TEXT,
  created_at       TIMESTAMP DEFAULT NOW()
);
```

### Queries Used

```sql
-- Duplicate check
SELECT id FROM unwind_users WHERE username = $1 OR email = $2;

-- Insert new user
INSERT INTO unwind_users
  (username, email, avatar, avatar_public_id, is_verified, is_online, refresh_token)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING id, username, email, avatar, is_verified, is_online, created_at;

-- Save refresh token
UPDATE unwind_users SET refresh_token = $1 WHERE id = $2;
```

---

## Notes

- `avatar_public_id` is stored to support future deletion or replacement on Cloudinary.
- `is_verified` is `false` by default — email verification flow should be handled separately.
- `accessToken` is returned in both the cookie and the JSON body to support clients that cannot read cookies (e.g., mobile apps).
- `refreshToken` is only in the cookie and stored in DB — never exposed in the response body.
- In production, cookies require HTTPS (`secure: true` is enforced via `NODE_ENV`).
