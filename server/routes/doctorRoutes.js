const express = require("express");
const router = express.Router();
const { getDoctorProfile, getDoctorAppointments, updateAppointment, getAllDoctors } = require("../controllers/doctorController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Public to all logged in users
router.get("/all", protect, getAllDoctors);

// Doctor only routes
router.get("/profile", protect, authorizeRoles("doctor"), getDoctorProfile);
router.get("/appointments", protect, authorizeRoles("doctor"), getDoctorAppointments);
router.put("/appointments/:id", protect, authorizeRoles("doctor"), updateAppointment);

module.exports = router;