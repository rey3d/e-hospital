const express = require('express');
const dotenv = require("dotenv");
const cors=require('cors');
const cookieParser=require("cookie-parser");
const connectDB=require("./config/db");


dotenv.config();

connectDB();

const app=express();

app.use(cors({
    origin: [
    "http://localhost:5173",
    "https://e-hospital-mu.vercel.app" 
    ],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

//routes
const authRoutes= require("./routes/authRoutes");
app.use("/api/auth",authRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const doctorRoutes = require("./routes/doctorRoutes");
app.use("/api/doctor", doctorRoutes);

const appointmentRoutes = require("./routes/appointmentRoutes");
app.use("/api/appointments", appointmentRoutes);

const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);

app.get("/",(req,res)=>{
    res.send("E-hospital API is running...");
});

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log("Server running successfully at http://localhost:5000");
});
