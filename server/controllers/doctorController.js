const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");

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

const getDoctorAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;

    let filter = { doctorId: req.user._id };
    if (status) filter.status = status;
    if (date) filter.date = date;

    const appointments = await Appointment.find(filter)
      .populate("patientId", "name email phone")
      .sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { status, notes, prescription } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;
    if (prescription) appointment.prescription = prescription;

    await appointment.save();

    // Notify patient about status update
    if (status) {
      await Notification.create({
        userId: appointment.patientId,
        message: `Your appointment on ${appointment.date} at ${appointment.time} is now ${status}`,
        type: "appointment",
      });
    }

    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const { specialization } = req.query;

    let filter = { isApproved: true };
    if (specialization) filter.specialization = specialization;

    const doctors = await Doctor.find(filter)
      .populate("userId", "name email phone");
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDoctorProfile, getDoctorAppointments, updateAppointment, getAllDoctors };