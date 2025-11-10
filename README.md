\# 🛒 NexCartBD - Modern E-commerce Platform



NexCartBD is a complete, modern bilingual (Bangla \& English) e-commerce solution built from scratch. It features a fast, responsive customer-facing frontend powered by React (Vite) and a comprehensive admin panel for managing the entire store.



This project was built step-by-step, focusing on best practices, scalability, and a clean user experience.



\*\*(Suggestion: Add your screenshots or a GIF of the app in action here!)\*\*

---



\## ✨ Key Features



\### 🛍️ Customer Frontend

\* \*\*Bilingual Support:\*\* Full EN/BN translation using `i18next`.

\* \*\*Sticky Header \& Mega Menu:\*\* A fixed header with a dynamic, API-driven category mega menu.

\* \*\*Product Listing:\*\* Filter products by category, subcategory, or search query (`/products?category=...`).

\* \*\*Product Details:\*\* Image gallery, size/color selection (with validation), stock status, and delivery info.

\* \*\*Advanced Cart:\*\* Persistent cart using Context API and `localStorage`.

\* \*\*Dynamic Checkout:\*\* Multi-step checkout with delivery charge calculation.

\* \*\*Manual Payment Logic:\*\* Supports bKash, Nagad, Rocket, Bank, and COD, with conditional `TxnID` validation.

\* \*\*Authentication:\*\* Full user login and registration flow (`/auth/register`, `/auth/login`).

\* \*\*Protected Routes:\*\* User Dashboard and Checkout are protected; unauthorized users are redirected to login.

\* \*\*User Dashboard:\*\* Users can view their profile and detailed order history (`/dashboard/orders`).



\### ⚙️ Admin Panel

\* \*\*Secure Admin Routes:\*\* Protected by JWT (`adminToken`) and a Secret Key (`x-nextcardbd-admin`).

\* \*\*KPI Dashboard:\*\* Live dashboard with `recharts` graphs showing Total Orders, Total Revenue, Total Profit, etc.

\* \*\*Order Management:\*\*

&nbsp;   \* View all customer orders.

&nbsp;   \* Verify manual payments (`PATCH /admin/orders/:id/verify`).

&nbsp;   \* Update shipping status via a modal (`PATCH /admin/orders/:id/shipping`).

\* \*\*Product Management (Full CRUD):\*\*

&nbsp;   \* View all products (`GET /admin/products/all`).

&nbsp;   \* Create new products (`POST /admin/products`).

&nbsp;   \* Edit existing products (`PUT /admin/products/:id`).

&nbsp;   \* Delete products (`DELETE /admin/products/:id`).

\* \*\*Category Management (Full CRUD):\*\*

&nbsp;   \* Create/Delete main categories (`POST /admin/categories`).

&nbsp;   \* Create/Delete subcategories (linked to a parent).

\* \*\*User Management:\*\* View a list of all registered customers.

\* \*\*Settings Page:\*\* Update site-wide payment information (bKash/Nagad numbers).



---



\## 🛠️ Technology Stack



\* \*\*Frontend:\*\*

&nbsp;   \* \*\*Framework:\*\* React 18 (with Vite)

&nbsp;   \* \*\*Routing:\*\* `react-router-dom` v6

&nbsp;   \* \*\*State Management:\*\* React Context API (for Auth \& Cart)

&nbsp;   \* \*\*API Client:\*\* `axios` (with interceptors for auth headers)

&nbsp;   \* \*\*UI/Animation:\*\* `swiper/react`, `recharts`

&nbsp;   \* \*\*Internationalization (i18n):\*\* `i18next`

&nbsp;   \* \*\*Styling:\*\* Plain CSS (Modular)



\* \*\*Backend:\*\*

&nbsp;   \* \*\*Framework:\*\* Node.js, Express

&nbsp;   \* \*\*Database:\*\* MongoDB Atlas

&nbsp;   \* \*\*Authentication:\*\* JWT (JSON Web Tokens)

&nbsp;   \* \*\*Hosting:\*\* Render



---



\## 🚀 How to Run Locally



1\.  \*\*Clone the repository:\*\*

&nbsp;   ```bash

&nbsp;   git clone \[https://github.com/nextcardbd/nextcardbd.git](https://github.com/nextcardbd/nextcardbd.git)

&nbsp;   cd nexcartbd-frontend

&nbsp;   ```



2\.  \*\*Install dependencies:\*\*

&nbsp;   ```bash

&nbsp;   npm install

&nbsp;   ```



3\.  \*\*Create an environment file:\*\*

&nbsp;   Create a new file named `.env` in the root of the `nexcartbd-frontend` folder.



4\.  \*\*Add environment variables:\*\*

&nbsp;   Copy the following and paste it into your new `.env` file. This points the frontend to your live backend.

&nbsp;   ```env

&nbsp;   # The base URL of your live backend API

&nbsp;   VITE\_API\_BASE\_URL="\[https://nextcardbd.onrender.com/api/v1](https://nextcardbd.onrender.com/api/v1)"

&nbsp;   ```



5\.  \*\*Run the development server:\*\*

&nbsp;   ```bash

&nbsp;   npm run dev

&nbsp;   ```

&nbsp;   Open \[http://localhost:5173](http://localhost:5173) to view it in your browser.



---



\## 🔗 API Endpoints



\* \*\*Public API:\*\* `https://nextcardbd.onrender.com/api/v1/public/...`

\* \*\*Auth API:\*\* `https://nextcardbd.onrender.com/api/v1/auth/...`

\* \*\*User API (Protected):\*\* `https://nextcardbd.onrender.com/api/v1/user/...`

\* \*\*Admin API (Protected):\*\* `https://nextcardbd.onrender.com/api/v1/admin/...`



---



\## © Copyright



\*\*© NexCartBD — Developed by Mahin Ltd (Tanvir)\*\*

