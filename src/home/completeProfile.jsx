import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProfileHome() {
  const [showForm, setShowForm] = useState(false); // State to toggle profile form
  const [profileData, setProfileData] = useState({
    name: "",
    gender: "",
    age: "",
    profileImage: "",
    isComplete: false,
  }); // State for profile data
  const [profileImage, setProfileImage] = useState(null); // State for profile image
  const [message, setMessage] = useState(""); // State for success/error messages
  const [loading, setLoading] = useState(true); // State for loading

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
        if (error.response?.status === 401) {
          setMessage("Unauthorized. Please log in again.");
        } else if (error.response?.status === 404) {
          setMessage("Profile not found. Please complete your profile.");
        } else {
          setMessage("Failed to fetch profile data. Please try again later.");
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Create FormData object
    const formData = new FormData();
    formData.append("profileImage", profileImage);
    formData.append("name", profileData.name);
    formData.append("gender", profileData.gender);
    formData.append("age", profileData.age);

    // API request configuration
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5004/auth/completeProfile",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token
      },
      data: formData,
    };

    try {
      const response = await axios.request(config);
      console.log("✅ Profile updated:", response.data);
      setMessage("Profile updated successfully! 🎉");
      setShowForm(false); // Close the form after submission
      setProfileData(response.data); // Update profile data
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      setMessage("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Profile Icon */}
      {!profileData?.isComplete && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
          >
            👤
          </button>
        </div>
      )}

      {/* Welcome Message */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to Your Profile</h1>

      {/* Success/Error Message */}
      {message && (
        <p
          className={`text-center font-medium mb-4 ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      {/* Show Profile Data */}
      {profileData?.isComplete && (
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
          <p><strong>Name:</strong> {profileData.name}</p>
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
        </div>
      )}

      {/* Profile Form Modal */}
      {!profileData?.isComplete && showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Gender</label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Age */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={profileData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Profile Image */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Profile Image</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Update Profile
              </button>
            </form>

            {/* Close Button */}
            <button
              onClick={() => setShowForm(false)}
              className="mt-4 text-gray-500 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}