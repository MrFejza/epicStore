import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/"); // Go back to the previous page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
      <p className="text-xl text-gray-700 mb-8">You do not have permission to view this page.</p>
      <button
        onClick={handleGoBack}
        className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:opacity-90"
      >
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;
