const express = require("express");
const router = express.Router();
const { getAllUsers, getAllDoctors, addDoctor, deleteUser, getAllAppointments } = require("../controllers/adminController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// All routes here are admin only
router.use(protect);
router.use(authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.get("/doctors", getAllDoctors);
router.post("/doctors", addDoctor);
router.delete("/users/:id", deleteUser);
router.get("/appointments", getAllAppointments);

module.exports = router;