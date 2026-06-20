<div align="center">
  
  <img src="https://img.shields.io/badge/ZYNGO-Food%20Delivery-FF6B35?style=for-the-badge&logo=foodpanda&logoColor=white" width="200" />
  
  # 🚀 ZYNGO | Full Stack Food Delivery Platform
  
  [![Website](https://img.shields.io/badge/Website-zyngo.vercel.app-FF6B35?style=for-the-badge&logo=vercel)](https://zyngo-omega.vercel.app/)
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/alok957641/zyngo)
  [![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
  [![Tailwind](https://img.shields.io/badge/Tailwind-3.3.5-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
  
  ### Complete Food Ordering & Delivery Management System
  
  **Built with ❤️ by Alok Kumar**
  
</div>

---

## 📌 About The Project

**ZYNGO** is a full-stack food delivery web application that connects users, restaurant owners, delivery boys, and admins on a single platform. It provides a seamless food ordering experience with real-time tracking and multiple user roles.

### ✨ Key Features

- 🔐 **User Authentication & Authorization** - Secure login/register with JWT
- 👤 **User Panel** - Browse restaurants, place orders, track deliveries
- 🏪 **Owner Panel** - Manage restaurants, menus, and orders
- 🚴 **Delivery Boy Panel** - Accept deliveries, update status, track earnings
- 🛠️ **Admin Panel** - Full control over users, restaurants, and orders
- 📍 **Real-Time Order Tracking** - Live location tracking for deliveries
- 📱 **Fully Responsive Design** - Works on all devices
- 🍔 **Restaurant Management** - Add, edit, delete restaurants and menu items
- 📦 **Order Management** - Real-time order status updates
- 💳 **Secure Payment Integration** - Safe and reliable payments
- ⚡ **Fast and Scalable Performance** - Optimized for speed

---

## 📸 Screenshots

### 🏠 Home Page

<img width="1920" height="1008" alt="home png" src="https://github.com/user-attachments/assets/949dd14d-8f24-4627-87f3-016a461b0620" />

### 🛠️ Admin Panel

<img width="1920" height="1008" alt="admin png" src="https://github.com/user-attachments/assets/1b529a7e-2155-4a75-8815-edc7b00cb08c" />


### 📍 Raider panel
<img width="1920" height="1008" alt="raider png" src="https://github.com/user-attachments/assets/8185fa94-493c-46c5-ba43-ab4f15815a5f" />

###  user Panel

<img width="1920" height="1008" alt="user png" src="https://github.com/user-attachments/assets/62883c00-ede7-4e0e-a9b1-a628e4dfe677" />

### 🏪 owner Panel

<img width="1920" height="1008" alt="Screenshot 2026-06-20 214731" src="https://github.com/user-attachments/assets/dedda4ec-a4f5-45b5-8b18-be0e36dee7b0" />


### 🏪 Resturents And Foods 
<img width="1920" height="1008" alt="Screenshot 2026-06-20 212149" src="https://github.com/user-attachments/assets/faf633e8-902c-4cdc-832f-ca6e759d5c02" />

---

## 🛠️ Built With

### Frontend
- **React 18** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router DOM** - Navigation
- **Axios** - API Calls
- **React Icons** - Icons

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - API Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcryptjs** - Password Hashing
- **Multer** - File Upload

### Deployment
- **Vercel** - Frontend Hosting
- **Render** - Backend Hosting
- **MongoDB Atlas** - Cloud Database

---

## 📁 Project Structure

```
zyngo/
│
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── logo.png
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Restaurants.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderTracking.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── DeliveryDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── constants.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── restaurantController.js
│   │   ├── orderController.js
│   │   ├── deliveryController.js
│   │   └── adminController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   └── Delivery.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── deliveryRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   │
│   ├── utils/
│   │   └── db.js
│   │
│   ├── index.js
│   └── package.json
│
├── screenshots/                         # Screenshots Folder
│   ├── home.png
│   ├── admin.png
│   ├── tracking.png
│   └── owner.png
│
├── .env
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js (v18 or higher)
npm (v9 or higher)
MongoDB (local or cloud)
```

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/alok957641/zyngo.git
cd zyngo
```

#### 2️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
```

#### 3️⃣ Install Backend Dependencies

```bash
cd ../backend
npm install
```

#### 4️⃣ Environment Variables

**Frontend `.env` (frontend/):**

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**Backend `.env` (backend/):**

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/zyngo
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

#### 5️⃣ Start Development Server

**Frontend:**

```bash
cd frontend
npm run dev
```

**Backend:**

```bash
cd backend
npm run dev
```

#### 6️⃣ Build for Production

**Frontend:**

```bash
cd frontend
npm run build
```

**Backend:**

```bash
cd backend
npm run build
```

---

## 🌐 Live Demo

| Environment | URL |
|-------------|-----|
| **Production** | https://zyngo-omega.vercel.app/ |
| **Development** | http://localhost:5173 |
| **API** | http://localhost:5000 |

---

## 📱 User Roles & Panels

| Role | Panel | Features |
|------|-------|----------|
| **User** | User Panel | Browse restaurants, place orders, track deliveries, view history |
| **Owner** | Owner Panel | Manage restaurant, menu items, view orders, update status |
| **Delivery Boy** | Delivery Panel | Accept deliveries, update live location, view earnings |
| **Admin** | Admin Panel | Manage all users, restaurants, orders, platform analytics |

---

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary** | `#FF6B35` | Buttons, Headings, Gradients |
| **Secondary** | `#2D3436` | Text, Dark elements |
| **Accent** | `#F9CA24` | Highlights, Icons |
| **Background** | `#F8F9FA` | Page Background |
| **Card** | `#FFFFFF` | Card Background |
| **Success** | `#00B894` | Success messages |
| **Danger** | `#E17055` | Error messages |

---

## 📦 Dependencies

### Frontend Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "framer-motion": "^10.16.0",
  "axios": "^1.4.0",
  "react-icons": "^4.11.0",
  "react-hot-toast": "^2.4.0"
}
```

### Backend Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "multer": "^1.4.5",
  "express-validator": "^7.0.0"
}
```

---

## 🔧 Available Scripts

### Frontend

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Create production build

# Preview
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

### Backend

```bash
# Development
npm run dev          # Start dev server with nodemon

# Production
npm start            # Start production server
```

---

## 📈 Features Roadmap

- [x] User Authentication
- [x] Restaurant Management
- [x] Order Management
- [x] Real-Time Tracking
- [x] Multiple User Roles
- [x] Responsive Design
- [ ] Payment Gateway Integration
- [ ] Push Notifications
- [ ] AI-Based Recommendations
- [ ] Chat Support

---

## 🚀 Deployment

### Deploy Frontend to Vercel

```bash
cd frontend
npm install -g vercel
vercel --prod
```

### Deploy Backend to Render

1. Push code to GitHub
2. Connect repository to Render
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`

### Deploy Frontend to Netlify

```bash
cd frontend
npm install -g netlify-cli
netlify deploy --prod
```

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JSON Web Token secret |
| `FRONTEND_URL` | Frontend URL for CORS |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key |

---

## 🤝 Contributing

1. **Fork** the Project
2. **Create** your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your Changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the Branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📞 Contact & Support

| Platform | Link |
|----------|------|
| **Email** | rajalok957641@gmail.com |
| **LinkedIn** | [Alok Kumar](https://www.linkedin.com/in/alok-kumar-304980314) |
| **GitHub** | [alok957641](https://github.com/alok957641) |

---

## 🙏 Acknowledgments

- React - UI Library
- Node.js - Backend Runtime
- MongoDB - Database
- Vercel - Frontend Hosting
- Render - Backend Hosting

---

## ⭐ Support

**If you like this project, don't forget to give it a star ⭐**

---

<div align="center">

**Built with ❤️ by Alok Kumar**

**[⬆ Back to Top](#)**

</div>
