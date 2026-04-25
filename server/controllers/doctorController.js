const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// -----------------------------------------------
// @desc    Get doctor profile
// @route   GET /api/doctor/profile
// @access  Doctor only
// -----------------------------------------------
const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id })
      .populate("userId", "-password");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }
    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------------
// @desc    Get all appointments for logged in doctor
// @route   GET /api/doctor/appointments
// @access  Doctor only
// -----------------------------------------------
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user._id })
      .populate("patientId", "name email phone");
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------------
// @desc    Update appointment status + add notes/prescription
// @route   PUT /api/doctor/appointments/:id
// @access  Doctor only
// -----------------------------------------------
const updateAppointment = async (req, res) => {
  try {
    const { status, notes, prescription } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update fields
    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;
    if (prescription) appointment.prescription = prescription;

    await appointment.save();
    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------------
// @desc    Get all doctors (for patients to browse)
// @route   GET /api/doctor/all
// @access  Private (any logged in user)
// -----------------------------------------------
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: true })
      .populate("userId", "name email phone");
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDoctorProfile, getDoctorAppointments, updateAppointment, getAllDoctors };