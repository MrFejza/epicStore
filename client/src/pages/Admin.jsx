import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Admin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Sign-in response:", data);

      if (!data.success) {
        setLoading(false);
        setError(data.message);
        return;
      }

      // Check if the user is an admin
      if (!data.isAdmin) {
        setLoading(false);
        setError("Access Denied: You do not have admin privileges.");
        return;
      }

      console.log(data)

      // Store user info and token
      localStorage.setItem('isAuth', 'true');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('jwt', data.access_token);
      // document.cookie = `access_token=${data.token}; path=/;`;

      setLoading(false);
      setError(null);

      // Redirect to the upload page after successful sign-in
      navigate("/upload");

    } catch (error) {
      setLoading(false);
      setError("An error occurred: " + error.message);
    }
  };

  return (
    <>
    <Header />
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
    </>
    
  );
};

export default Admin;