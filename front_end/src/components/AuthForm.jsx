import React, { useState } from "react";
import { Mail, Lock, User, Image, Loader2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const AuthForm = ({ type }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    fullName: "",
    avatar: null,
    coverImage: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const steps = [
    { title: "Account Setup", subtitle: "Create your login credentials" },
    { title: "Profile Info", subtitle: "Tell us about yourself" },
    { title: "Profile Images", subtitle: "Add your avatar and cover" },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.files[0] });
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.email || !formData.password) {
          setError("Please fill in all fields");
          return false;
        }
        break;
      case 2:
        if (!formData.fullName || !formData.username) {
          setError("Please fill in all fields");
          return false;
        }
        break;
      case 3:
        if (!formData.avatar) {
          setError("Avatar is required");
          return false;
        }
        break;
    }
    return true;
  };

  const handleNextStep = () => {
    if (!validateStep()) return;
    setError(null);
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    if (type === "signup" && step < 3) {
      handleNextStep();
      return;
    }

    setIsLoading(true);
    try {
      if (type === "signup") {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value) data.append(key, value);
        });

        const res = await axios.post("http://localhost:5300/api/v1/users/register", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setSuccessMessage("Signup successful! Redirecting...");
        setTimeout(() => navigate("/home"), 2000);
      } else {
        const res = await axios.post("http://localhost:5300/api/v1/users/login", {
          emailOrUsername: formData.email,
          password: formData.password,
        });

        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        localStorage.setItem("accessToken", res.data.data.accessToken);
        localStorage.setItem("refreshToken", res.data.data.refreshToken);

        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/home"), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-amber-500/20 shadow-2xl">
      {/* Progress Indicator */}
      {type === "signup" && (
        <div className="w-full mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-amber-500/20 -translate-y-1/2 z-0" />
            {steps.map((_, index) => (
              <div key={index} className="relative z-10 flex-1 flex justify-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all 
                  ${step > index + 1 ? 'bg-amber-500' : 'bg-amber-500/20'} 
                  ${step === index + 1 ? 'ring-4 ring-amber-500/30' : ''}`}>
                  {step > index + 1 ? (
                    <Check className="w-3 h-3 text-black" />
                  ) : (
                    <span className={`text-xs font-medium ${step === index + 1 ? 'text-amber-500' : 'text-amber-500/50'}`}>
                      {index + 1}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-6 text-center">
        {type === "signup" ? steps[step - 1]?.title : "Welcome Back"}
      </h2>
      <p className="text-center text-amber-500/80 mb-8">
        {type === "signup" ? steps[step - 1]?.subtitle : "Login to continue"}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
          >
            {type === "signup" ? (
              <>
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center bg-gray-800/50 border border-amber-500/20 rounded-xl px-4 py-3 transition-all hover:border-amber-500/40">
                      <Mail className="text-amber-400" size={20} />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="flex-1 bg-transparent ml-3 text-gray-100 placeholder-gray-400 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="flex items-center bg-gray-800/50 border border-amber-500/20 rounded-xl px-4 py-3 transition-all hover:border-amber-500/40">
                      <Lock className="text-amber-400" size={20} />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="flex-1 bg-transparent ml-3 text-gray-100 placeholder-gray-400 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center bg-gray-800/50 border border-amber-500/20 rounded-xl px-4 py-3 transition-all hover:border-amber-500/40">
                      <User className="text-amber-400" size={20} />
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="flex-1 bg-transparent ml-3 text-gray-100 placeholder-gray-400 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="flex items-center bg-gray-800/50 border border-amber-500/20 rounded-xl px-4 py-3 transition-all hover:border-amber-500/40">
                      <User className="text-amber-400" size={20} />
                      <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="flex-1 bg-transparent ml-3 text-gray-100 placeholder-gray-400 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                  {/* Profile (Avatar) Upload */}
                  <div className="flex items-center gap-4">
                    {/* Rounded Preview Avatar Placeholder */}
                    <div className="w-16 h-16 rounded-full bg-gray-700 border-2 border-amber-500/40 flex items-center justify-center overflow-hidden">
                      <Image className="text-amber-400 w-8 h-8" />
                    </div>
                    {/* Upload Button */}
                    <label className="cursor-pointer flex-1">
                      <div className="bg-gray-800/50 border border-amber-500/20 hover:border-amber-500/40 text-gray-100 rounded-xl px-4 py-2 transition-all text-sm">
                        Upload Profile Photo
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "avatar")}
                        className="hidden"
                        required
                      />
                    </label>
                  </div>
                
                  {/* Cover Image Upload */}
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-gray-300">Cover Image</div>
                    <label className="relative block cursor-pointer">
                      <div className="h-40 w-full bg-gray-800/50 border border-amber-500/20 hover:border-amber-500/40 rounded-xl flex items-center justify-center transition-all">
                        <Image className="text-amber-400 w-10 h-10" />
                        <span className="ml-3 text-gray-100 text-sm">Upload Cover Photo</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "coverImage")}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                
                )}
              </>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center bg-gray-800/50 border border-amber-500/20 rounded-xl px-4 py-3 transition-all hover:border-amber-500/40">
                  <Mail className="text-amber-400" size={20} />
                  <input
                    type="text"
                    placeholder="Email or Username"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="flex-1 bg-transparent ml-3 text-gray-100 placeholder-gray-400 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center bg-gray-800/50 border border-amber-500/20 rounded-xl px-4 py-3 transition-all hover:border-amber-500/40">
                  <Lock className="text-amber-400" size={20} />
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="flex-1 bg-transparent ml-3 text-gray-100 placeholder-gray-400 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-4">
          {type === "signup" && step > 1 && (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-xl transition-colors"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 ${
              type === "signup" && step < 3 
                ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400"
                : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
            } rounded-xl font-semibold transition-all`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : type === "signup" ? (
              step === 3 ? "Sign Up" : (
                <>
                  Next
                  <ChevronRight size={18} />
                </>
              )
            ) : (
              "Login"
            )}
          </button>
        </div>
      </form>

      {/* Messages */}
      {successMessage && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-center">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Toggle between Signup and Login */}
      <p className="text-sm text-amber-500/80 mt-6 text-center">
        {type === "signup" ? (
          <>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-amber-400 hover:text-amber-300 underline transition-colors"
            >
              Login
            </button>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-amber-400 hover:text-amber-300 underline transition-colors"
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