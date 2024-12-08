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
    setLoading(true);
  
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

        // Display specific error messages based on the response from the backend
        if (data.message === "Përdoruesi nuk ekziston") {
          setError("Përdoruesi nuk ekziston");
        } else if (data.message === "Passwordi është gabim") {
          setError("Passwordi është gabim");
        } else {
          setError(data.message || "Ndodhi një gabim, ju lutemi provoni përsëri.");
        }

        return;
      }
  
      // Store only token and user ID in localStorage
      localStorage.setItem("jwt", data.access_token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("isAuth", "true");
  
      // Clear form data
      setFormData({ email: "", password: "" });
  
      navigate("/llogaria-ime");
      setLoading(false);
      setError(null);
  
    } catch (error) {
      setLoading(false);
      if (error.message === "Failed to fetch") {
        setError("Probleme me lidhjen. Ju lutemi kontrolloni rrjetin tuaj dhe provoni përsëri.");
      } else {
        setError("Ndodhi një gabim: " + error.message);
      }
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

        {error && <p className="text-red-500 mt-4" aria-live="polite">{error}</p>}

        {/* Add the sign-up message */}
        <p className="text-start mt-2 pb-10">
          Nuk keni një account akoma? <Link to="/sign-up" className="text-blue-500 underline">Krijo një tani</Link>
        </p>
      </div>
    </>
  );
};

export default Admin;
