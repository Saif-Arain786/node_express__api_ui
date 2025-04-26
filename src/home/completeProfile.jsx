import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../expirychecker/expirychecker";
import { useNavigate } from "react-router-dom";
export default function ProfileHome() {
  const [showForm, setShowForm] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    gender: "",
    age: "",
    profileImage: "",
    isComplete: false,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch profile from localStorage
  useEffect(() => {
    const fetchProfile = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user && user.profileId) {
          console.log("✅ Profile fetched from localStorage:", user.profileId);
          setProfileData({
            name: user.profileId.name || "",
            gender: user.profileId.gender || "",
            age: user.profileId.age || "",
            profileImage: user.profileId.profileImage || "",
            isComplete: true,
          });
        } else {
          console.log("❌ No profile found.");
          setProfileData((prev) => ({ ...prev, isComplete: false }));
          setShowForm(true); // Show form if no profile
        }
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
        setMessage("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    if (!profileImage) {
      setMessage("Please select a profile image.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("profileImage", profileImage);
      formData.append("name", profileData.name);
      formData.append("gender", profileData.gender);
      formData.append("age", profileData.age);
  
      const { data } = await axiosInstance.post(
        "http://localhost:5004/auth/completeProfile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      console.log("✅ Profile updated:", data);
  
      const updatedProfile = {
        name: data.user.name,
        gender: data.user.gender,
        age: data.user.age,
        profileImage: data.user.profileImage,
        isComplete: true,
      };
  
      // Save updated profile to localStorage
      const existingUser = JSON.parse(localStorage.getItem("user")) || {};
      existingUser.profileId = updatedProfile;
      localStorage.setItem("user", JSON.stringify(existingUser));
  
      // Update UI
      setProfileData(updatedProfile);
      setShowForm(false);
      setMessage("Profile updated successfully! 🎉");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      setMessage("Failed to update profile. Please try again.");
    }
  };
  const logOut = () => {
    const navigate = useNavigate();
    localStorage.removeItem("token"); // Clear token  
    localStorage.removeItem("user"); // Clear token  
    navigate("/login"); // Redirect to login page
  }
  

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Your Profile</h1>

      {message && (
        <p
          className={`mb-4 ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      {/* Show Profile Info */}
      {profileData.isComplete && !showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
          <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
          {profileData.profileImage && (
            <img
              src={profileData.profileImage}
              alt="Profile"
              className="w-32 h-32 mx-auto mb-4 rounded-full object-cover"
            />
          )}
          <img src={profileData.profileImage} alt="image" />
          <p><strong>Name:</strong> {profileData.name}</p>
          <p><strong>Gender:</strong> {profileData.gender}</p>
          <p><strong>Age:</strong> {profileData.age}</p>
          <p className="text-sm text-gray-500 mt-2">
            {profileData.isComplete ? "Profile is complete!" : "Profile is incomplete."}</p>

          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Profile
          </button>
             <div>
          <button
            onClick={() => logOut()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            logOut Profile
          </button>
          </div>
        </div>
      )}

      {/* Show Form */}
      {(!profileData.isComplete || showForm) && (
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">
            {profileData.isComplete ? "Edit Your Profile" : "Complete Your Profile"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={profileData.name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
            <select
              name="gender"
              value={profileData.gender}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={profileData.age}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border p-2 rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {profileData.isComplete ? "Update Profile" : "Save Profile"}
            </button>
          </form>

          {profileData.isComplete && (
            <button
              onClick={() => setShowForm(false)}
              className="mt-4 text-gray-500 hover:underline"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}
