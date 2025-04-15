import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const navigate = useNavigate(); // Initialize useNavigate hook
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        "http://localhost:5004/auth/verifyOtp",
        { otp },
        {
          headers: {
            "Authorization": localStorage.getItem("token"), // token should be saved in localStorage during signup
            "Content-Type": "application/json"
          }
        }
      );

      setMessage("✅ OTP Verified Successfully!");
      console.log(response.data);
      navigate("/profile");// Redirect to profile page after successful verification
      setOtp("") 
    } catch (error) {
      console.error("❌ Error verifying OTP:", error);
      setMessage("❌ Invalid OTP or verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">🔐 Verify OTP</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={handleChange}
            placeholder="Enter OTP sent to your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
}
