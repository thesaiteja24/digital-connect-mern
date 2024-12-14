import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Studentlr from "../../assets/Untitled design.png";
import FlashMessage from '../FlashMessage';

export default function LoginStudent() {
  const [flash, setFlash] = useState({
    message: "",
    type: "success",
    show: false,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Function to show the flash message
  const showFlashMessage = (message, type = "success", callback = null) => {
    setFlash({ message, type, show: true });

    setTimeout(() => {
      setFlash((prev) => ({ ...prev, show: false }));
      if (callback) {
        callback();
      }
    }, 3000);
  };

  // Handle login logic
  const handleLogin = async () => {
    try {
      let res = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      res = await res.json();
      let msg = res.message;

      if (msg === "Login successful!" && res.user.role === "student") {
        navigate(`/student/dashboard/${msg}`, { state: res });
      } else if (res.user.role !== "student") {
        msg = "You are not a student";
      }

      setMessage(msg);
    } catch (error) {
      setMessage("An error occurred while logging in.");
    }
  };

  // UseEffect for handling flash messages
  useEffect(() => {
    if (message) {
      showFlashMessage(message, "success", () => {
        setMessage(""); // Reset message after showing the flash
      });
    }
  }, [message]);

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'rgb(75 141 216 / 29%)' }}>
      {/* Flash Message */}
      {flash.show && (
        <FlashMessage
          message={flash.message}
          type={flash.type}
          show={flash.show}
        />
      )}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row">
          {/* Left Column */}
          <div className="flex flex-col justify-center w-full md:w-1/2 order-2 md:order-1 px-6 md:px-12">
            <h1 className="text-center text-3xl font-bold mb-6">Login</h1>

            <div className="space-y-6">
              {/* Email Input */}
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full py-2 px-4 bg-white text-black border border-black rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* Password Input */}
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full py-2 px-4 bg-white text-black border border-black rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Login Button */}
            <div className="flex justify-center items-center">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-1/2 mt-6"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>

            {/* Register Link */}
            <Link
              to="/student/register"
              className="mt-4 text-blue-500 hover:text-blue-600 text-center block"
              
            >
              Don't have an account? Register
            </Link>
          </div>

          {/* Right Column */}
          <div className="flex items-center justify-center w-full md:w-1/2 order-1 md:order-2 mb-6 md:mb-0">
            <img
              src={Studentlr}
              alt="Registration"
              className="rounded-2xl w-full hidden sm:block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
