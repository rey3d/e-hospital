const Appointment = require("../models/Appointment");

// -----------------------------------------------
// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Patient only
// -----------------------------------------------
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, symptoms } = req.body;

    // Check if slot is already booked
    const existing = await Appointment.findOne({ doctorId, date, time });
    if (existing) {
      return res.status(400).json({ message: "This time slot is already booked" });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date,
      time,
      symptoms: symptoms || "",
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------------
// @desc    Get appointments for logged in patient
// @route   GET /api/appointments/my
// @access  Patient only
// -----------------------------------------------
const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate("doctorId", "name email");
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------------
// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Patient only
// -----------------------------------------------
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Only the patient who booked can cancel
    if (appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    appointment.status = "cancelled";
    await appointment.save();
    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { bookAppointment, getPatientAppointments, cancelAppointment };