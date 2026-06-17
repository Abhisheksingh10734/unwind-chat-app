# 💬 Chat App — Full Planning

---

## ✅ Features

```
1. OTP based login/signup
2. Custom username selection (after signup)
3. Chat list
4. Real-time messaging
5. Typing indicator
6. Online/offline status
7. Last seen
8. Profile (username, avatar edit)
```

---

## 🗄️ DB Schema (PostgreSQL)

### `users`
| Column | Type | Description |
|---|---|---|
| id | SERIAL PK | Unique ID |
| username | VARCHAR | Display name |
| email | VARCHAR UNIQUE | Email |
| avatar | VARCHAR | Cloudinary URL |
| is_verified | BOOLEAN | OTP verified? |
| is_online | BOOLEAN | Online status |
| last_seen | TIMESTAMP | Last active time |
| refresh_token | VARCHAR | JWT refresh token |
| created_at | TIMESTAMP | Account created |

### `otps`
| Column | Type | Description |
|---|---|---|
| id | SERIAL PK | Unique ID |
| email | VARCHAR | User email |
| hashed_otp | VARCHAR | Bcrypt hashed OTP |
| expires_at | TIMESTAMP | OTP expiry time |
| created_at | TIMESTAMP | Created time |

### `messages`
| Column | Type | Description |
|---|---|---|
| id | SERIAL PK | Unique ID |
| sender_id | INT FK | Sender (users.id) |
| receiver_id | INT FK | Receiver (users.id) |
| text | TEXT | Message content |
| status | VARCHAR | sent/delivered/seen |
| created_at | TIMESTAMP | Sent time |

### `conversations`
| Column | Type | Description |
|---|---|---|
| id | SERIAL PK | Unique ID |
| user1_id | INT FK | User 1 (users.id) |
| user2_id | INT FK | User 2 (users.id) |
| last_message_id | INT FK | Last message (messages.id) |
| updated_at | TIMESTAMP | Last activity |

---

## 🛣️ API Routes

### 🔐 Auth (`/auth`)
```
POST /auth/send-otp
POST /auth/resend-otp
POST /auth/verify-otp
POST /auth/logout
POST /auth/refresh-token
GET  /auth/me
```

### 👤 Users (`/users`)
```
GET   /users        ← Sabke users (chat list ke liye)
GET   /users/:id    ← Specific user info
PATCH /users/:id    ← Profile update (username, avatar)
```

### 💬 Messages (`/messages`)
```
GET   /messages/:conversationId    ← Conversation ke saare messages
POST  /messages                    ← Message save karo
PATCH /messages/:id/status         ← Status update (delivered/seen)
```

### 🗂️ Conversations (`/conversations`)
```
GET  /conversations      ← Meri saari conversations (chat list)
GET  /conversations/:id  ← Specific conversation
POST /conversations      ← Nayi conversation start karo
```

---

## 🔌 Socket Events

### Client → Server (emit)
```
join              ← User online hua
leave             ← User offline hua
private-message   ← Message bhejo
typing            ← Typing shuru
stop-typing       ← Typing band
```

### Server → Client (on)
```
receive-message   ← Naya message aaya
user-online       ← Koi online hua
user-offline      ← Koi offline hua
typing            ← Koi type kar raha hai
stop-typing       ← Typing band ho gayi
```

---

## 🎨 Pages

```
/               ← Landing page (Login/Signup)
/verify-otp     ← OTP verification
/setup          ← Username selection (first time)
/chats          ← Chat list
/chats/:id      ← Specific chat
/profile        ← Apna profile
```

---

## 🏗️ Tech Stack

| Part | Technology |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | Express.js |
| Database | PostgreSQL (Raw SQL) |
| Realtime | Socket.IO |
| Auth | JWT + OTP |
| Image Upload | Cloudinary |

---

## 📋 Development Order

```
1. DB tables banao
2. Auth APIs (send-otp, verify-otp, refresh-token)
3. Users API
4. Conversations API
5. Messages API
6. Socket setup
7. Frontend pages (structure)
8. Frontend API connect
9. Socket frontend connect
10. Styling (Tailwind)
```

> 💡 Tip: Har feature ka order → DB → API → Postman test → Frontend
