import React, { useState } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const UsernameForm = () => {
  const [username, setUsername] = useState(""); // ✅ Changed id_name to username
  const navigate = useNavigate();

  const handleContinue = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/api/auth/create-username", { username }); // ✅ Sending username
      console.log(res.data);
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-gray-900/80 backdrop-blur-lg rounded-xl border border-gray-700 shadow-2xl">
      <h2 className="text-2xl font-bold text-cyan-100 mb-6 text-center">Create Your Username</h2>
      
      {/* ✅ Moved onSubmit to the form */}
      <form onSubmit={handleContinue} className="space-y-4">
        <div className="flex items-center bg-gray-800/50 border border-cyan-500/20 rounded-xl px-4 py-2">
          <User className="text-cyan-400" size={20} />
          <input
            type="text"
            placeholder="Username"
            className="flex-1 bg-transparent ml-2 text-gray-100 focus:outline-none"
            onChange={(e) => setUsername(e.target.value)} // ✅ Changed setId_name to setUsername
            required
          />
        </div>
        
        {/* ✅ onClick is removed, as form handles submission */}
        <button type="submit" className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 py-2 rounded-xl transition-colors">
          Continue
        </button>
      </form>
    </div>
  );
};

export default UsernameForm;
