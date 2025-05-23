import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import SignupPage from "./components/signup";
import "tailwindcss";
import VerifyOtp from "./components/verifyotp";
import ProfileHome from "./home/completeProfile";
import Loginpage from "./components/login";
import { Routes, Route } from "react-router-dom";
import { isTokenValid } from "./utilsauth/utilsauth";
import Home from "./home/home.jsx";

function App() {
  return (
    <>
      <AuthHandler />
      <Routes>
        {/* Route for Signup Page */}
        <Route path="/" element={<SignupPage />} />
        {/* Route for Verify OTP Page */}
        <Route path="/verifyOtp" element={<VerifyOtp />} />
        <Route path="/profile" element={<ProfileHome />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/Home" element={<Home />} />

      </Routes>
    </>
  );
}

// This component will run when app loads
function AuthHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isTokenValid()) {
      navigate("/profile"); // Move to profile page if token valid
    } else {
      navigate("/"); // Else stay at signup or wherever
    }
  }, []);

  return null; // No UI
}

export default App;