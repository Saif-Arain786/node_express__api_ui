import React, { useState } from "react";
import "tailwindcss";
import "../styles/signup.css"; // Optional: Tailwind custom styles
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../expirychecker/expirychecker";


export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  const navigate = useNavigate(); // Initialize useNavigate hook
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // ✅ Basic validation
    if (!formData.email.includes("@") || formData.password.length < 6) {
      setMessage("Please enter a valid email and password (6+ characters).");
      setLoading(false);
      return;
    }

    const data = JSON.stringify({
      email:formData.email,
      password: formData.password,
    });
    
    
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5004/auth/signup",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    console.log(data,"config);",config);

    axiosInstance
      .request(config)
      .then((response) => {
        console.log("✅ Signup success:",JSON.stringify( response.data));
        setMessage("Signup successful! 🎉");
        setFormData({ email: "", password: "" }); // Clear fields
        localStorage.setItem("token", response.data.token); // Store token in localStorage
        navigate("/verifyOtp"); // Redirect to OTP verification page
      })
      .catch((error) => {
        console.error("❌ Signup error:", error);
        if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
          // If the backend returns an array of errors
          const errorMessages = error.response.data.errors.join(", "); // Combine errors into a single string
          setMessage(errorMessages); // Display the errors
        } else if (error.response?.data?.message) {
          // If the backend returns a single error message
          setMessage(error.response.data.message);
        } else {
          setMessage("Signup failed. Please try again.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4">
      <div className="backdrop-blur-lg bg-white/40 border border-white/30 shadow-2xl rounded-3xl p-10 max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          ✨ Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="peer w-full px-4 py-3 pl-11 rounded-2xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              📧
            </span>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="peer w-full px-4 py-3 pl-11 rounded-2xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-950 pointer-events-none">
              🔒
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl shadow-lg transition-transform hover:scale-105"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-sm text-red-700">{message}</p>
        )}

        {/* Link to login */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="#"
            className="text-blue-700 hover:underline font-medium"
            onClick={() => navigate("/login")} // Navigate to login page
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
