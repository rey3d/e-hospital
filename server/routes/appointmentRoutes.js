const express = require("express");
const router = express.Router();
const { bookAppointment, getPatientAppointments, cancelAppointment } = require("../controllers/appointmentController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, authorizeRoles("patient"), bookAppointment);
router.get("/my", protect, authorizeRoles("patient"), getPatientAppointments);
router.put("/:id/cancel", protect, authorizeRoles("patient"), cancelAppointment);

module.exports = router;