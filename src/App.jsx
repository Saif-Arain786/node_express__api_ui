import { useState } from "react";
import "./App.css";
import SignupPage from "./components/signup";
import "tailwindcss";
import VerifyOtp from "./components/verifyotp";
import ProfileHome from "./home/completeProfile";
import Loginpage from "./components/login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Signup Page */}
        <Route path="/" element={<SignupPage />} />

        {/* Route for Verify OTP Page */}
        <Route path="/verifyOtp" element={<VerifyOtp />} />


        <Route path="/profile" element={<ProfileHome />} />
        <Route path="/login" element={<Loginpage />} />
      </Routes>
    </Router>
  );
}

export default App;