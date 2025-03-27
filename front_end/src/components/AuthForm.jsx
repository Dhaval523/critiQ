import React, { useState } from "react";
import { Mail, Lock, User, Image, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthForm = ({ type }) => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState(""); // Combined field for email or username
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null); // Store the file object
  const [coverImageFile, setCoverImageFile] = useState(null); // Store the file object
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (type === "signup") {
        const formData = new FormData(); // Create FormData object
        formData.append("username", username);
        formData.append("email", emailOrUsername); // Use emailOrUsername for email
        formData.append("password", password);
        formData.append("fullName", fullName);

        if (avatarFile) {
          formData.append("avatar", avatarFile); // Append the file object
        }
        if (coverImageFile) {
          formData.append("coverImage", coverImageFile); // Append the file object
        }

        const res = await axios.post("http://localhost:5300/api/v1/users/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct content type
          },
        });
        console.log(res.data);
        setSuccessMessage("Signup successful! Redirecting...");
        setTimeout(() => navigate("/home"), 2000);
      } else {
        // Login logic
        const res = await axios.post("http://localhost:5300/api/v1/users/login", {
          emailOrUsername, // Send email or username to the backend
          password,
        });
        console.log(res.data);
        setSuccessMessage("Login successful! Redirecting...");

        // Store user data and tokens in localStorage
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        localStorage.setItem("accessToken", res.data.data.accessToken);
        localStorage.setItem("refreshToken", res.data.data.refreshToken);

        // Redirect to home page after 2 seconds
        setTimeout(() => navigate("/home"), 2000);
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file); // Store the file object
  };

  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverImageFile(file); // Store the file object
  };

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-2xl transform transition-transform hover:scale-105">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8 text-center">
        {type === "signup" ? "Create Account" : "Welcome Back"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name Field */}
        {type === "signup" && (
          <div className="flex items-center bg-gray-800/50 border border-cyan-500/20 rounded-xl px-4 py-3 transition-all hover:border-cyan-500/40">
            <User className="text-cyan-400" size={20} />
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="flex-1 bg-transparent ml-3 text-gray-100 placeholder-gray-400 focus:outline-none"
              required
            />
          </div>
        )}

        {/* Username Field */}
        {type === "signup" && (
          <div className="flex items-center bg-gray-800/50 border border-cyan-500/20 rounded-xl px-4 py-3 transition-all hover:border-cyan-500/40">
            <User className="text-cyan-400" size={20} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 bg-transparent ml-3 text-gray-100 placeholder-gray-400 focus:outline-none"
              required
            />
          </div>
        )}

        {/* Email or Username Field */}
        <div className="flex items-center bg-gray-800/50 border border-cyan-500/20 rounded-xl px-4 py-3 transition-all hover:border-cyan-500/40">
          <Mail className="text-cyan-400" size={20} />
          <input
            type="text"
            placeholder={type === "signup" ? "Email" : "Email or Username"}
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="flex-1 bg-transparent ml-3 text-gray-100 placeholder-gray-400 focus:outline-none"
            required
          />
        </div>

        {/* Password Field */}
        <div className="flex items-center bg-gray-800/50 border border-cyan-500/20 rounded-xl px-4 py-3 transition-all hover:border-cyan-500/40">
          <Lock className="text-cyan-400" size={20} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 bg-transparent ml-3 text-gray-100 placeholder-gray-400 focus:outline-none"
            required
          />
        </div>

        {/* Avatar Field */}
        {type === "signup" && (
          <div className="flex items-center bg-gray-800/50 border border-cyan-500/20 rounded-xl px-4 py-3 transition-all hover:border-cyan-500/40">
            <Image className="text-cyan-400" size={20} />
            <input
              type="file"
              accept="image/*" // Accept only image files
              onChange={handleAvatar}
              className="flex-1 bg-transparent ml-3 text-gray-100 placeholder-gray-400 focus:outline-none"
              required
            />
          </div>
        )}

        {/* Cover Image Field */}
        {type === "signup" && (
          <div className="flex items-center bg-gray-800/50 border border-cyan-500/20 rounded-xl px-4 py-3 transition-all hover:border-cyan-500/40">
            <Image className="text-cyan-400" size={20} />
            <input
              type="file"
              accept="image/*" // Accept only image files
              onChange={handleCoverImage}
              className="flex-1 bg-transparent ml-3 text-gray-100 placeholder-gray-400 focus:outline-none"
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 className="animate-spin mr-2" size={20} />
          ) : (
            type === "signup" ? "Sign Up" : "Login"
          )}
        </button>
      </form>

      {/* Success Message */}
      {successMessage && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-center">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Toggle between Signup and Login */}
      <p className="text-sm text-gray-400 mt-6 text-center">
        {type === "signup" ? (
          <>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
            >
              Login
            </button>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/")}
              className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
            >
              Sign Up
            </button>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthForm;