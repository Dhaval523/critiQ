import React from "react";
import AuthForm from "../components/AuthForm";

const Login = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Logging in...");
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center p-4">
      <AuthForm type="login" onSubmit={handleLogin} />
    </div>
  );
};

export default Login;