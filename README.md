# SoulSync – Backend

SoulSync Backend is a RESTful API server that powers the SoulSync matchmaking platform, handling authentication, real-time communication, user data, and media uploads.

It is designed for scalability, security, and real-time interaction.

This project was developed for **JS Club – Japanese Software Engineers**.

---

## ✨ Features

- RESTful API architecture
- JWT-based authentication (Access & Refresh Tokens)
- Secure password hashing with bcrypt
- Real-time chat using Socket.IO
- Image upload support
- Email service integration
- MongoDB database with Mongoose ODM

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (Access & Refresh Tokens)
- **Real-time:** Socket.IO
- **Email:** Nodemailer
- **Security:** bcrypt, cookie-parser, CORS
- **Deployment:** Render

### 🔐 Authentication Flow

- User logs in and receives:
  - Access Token
  - Refresh Token
- Tokens are used to authenticate protected API routes
- Passwords are securely hashed using bcrypt

### 🔄 Real-time Communication
Socket.IO is used for:
- Real-time anonymous chat
- Live message updates
- Online presence handling

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URI=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
```

---

## 🚀 Getting Started
1. Clone repository
2. Install dependencies
```
npm install
```
3. Start server
```
npm start
```

The server will run on the configured port in server.js.

---

## 👥 Team

Developed by a 6-member team under JS Club – Japanese Software Engineers.

---

## 📄 License

ISC License
