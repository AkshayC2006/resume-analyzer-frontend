import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Analyze", path: "/analyze" },
    { name: "History", path: "/history" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Title */}
        <Link to="/" className="text-2xl font-bold text-white tracking-wide">
          Resume Analyzer
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-white text-lg hover:text-yellow-300 transition ${
                location.pathname === item.path ? "font-semibold underline" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Analyze Now Button */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/analyze")}
            className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
          >
            Analyze Now
          </motion.button>

          <button
            onClick={handleLogout}
            className="text-white hover:text-yellow-300 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
