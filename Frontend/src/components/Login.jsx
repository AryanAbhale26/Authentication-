import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [showWarning, setShowWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prevLoginInfo) => ({ ...prevLoginInfo, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const { email, password } = loginInfo;

    if (!email || !password) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
      setIsSubmitting(false);
      return console.error("All fields are required");
    }

    if (password.length < 4) {
      setIsSubmitting(false);
      return console.error("Password must be at least 4 characters long");
    }

    const loginData = { email, password };

    try {
      const url = "http://localhost:8080/auth/login";
      const response = await axios.post(url, loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { success, message, jwtToken, name } = response.data;

      if (success) {
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedUser", name);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        console.error("Login failed:", message);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        {showWarning && (
          <div className="mb-4 p-4 bg-red-500 text-white rounded-md">
            All fields are required
          </div>
        )}
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={loginInfo.email}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <input
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={loginInfo.password}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-green-600 text-white rounded-lg py-2 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
          <p className="mt-4 text-center">
            If you don't have an account?{" "}
            <Link to="/signup" className="text-green-600 underline">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
