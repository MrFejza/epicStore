import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";

const Shemsia = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    // Check for missing required fields
    if (!formData.username || !formData.email || !formData.password) {
      setError("Ju lutem plotësoni të gjitha fushat.");
      return;
    }
  
    // Check for password length
    if (formData.password.length < 8) {
      setError("Fjalëkalimi duhet të ketë të paktën 8 karaktere.");
      return;
    }
  
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("userId", data.userId);
        navigate("/llogaria-ime");
      } else {
        // Display the server-provided error message or a default one
        setError(data.message || "Diçka shkoi keq. Ju lutem provoni përsëri.");
      }
    } catch (err) {
      setError("Ndodhi një gabim. Ju lutem provoni përsëri.");
    }
  };
  
  
  
  return (
    <>
    <Header />
     <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          id="username"
          value={formData.username || ""}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          value={formData.email || ""}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          value={formData.password || ""}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Sign Up
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <p className="text-start mt-2 pb-10">
          E keni një account? <Link to="/sign-in" className="text-blue-500 underline">Vazhdo tek Sign In</Link>
        </p>
    </div>
    </>
  );
};

export default Shemsia;