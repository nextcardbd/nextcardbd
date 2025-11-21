# 🛒 NexCartBD — Modern Bilingual E-Commerce Platform

A fast, modern, full-featured bilingual (Bangla + English) e-commerce platform built from scratch.  
Includes a beautiful customer frontend, a powerful admin panel, and a scalable Node.js backend API.

> ⚡ Built with clean architecture, secure authentication, responsive UI, and production-ready best practices.

---

## 🌐 Live Demo

- **Frontend:** https://nextcardbd.mahinltd.tech  
- **Admin Panel:** https://nextcardbd.mahinltd.tech/admin  
  (Requires valid admin credentials)

---

## ✨ Key Features

### 🛍️ Customer Frontend
- **Bilingual Interface (BN/EN)** using i18next  
- **Sticky Header + Mega Menu** with dynamic categories  
- **Product Listing** with filters & search  
- **Product Details** with gallery, variations, and stock status  
- **Advanced Cart System** (localStorage + Context API)  
- **Checkout Flow** with delivery charge calculation  
- **Manual Payment Support:** bKash, Nagad, Rocket, Bank, COD  
- **User Authentication:** Login/Signup  
- **Protected Pages:** Checkout & Dashboard  
- **User Dashboard:** Orders, profile view, and order history  

---

### ⚙️ Admin Panel (Secure)
- **JWT-Protected Admin Routes**  
- **Role-Based Access Control**  
- **Admin Header Validation (x-nextcardbd-admin)**  
- **Real-time KPI Dashboard** (Orders, Revenue, Profit)  
- **Order Management:** Verify payments, update shipping  
- **Product CRUD:** Create, update, delete products  
- **Category & Subcategory Management**  
- **User Management:** View customers  
- **Settings:** Update payment numbers  

---

## 🛠️ Technology Stack

### Frontend
- **React 18** (Vite)
- React Router DOM v6  
- Axios with interceptors  
- Context API (Auth + Cart)  
- i18next for translation  
- Swiper / Recharts  
- Modular CSS  

### Backend
- **Node.js + Express**  
- MongoDB Atlas  
- JWT Authentication  
- Render Hosting  

---

## 🚀 Run Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/nextcardbd/nextcardbd.git
cd nexcartbd-frontend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Create `.env` File
Inside `nexcartbd-frontend`, create a new `.env` file.

### 4️⃣ Add Environment Variable
```env
VITE_API_BASE_URL="https://nextcardbd.onrender.com/api/v1"
```

### 5️⃣ Run Development Server
```bash
npm run dev
```
Open: http://localhost:5173

---

## 🔗 API Endpoints
- **Public API:** `/public/...`  
- **Auth API:** `/auth/...`  
- **User API:** `/user/...`  
- **Admin API:** `/admin/...`  

Base URL:  
```
https://nextcardbd.onrender.com/api/v1
```

---

## 📸 Screenshots (Recommended)
> Add screenshots/GIFs of your UI here  
- Homepage  
- Product Page  
- Cart  
- Admin Dashboard  
- Add Product Page  

---

## © Copyright
**© NexCartBD — Developed by Mahin Ltd (Tanvir)**
