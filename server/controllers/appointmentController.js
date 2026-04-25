const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");

// -----------------------------------------------
// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Patient only
// -----------------------------------------------
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, symptoms } = req.body;

    // Check if slot already booked
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

    // Notify the doctor about new appointment
    await Notification.create({
      userId: doctorId,
      message: `New appointment booked by ${req.user.name} on ${date} at ${time}`,
      type: "appointment",
    });

    // Notify the patient about booking confirmation
    await Notification.create({
      userId: req.user._id,
      message: `Your appointment on ${date} at ${time} has been booked successfully`,
      type: "appointment",
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
    const { status, date } = req.query;

    // Build filter dynamically
    let filter = { patientId: req.user._id };
    if (status) filter.status = status;
    if (date) filter.date = date;

    const appointments = await Appointment.find(filter)
      .populate("doctorId", "name email")
      .sort({ createdAt: -1 });
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

    if (appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    // Notify doctor about cancellation
    await Notification.create({
      userId: appointment.doctorId,
      message: `Appointment on ${appointment.date} at ${appointment.time} was cancelled by patient`,
      type: "appointment",
    });

    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { bookAppointment, getPatientAppointments, cancelAppointment };