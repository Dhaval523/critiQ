import React, { useState, useCallback } from "react";
import { Mail, Lock, User, Image, Loader2, ChevronLeft, ChevronRight, Check, Clapperboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../api/axiosInstance";
import { debounce } from "lodash"; // Install lodash: npm install lodash
import toast from "react-hot-toast";

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
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const steps = [
    { title: "Account Setup", subtitle: "Create your login credentials" },
    { title: "Profile Info", subtitle: "Tell us about yourself" },
    { title: "Profile Images", subtitle: "Add your avatar and cover" },
  ];

  // Debounced input change handler
  const handleInputChange = useCallback(
    debounce((e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Real-time validation
      let error = null;
      if (name === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
        error = "Invalid email format";
      } else if (name === "password" && value && value.length < 6) {
        error = "Password must be at least 6 characters";
      } else if (name === "username" && value && !/^[a-zA-Z0-9_]{3,}$/.test(value)) {
        error = "Username must be at least 3 characters (letters, numbers, underscores)";
      }
      setValidationErrors((prev) => ({ ...prev, [name]: error }));
    }, 300),
    []
  );

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === "avatar") setAvatarPreview(reader.result);
        else setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = () => {
    const errors = {};
    switch (step) {
      case 1:
        if (!formData.email) errors.email = "Email is required";
        if (!formData.password) errors.password = "Password is required";
        break;
      case 2:
        if (!formData.fullName) errors.fullName = "Full name is required";
        if (!formData.username) errors.username = "Username is required";
        break;
      case 3:
        if (!formData.avatar) errors.avatar = "Avatar is required";
        break;
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setError(null);
      setStep((prev) => Math.min(prev + 1, 3));
    }
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

        const res = await axiosInstance.post("/api/v1/users/register", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Signup successful!", {
          style: {
            background: '#1a0b3d',
            color: '#86efac', // green-400
            border: '1px solid rgba(134, 239, 172, 0.3)',
            boxShadow: '0 0 15px rgba(134, 239, 172, 0.3)',
          },
        });

        setTimeout(() => navigate("/home"), 1500);
      } else {
        const res = await axiosInstance.post("/api/v1/users/login", {
          emailOrUsername: formData.email,
          password: formData.password,
        });
        console.log(res.data);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        localStorage.setItem("accessToken", res.data.data.accessToken);
        localStorage.setItem("refreshToken", res.data.data.refreshToken);
        toast.success("Login successful! Redirecting...", {
          style: {
            background: '#1a0b3d',
            color: '#86efac', // green-400
            border: '1px solid rgba(134, 239, 172, 0.3)',
            boxShadow: '0 0 15px rgba(134, 239, 172, 0.3)',
          },
        });
        setTimeout(() => navigate("/home"), 1500);
      }
    } catch (error) {
      
      console.log(error);
      const message = error.response.data.message;
      toast.error(message, {
        style: {
          background: '#1a0b3d',
          color: '#f87171',
          border: '1px solid rgba(251, 113, 133, 0.3)',
          boxShadow: '0 0 15px rgba(251, 113, 133, 0.3)',
        },
      });

    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.15 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#2d007d] via-[#a40082] to-[#00b5e0] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2d007d]/70 z-0 pointer-events-none"></div>

      {/* Grain Effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybiIpLz48L3N2Zz4=')] opacity-30 pointer-events-none"></div>

      <motion.div
        className="max-w-md w-full mx-auto p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Progress Indicator */}
        {type === "signup" && (
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-amber-500/20 -translate-y-1/2 z-0" />
              {steps.map((_, index) => (
                <div key={index} className="relative z-10 flex-1 flex justify-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${step > index + 1 ? "bg-amber-500" : step === index + 1 ? "bg-amber-500/50" : "bg-amber-500/20"
                      }`}
                  >
                    {step > index + 1 ? (
                      <Check className="w-4 h-4 text-black" />
                    ) : (
                      <Clapperboard className={`w-4 h-4 ${step === index + 1 ? "text-white" : "text-amber-500/50"}`} />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-amber-400 text-sm mt-2">{steps[step - 1].subtitle}</p>
          </div>
        )}

        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-4 text-center">
          {type === "signup" ? steps[step - 1].title : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div key={step} variants={inputVariants} initial="initial" animate="animate" exit="exit">
              {type === "signup" ? (
                <>
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="flex items-center bg-gray-800/50 border border-amber-500/20 rounded-lg px-3 py-2 transition-all hover:border-amber-500/40">
                          <Mail className="text-amber-400" size={18} />
                          <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleInputChange}
                            className="flex-1 bg-transparent ml-2 text-gray-100 placeholder-gray-500 focus:outline-none text-sm"
                            required
                          />
                        </div>
                        {validationErrors.email && (
                          <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>
                        )}
                      </div>

                      <div className="relative">
                        <div className="flex items-center bg-gray-800/50 border border-amber-500/20 rounded-lg px-3 py-2 transition-all hover:border-amber-500/40">
                          <Lock className="text-amber-400" size={18} />
                          <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleInputChange}
                            className="flex-1 bg-transparent ml-2 text-gray-100 placeholder-gray-500 focus:outline-none text-sm"
                            required
                          />
                        </div>
                        {validationErrors.password && (
                          <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="flex items-center bg-gray-800/50 border border-amber-500/20 rounded-lg px-3 py-2 transition-all hover:border-amber-500/40">
                          <User className="text-amber-400" size={18} />
                          <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            onChange={handleInputChange}
                            className="flex-1 bg-transparent ml-2 text-gray-100 placeholder-gray-500 focus:outline-none text-sm"
                            required
                          />
                        </div>
                        {validationErrors.fullName && (
                          <p className="text-red-400 text-xs mt-1">{validationErrors.fullName}</p>
                        )}
                      </div>

                      <div className="relative">
                        <div className="flex items-center bg-gray-800/50 border border-amber-500/20 rounded-lg px-3 py-2 transition-all hover:border-amber-500/40">
                          <User className="text-amber-400" size={18} />
                          <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            onChange={handleInputChange}
                            className="flex-1 bg-transparent ml-2 text-gray-100 placeholder-gray-500 focus:outline-none text-sm"
                            required
                          />
                        </div>
                        {validationErrors.username && (
                          <p className="text-red-400 text-xs mt-1">{validationErrors.username}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-700 border-2 border-amber-500/40 flex items-center justify-center overflow-hidden">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                          ) : (
                            <Image className="text-amber-400 w-6 h-6" />
                          )}
                        </div>
                        <label className="cursor-pointer flex-1">
                          <div className="bg-gray-800/50 border border-amber-500/20 hover:border-amber-500/40 text-gray-100 rounded-lg px-3 py-2 text-sm transition-all">
                            {avatarPreview ? "Change Avatar" : "Upload Avatar"}
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
                      {validationErrors.avatar && (
                        <p className="text-red-400 text-xs mt-1">{validationErrors.avatar}</p>
                      )}

                      <div className="flex flex-col gap-2">
                        <div className="text-sm text-gray-300">Cover Image (Optional)</div>
                        <label className="relative block cursor-pointer">
                          <div className="h-32 w-full bg-gray-800/50 border border-amber-500/20 hover:border-amber-500/40 rounded-lg flex items-center justify-center transition-all overflow-hidden">
                            {coverPreview ? (
                              <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex items-center gap-2">
                                <Image className="text-amber-400 w-6 h-6" />
                                <span className="text-gray-100 text-sm">Upload Cover</span>
                              </div>
                            )}
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
                <div className="space-y-4">
                  <div className="relative">
                    <div className="flex items-center bg-gray-800/50 border border-amber-500/20 rounded-lg px-3 py-2 transition-all hover:border-amber-500/40">
                      <Mail className="text-amber-400" size={18} />
                      <input
                        type="text"
                        placeholder="Email or Username"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="flex-1 bg-transparent ml-2 text-gray-100 placeholder-gray-500 focus:outline-none text-sm"
                        required
                      />
                    </div>
                    {validationErrors.email && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>
                    )}
                  </div>

                  <div className="relative">
                    <div className="flex items-center bg-gray-800/50 border border-amber-500/20 rounded-lg px-3 py-2 transition-all hover:border-amber-500/40">
                      <Lock className="text-amber-400" size={18} />
                      <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="flex-1 bg-transparent ml-2 text-gray-100 placeholder-gray-500 focus:outline-none text-sm"
                        required
                      />
                    </div>
                    {validationErrors.password && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-3 pt-4">
            {type === "signup" && step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-colors text-sm font-medium"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg text-sm transition-all ${isLoading
                ? "bg-amber-500/50 text-gray-300 cursor-not-allowed"
                : type === "signup" && step < 3
                  ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-900"
                }`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : type === "signup" ? (
                step === 3 ? (
                  "Sign Up"
                ) : (
                  <>
                    Next
                    <ChevronRight size={16} />
                  </>
                )
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>

        {/* Messages */}
        {/* <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-center text-sm"
            >
              {successMessage}
            </motion.div>
          )}
          
        </AnimatePresence> */}

        {/* Toggle between Signup and Login */}
        <p className="text-sm text-gray-400 mt-4 text-center">
          {type === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                Sign Up
              </button>
            </>
          )}
        </p>
      </motion.div>

      <footer className="absolute bottom-0 w-full py-6 text-center text-gray-400 z-10">
        <p>© {new Date().getFullYear()} CritiQ. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthForm;