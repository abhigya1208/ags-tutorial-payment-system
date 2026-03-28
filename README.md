# AGS Tutorial – Online Fee Payment System

> **Stack:** MongoDB · Express · React (Vite) · Node.js  
> **Payments:** Razorpay (UPI, Cards, NetBanking)  
> **Styling:** Tailwind CSS · Sora + Plus Jakarta Sans fonts

---

## 📁 Project Structure

```
ags-tutorial/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Admin login + seed
│   │   ├── paymentController.js   # Razorpay order + verify
│   │   └── adminController.js     # Dashboard data
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT guard
│   ├── models/
│   │   ├── Admin.js               # Admin schema (bcrypt)
│   │   └── Payment.js             # Payment schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── adminRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Express entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # JWT auth state
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       # Landing page
│   │   │   ├── PaymentPage.jsx    # Fee payment form
│   │   │   ├── ReceiptPage.jsx    # Success + PDF download
│   │   │   ├── AdminLogin.jsx     # Admin login
│   │   │   └── AdminDashboard.jsx # Payments table
│   │   ├── utils/
│   │   │   ├── api.js             # Axios instance
│   │   │   └── generatePDF.js     # jsPDF receipt
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- **Node.js** v18 or higher (`node -v` to check)
- **MongoDB** running locally **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **Razorpay test account** — sign up at [dashboard.razorpay.com](https://dashboard.razorpay.com)

---

### Step 1 – Get Razorpay Test Keys

1. Log in to [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Go to **Settings → API Keys**
3. Select **Test Mode** and click **Generate Key**
4. Copy both `Key ID` (starts with `rzp_test_`) and `Key Secret`

---

### Step 2 – Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/ags_tutorial
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
JWT_SECRET=any_long_random_string_here
FRONTEND_URL=http://localhost:5173
PORT=5000
```

Install dependencies and start:

```bash
npm install
npm run dev      # uses nodemon for auto-restart
```

The API will be live at **http://localhost:5000**

---

### Step 3 – Configure Frontend

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
VITE_API_BASE_URL=http://localhost:5000
```

Install dependencies and start:

```bash
npm install
npm run dev
```

The React app will open at **http://localhost:5173**

---

### Step 4 – Create the Admin Account (one-time)

After starting the backend, call the seed endpoint once:

```bash
curl -X POST http://localhost:5000/api/auth/seed
```

Or open it in your browser or Postman. This creates:
- **Email:** `admin@ags.com`
- **Password:** `Admin@123`

Then visit **http://localhost:5173/admin/login** to log in.

---

## 🧪 Testing Payments (Test Mode)

Use Razorpay's test cards / UPI to simulate payments:

| Method | Details |
|--------|---------|
| **Card** | `4111 1111 1111 1111` · Any future expiry · CVV `123` |
| **UPI** | `success@razorpay` (success) · `failure@razorpay` (fail) |
| **NetBanking** | Select any bank → use test credentials shown |

> ⚠️ Test payments do NOT charge real money.

---

## 🌐 Deployment on Render

### Backend (Web Service)

1. Push your code to a GitHub repository
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your repository, set root directory to `backend`
4. **Build command:** `npm install`
5. **Start command:** `npm start`
6. Add **Environment Variables** (from your `.env`):
   - `MONGODB_URI` — your Atlas connection string
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `JWT_SECRET`
   - `FRONTEND_URL` — your frontend Render URL (set after deploying frontend)
   - `PORT` — `5000`

### Frontend (Static Site)

1. **New Static Site** on Render
2. Root directory: `frontend`
3. **Build command:** `npm install && npm run build`
4. **Publish directory:** `dist`
5. Add **Environment Variables**:
   - `VITE_RAZORPAY_KEY_ID` — your Razorpay key
   - `VITE_API_BASE_URL` — your backend Render URL (e.g. `https://ags-backend.onrender.com`)

> After deploying both, update the backend's `FRONTEND_URL` to your frontend URL, then redeploy the backend.

---

## 🔑 API Endpoints Reference

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/` | ✗ | Health check |
| `POST` | `/api/auth/seed` | ✗ | Create default admin (run once) |
| `POST` | `/api/auth/login` | ✗ | Admin login → returns JWT |
| `POST` | `/api/payment/create-order` | ✗ | Create Razorpay order |
| `POST` | `/api/payment/verify` | ✗ | Verify payment signature |
| `GET` | `/api/admin/payments` | ✅ JWT | All paid payments |
| `GET` | `/api/admin/payments/:id` | ✅ JWT | Single payment |

---

## 🎨 Colour Palette

| Name | Hex | Usage |
|------|-----|-------|
| Violet | `#8b5cf6` | Primary / brand |
| Emerald | `#10b981` | Success / green |
| Amber | `#fbbf24` | Accent / peach |
| Saffron | `#f97316` | Accent / orange |

---


## 📜 Licence

MIT – free to use for learning, ask before use it for commercial purposes. 
