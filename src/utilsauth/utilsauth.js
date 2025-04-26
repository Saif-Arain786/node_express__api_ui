// utils/auth.js (you can create this file)
export function isTokenValid() {
    const token = localStorage.getItem("token");
    if (!token) return false;
  
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      const expiry = payload.exp;
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      return expiry > now;
    } catch (error) {
      return false;
    }
  }
  