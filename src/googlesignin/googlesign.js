import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function App() {
  const handleLogin = async (response) => {
    const token = response.credential;
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token,
      });
      localStorage.setItem("jwt", res.data.token);
      alert("Login successful!");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="flex justify-center items-center h-screen">
        <GoogleLogin onSuccess={handleLogin} onError={() => alert("Error")} />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
