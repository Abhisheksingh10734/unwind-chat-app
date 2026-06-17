# 📋 API Response Codes & Messages

---

## 🔐 Auth Routes

### `POST /auth/send-otp`
| Code | Message |
|---|---|
| 200 | OTP sent successfully |
| 400 | Email is required |
| 429 | Too many requests |
| 500 | Internal server error |

---

### `POST /auth/resend-otp`
| Code | Message |
|---|---|
| 200 | OTP resent successfully |
| 400 | Email is required |
| 404 | User not found |
| 429 | Too many requests |
| 500 | Internal server error |

---

### `POST /auth/verify-otp`
| Code | Message |
|---|---|
| 200 | OTP verified successfully |
| 400 | Email and OTP are required |
| 400 | Invalid OTP |
| 400 | OTP expired |
| 403 | Too many attempts. Request a new OTP |
| 404 | OTP not found. Request a new OTP |
| 500 | Internal server error |

---

### `POST /auth/logout`
| Code | Message |
|---|---|
| 200 | Logged out successfully |
| 401 | No refresh token found |
| 500 | Internal server error |

---

### `GET /auth/me`
| Code | Message |
|---|---|
| 200 | User fetched successfully |
| 401 | No token provided |
| 401 | Invalid or expired token |
| 404 | User not found |
| 500 | Internal server error |

---

### `POST /auth/refresh-token`
| Code | Message |
|---|---|
| 200 | Token refreshed successfully |
| 401 | No refresh token found |
| 401 | Invalid or expired refresh token |
| 500 | Internal server error |

---

## 👤 User Routes

### `GET /users`
| Code | Message |
|---|---|
| 200 | Users fetched successfully |
| 401 | No token provided |
| 401 | Invalid or expired token |
| 500 | Internal server error |

---

### `GET /users/:id`
| Code | Message |
|---|---|
| 200 | User fetched successfully |
| 400 | User ID is required |
| 401 | No token provided |
| 401 | Invalid or expired token |
| 404 | User not found |
| 500 | Internal server error |

---

### `PATCH /users/:id`
| Code | Message |
|---|---|
| 200 | Profile updated successfully |
| 400 | User ID is required |
| 400 | Nothing to update |
| 401 | No token provided |
| 401 | Invalid or expired token |
| 403 | Unauthorized. You can only update your own profile |
| 404 | User not found |
| 500 | Internal server error |

---

## 💬 Message Routes

### `GET /messages/:conversationId`
| Code | Message |
|---|---|
| 200 | Messages fetched successfully |
| 400 | Conversation ID is required |
| 401 | No token provided |
| 401 | Invalid or expired token |
| 403 | Unauthorized. You are not part of this conversation |
| 404 | Conversation not found |
| 500 | Internal server error |

---

### `POST /messages`
| Code | Message |
|---|---|
| 200 | Message sent successfully |
| 400 | Conversation ID and text are required |
| 401 | No token provided |
| 401 | Invalid or expired token |
| 403 | Unauthorized. You are not part of this conversation |
| 404 | Conversation not found |
| 500 | Internal server error |

---

### `PATCH /messages/:id/status`
| Code | Message |
|---|---|
| 200 | Message status updated successfully |
| 400 | Message ID is required |
| 400 | Invalid status value |
| 401 | No token provided |
| 401 | Invalid or expired token |
| 403 | Unauthorized. You can only update status of messages sent to you |
| 404 | Message not found |
| 500 | Internal server error |

---

## 🗂️ Conversation Routes

### `GET /conversations`
| Code | Message |
|---|---|
| 200 | Conversations fetched successfully |
| 401 | No token provided |
| 401 | Invalid or expired token |
| 500 | Internal server error |

---

### `GET /conversations/:id`
| Code | Message |
|---|---|
| 200 | Conversation fetched successfully |
| 400 | Conversation ID is required |
| 401 | No token provided |
| 401 | Invalid or expired token |
| 403 | Unauthorized. You are not part of this conversation |
| 404 | Conversation not found |
| 500 | Internal server error |

---

### `POST /conversations`
| Code | Message |
|---|---|
| 200 | Conversation created successfully |
| 400 | Receiver ID is required |
| 401 | No token provided |
| 401 | Invalid or expired token |
| 404 | Receiver not found |
| 409 | Conversation already exists |
| 500 | Internal server error |
