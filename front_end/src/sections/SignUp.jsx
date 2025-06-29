import React from "react";
import AuthForm from "../components/AuthForm";

const SignUp = () => {
  const handleSignUp = (e) => {
    e.preventDefault();
    // Handle sign-up logic here
    
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center ">
      <AuthForm type="signup" onSubmit={handleSignUp} />
    </div>
  );
};

export default SignUp;