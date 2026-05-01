import { Link } from "react-router-dom";

const features = [
  {
    icon: "🔐",
    title: "Role-Based Access",
    desc: "Separate dashboards for Patients, Doctors, and Admins with JWT authentication.",
  },
  {
    icon: "📅",
    title: "Easy Appointment Booking",
    desc: "Patients can browse doctors by specialization and book appointments instantly.",
  },
  {
    icon: "👨‍⚕️",
    title: "Doctor Management",
    desc: "Admins can add and manage doctors. Doctors can update appointment status.",
  },
  {
    icon: "📋",
    title: "Medical Records",
    desc: "Doctors add notes and prescriptions. Patients view their full medical history.",
  },
  {
    icon: "🔔",
    title: "Real-time Notifications",
    desc: "Get notified when appointments are booked, confirmed, or cancelled.",
  },
  {
    icon: "🔍",
    title: "Search & Filter",
    desc: "Filter doctors by specialization and appointments by status or date.",
  },
];

const stats = [
  { value: "3", label: "User Roles" },
  { value: "100%", label: "Secure Auth" },
  { value: "MERN", label: "Full Stack" },
  { value: "REST", label: "API Based" },
];

const steps = [
  { step: "01", title: "Register", desc: "Create your account as a Patient, Doctor, or Admin." },
  { step: "02", title: "Browse Doctors", desc: "Find the right doctor by specialization and availability." },
  { step: "03", title: "Book Appointment", desc: "Pick a date and time that works for you." },
  { step: "04", title: "Get Treatment", desc: "Visit the doctor and access your medical records anytime." },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-blue-700">🏥 E-Hospital</div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-gray-600 hover:text-blue-600 font-medium text-sm transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="btn-primary text-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-50 via-white to-sky-50">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wide">
            Full Stack MERN Project
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Modern Hospital
            <span className="text-blue-600"> Management </span>
            System
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            A complete hospital management solution built with MongoDB, Express, React, and Node.js.
            Manage appointments, doctors, patients, and medical records — all in one place.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn-primary">
              Get Started Free →
            </Link>
            <Link
              to="/login"
              className="border border-gray-200 hover:border-blue-300 text-gray-700 font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 hover:text-blue-600"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Hero Image / Dashboard Preview */}
        <div className="max-w-4xl mx-auto mt-16 animate-slide-up">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Fake browser bar */}
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 ml-2">
                https://e-hospital.vercel.app
              </div>
            </div>
            {/* Dashboard Preview */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-white font-bold text-lg">🏥 E-Hospital</span>
                <div className="flex gap-3">
                  <span className="text-blue-200 text-sm">My Appointments</span>
                  <span className="text-blue-200 text-sm">Book</span>
                  <span className="bg-white text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Admin</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Total Users", value: "124", color: "bg-blue-600" },
                  { label: "Total Doctors", value: "18", color: "bg-sky-600" },
                  { label: "Appointments", value: "340", color: "bg-indigo-600" },
                ].map((s) => (
                  <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
                    <p className="text-white text-2xl font-bold">{s.value}</p>
                    <p className="text-blue-200 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex justify-between text-white text-sm mb-3">
                  <span className="font-semibold">Recent Appointments</span>
                  <span className="text-blue-300 text-xs">View all</span>
                </div>
                {[
                  { patient: "Ravi Kumar", doctor: "Dr. Arjun", status: "confirmed", color: "bg-green-400" },
                  { patient: "Priya Singh", doctor: "Dr. Meena", status: "pending", color: "bg-yellow-400" },
                  { patient: "Amit Shah", doctor: "Dr. Raj", status: "completed", color: "bg-blue-400" },
                ].map((row) => (
                  <div key={row.patient} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                    <span className="text-white text-xs">{row.patient}</span>
                    <span className="text-blue-200 text-xs">{row.doctor}</span>
                    <span className={`${row.color} text-white text-xs px-2 py-0.5 rounded-full`}>{row.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-700">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="animate-fade-in">
              <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-blue-200 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A complete system designed for patients, doctors, and administrators.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="card hover:-translate-y-1 cursor-default"
              >
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3 className="text-base font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-gray-500">Get started in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white font-bold text-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-10">Built with modern tech</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "MongoDB", color: "bg-green-100 text-green-700" },
              { name: "Express.js", color: "bg-gray-100 text-gray-700" },
              { name: "React.js", color: "bg-blue-100 text-blue-700" },
              { name: "Node.js", color: "bg-lime-100 text-lime-700" },
              { name: "Tailwind CSS", color: "bg-sky-100 text-sky-700" },
              { name: "JWT Auth", color: "bg-purple-100 text-purple-700" },
              { name: "REST API", color: "bg-orange-100 text-orange-700" },
              { name: "Mongoose", color: "bg-red-100 text-red-700" },
            ].map((tech) => (
              <span
                key={tech.name}
                className={`${tech.color} font-semibold text-sm px-4 py-2 rounded-xl`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-700 to-blue-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-blue-200 mb-8">
            Create your account and experience modern hospital management.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/register"
              className="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              Create Account →
            </Link>
            <Link
              to="/login"
              className="border border-blue-400 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-800 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center">
        <p className="text-sm">
          Built with ❤️ using <span className="text-white font-medium">MERN Stack</span> — E-Hospital Management System
        </p>
        <p className="text-xs mt-2 text-gray-600">
          MongoDB · Express · React · Node.js · Tailwind CSS
        </p>
      </footer>

    </div>
  );
};

export default Landing;