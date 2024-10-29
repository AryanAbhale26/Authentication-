import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("loggedUser");
    setLoggedInUser(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedUser");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-5xl font-bold mb-4 animate-bounce">
        Welcome, {loggedInUser}!
      </h1>
      <p className="text-lg mb-8">We're glad to see you here.</p>
      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
