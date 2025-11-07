# Sarahah App 💬

A full-featured Sarahah-style anonymous messaging app built with **Node.js**, **Express**, and **MongoDB** — featuring **JWT authentication**, **OTP verification**, **Google OAuth login**, image uploads with **Multer & Cloudinary**, and modular **MVC architecture**.

---

## 🚀 Features
- User authentication with JWT (login, register, logout, refresh token)
- OTP-based email verification
- Google OAuth login support
- Anonymous & non-anonymous messaging system
- Upload and manage profile images & message attachments (local or Cloudinary)
- Account soft delete & auto cleanup via scheduler
- Global error handling & rate limiting
- Modular and scalable folder structure (Auth, User, Message modules)

---

## 🧱 Project Structure
```
src/
 ┣ 📁 modules/
 ┃ ┣ 📁 auth/
 ┃ ┣ 📁 user/
 ┃ ┗ 📁 message/
 ┣ 📁 DB/
 ┣ 📁 middlewares/
 ┣ 📁 utils/
 ┣ app.controller.js
 ┗ index.js
```

---

## ⚙️ Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/YoussefNasser222/sarahah-app.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in the root directory and add the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

---

## 📡 API Endpoints Overview

| Module | Endpoint | Method | Description |
|---------|-----------|--------|-------------|
| Auth | `/auth/register` | POST | Register new user |
| Auth | `/auth/login` | POST | Login user |
| Auth | `/auth/google` | GET | Login with Google OAuth |
| Auth | `/auth/verify-otp` | POST | Verify OTP code |
| User | `/user/profile` | GET | Get user profile |
| User | `/user/update` | PUT | Update profile info |
| Message | `/message/send` | POST | Send anonymous message |
| Message | `/message/received` | GET | View received messages |

---

## 👨‍💻 Developer

**Youssef Nasser**  
📧 Email: [youssefnasser6000@gmail.com](mailto:youssefnasser6000@gmail.com)  
💼 LinkedIn: [linkedin.com/in/youssef-nasser-7396572a0](https://www.linkedin.com/in/youssef-nasser-7396572a0/)  
🐙 GitHub: [github.com/YoussefNasser222](https://github.com/YoussefNasser222)

---

## 🧠 Keywords
`Node.js` `Express` `MongoDB` `JWT` `OAuth` `Cloudinary` `Multer` `Sarahah` `Anonymous Messages` `Backend API`

---

## ⭐ Show Support
If you like this project, don't forget to **star** the repository! 🌟
