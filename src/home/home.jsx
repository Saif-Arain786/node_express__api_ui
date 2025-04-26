import React, { useState, useEffect } from "react";
import axios from "axios";

export default function HomePage() {
  const [profileData, setProfileData] = useState(null); // State for profile data
  const [showProfile, setShowProfile] = useState(false); // State to toggle profile display
  const [loading, setLoading] = useState(true); // State for loading
  const [message, setMessage] = useState(""); // State for error messages

  // Fetch profile data from the database
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5004/auth/getProfile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("✅ Profile fetched:", response.data);
        setProfileData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
        setMessage("Failed to fetch profile data. Please try again later.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative">
      {/* Profile Avatar */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          👤
        </button>
      </div>

      {/* Welcome Message */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to the Home Page</h1>

      {/* Error Message */}
      {message && (
        <p className="text-red-600 font-medium mb-4">{message}</p>
      )}

      {/* Profile Data Modal */}
      {showProfile && profileData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
            <p><strong>Name:</strong> {profileData.name}</p>
            <p><strong>Email:</strong> {profileData.email}</p>
            <p><strong>Gender:</strong> {profileData.gender}</p>
            <p><strong>Age:</strong> {profileData.age}</p>
            {profileData.profileImage && (
              <div className="mt-4">
                <img
                  src={`http://localhost:5004/uploads/${profileData.profileImage}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
            )}
            <button
              onClick={() => setShowProfile(false)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}