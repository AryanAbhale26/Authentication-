import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils/Tostify";

const Signup = () => {
  const navigate = useNavigate();
  const [signInfo, setSignInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showWarning, setShowWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignInfo((prevSignInfo) => ({ ...prevSignInfo, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true); // Disable button while submitting

    const { name, email, password } = signInfo;

    if (!name || !email || !password) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
      setIsSubmitting(false); // Re-enable button
      return handleError("All fields are required");
    }

    // Validate name and password lengths
    if (name.length < 4) {
      setIsSubmitting(false); // Re-enable button
      return handleError("Name must be at least 4 characters long");
    }
    if (password.length < 9) {
      setIsSubmitting(false); // Re-enable button
      return handleError("Password must be at least 9 characters long");
    }

    // Prepare the data for sending
    const signupData = { name, email, password };

    try {
      const url = "http://localhost:8080/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setIsSubmitting(false); // Re-enable button
        return handleError(
          errorData.message || "An error occurred during signup"
        );
      }

      const result = await response.json();
      const { success, message } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setIsSubmitting(false);
      handleError("An error occurred during signup");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        {showWarning && (
          <div className="mb-4 p-4 bg-red-500  rounded-md">
            All fields are required
          </div>
        )}
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1">
              Name
            </label>
            <input
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={signInfo.name}
              required
            />
          </div>
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
              value={signInfo.email}
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
              value={signInfo.password}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-green-600  rounded-lg py-2 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
