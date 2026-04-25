const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// -----------------------------------------------
// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin only
// -----------------------------------------------
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------------
// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Admin only
// -----------------------------------------------
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "-password");
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------------
// @desc    Add a new doctor
// @route   POST /api/admin/doctors
// @access  Admin only
// -----------------------------------------------
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, specialization, experience, fees, availableDays, bio } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Doctor with this email already exists" });
    }

    // 2. Create user account for doctor
    const user = await User.create({
      name,
      email,
      password,
      role: "doctor",
      phone,
    });

    // 3. Create doctor profile linked to user
    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      experience,
      fees,
      availableDays: availableDays || ["Mon", "Tue", "Wed", "Thu", "Fri"],
      bio: bio || "",
      isApproved: true,
    });

    res.status(201).json({ user, doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------------
// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Admin only
// -----------------------------------------------
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------------
// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Admin only
// -----------------------------------------------
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "name email")
      .populate("doctorId", "name email");
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllUsers, getAllDoctors, addDoctor, deleteUser, getAllAppointments };