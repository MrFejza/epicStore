import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleCallbackHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from the URL query params
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const isAdmin = params.get("isAdmin"); // Assuming isAdmin is passed as a query param

    if (token) {
      // Store the token in localStorage
      localStorage.setItem("jwt", token);
      localStorage.setItem("isAuth", "true");
      localStorage.setItem("isAdmin", isAdmin); // Store admin status
      
      // Redirect based on admin status
      if (isAdmin === "true") {
        navigate("/menaxhimi-i-produkteve"); // Admin dashboard
      } else {
        navigate("/llogaria-ime"); // User dashboard
      }
    } else {
      // If no token is found, redirect to sign-in
      navigate("/sign-in");
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default GoogleCallbackHandler;
