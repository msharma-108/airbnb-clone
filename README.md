# 🏡 Dummy Airbnb Website

This is a **fully server-side rendered web application** built with **Express.js** and **EJS templating**. It replicates core features of a rental platform like Airbnb, allowing users to act as hosts or guests, and integrates **Razorpay** to simulate payment flow in **test mode**.

---

## 🚀 Features

- **Server-side rendering** using Express and EJS  
- **User role system** with `Host` and `Guest` types  
- **Authentication** with `express-session` and **MongoDB**  
- **Simulated payments** using Razorpay in **test mode**  
- Session-based login and user flow management  
- Listing creation, booking, and basic role management  

---

## 🛠 Tech Stack

- Node.js  
- Express.js  
- EJS  
- MongoDB (with Mongoose)  
- Express-session  
- Razorpay (test mode)
- Express validator

---

## 🔐 Authentication

- **Sessions** are stored using `express-session` backed by MongoDB  
- MongoDB handles user info, sessions, listings, etc.  
- Middleware protects routes based on user roles  

---

## 💳 Payments (Test Mode)

- Razorpay is integrated for **dummy payments** only (not real transactions)
- Payments go to the **merchant** (you), not peer-to-peer  
- You must create a **Razorpay account** and add the following to your `.env` file:

```env
RAZORPAY_KEYID=your_key_id
RAZORPAY_SECRET=your_secret_key
