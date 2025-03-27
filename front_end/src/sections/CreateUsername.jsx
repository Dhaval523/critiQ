import React from "react";
import UsernameForm from "../components/UsernameForm";

const CreateUsername = () => {
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    // Handle username creation logic here
    console.log("Username created...");
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center p-4">
      <UsernameForm onSubmit={handleUsernameSubmit} />
    </div>
  );
};

export default CreateUsername;