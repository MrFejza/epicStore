import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    setLoading(true); // Start loading when submitting

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        setError(data.message || "An error occurred, please try again.");
        return;
      }

      // Store token, userId, and role in localStorage
      localStorage.setItem("jwt", data.access_token); // Save the token
      localStorage.setItem("userId", data._id); // Save userId
      localStorage.setItem("isAuth", "true");
      localStorage.setItem("isAdmin", data.isAdmin ? "true" : "false");

      // Redirect based on user role
      if (data.isAdmin) {
        navigate("/menaxhimi-i-produkteve");  // Redirect to admin page
      } else {
        navigate("/llogaria-ime");  // Redirect to user page
      }

      setLoading(false);
      setError(null);

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

        {/* Add the sign-up message */}
        <p className="text-start mt-2 pb-10">
          Nuk keni një account akoma? <Link to="/sign-up" className="text-blue-500 underline">Krijo një tani</Link>
        </p>
      </div>
    </>
  );
};

export default Admin;
