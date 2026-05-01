# 🏥 E-Hospital Management System

A full-stack Hospital Management System built with the MERN stack.

## 🔗 Live Demo
- **Frontend:** https://e-hospital-mu.vercel.app/
- **Backend API:** https://e-hospital-rglx.onrender.com/

## 🚀 Features
- JWT Authentication with role-based access (Patient, Doctor, Admin)
- Patient can browse doctors and book appointments
- Doctor can view and update appointment status, add prescriptions
- Admin can manage doctors and users
- Medical records and history
- Real-time notifications
- Search and filter doctors by specialization
- Filter appointments by status and date
- Responsive UI with Tailwind CSS
- Professional landing page

## 🛠️ Tech Stack
| Frontend | Backend | Database |
|---|---|---|
| React.js (Vite) | Node.js | MongoDB Atlas |
| Tailwind CSS | Express.js | Mongoose |
| Axios | JWT + bcrypt | |
| React Router | CORS | |

## 🔑 Demo Credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@test.com | 123456 |
| Doctor | arjun@hospital.com | 123456 |
| Patient | patient@test.com | 123456 |

## 📁 Project Structure
    e-hospital/
    ├── client/          # React frontend
    │   ├── src/
    │   │   ├── api/     # Axios instance
    │   │   ├── components/  # Navbar, PrivateRoute, NotificationBell
    │   │   ├── context/     # AuthContext
    │   │   └── pages/       # All pages
    └── server/          # Express backend
    ├── config/      # DB connection
    ├── controllers/ # Business logic
    ├── middleware/  # Auth middleware
    ├── models/      # Mongoose schemas
    └── routes/      # API routes

## ⚙️ Run Locally

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

## 🌐 Environment Variables

**server/.env**
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=production
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
```

