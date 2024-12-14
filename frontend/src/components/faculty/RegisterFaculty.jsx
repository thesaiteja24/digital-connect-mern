import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import FlashMessage from '../FlashMessage'; // Assuming a reusable FlashMessage component
import Facultylr from "../../assets/Leonardo_Phoenix_A_modern_sleek_digital_notice_board_set_again_0.jpg";

export default function RegisterFaculty() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  const [flash, setFlash] = useState({
    message: "",
    type: "success",
    show: false,
  });

  const showFlashMessage = (message, type = "success") => {
    setFlash({ message, type, show: true });

    setTimeout(() => {
      setFlash((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleRegister = async () => {
    try {
      let res = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          phone,
          password,
          branch: selectedBranch,
          role: "faculty",
        }),
      });
      res = await res.json();
      let msg = res.message;

      if (msg === "Registration successful!") {
        showFlashMessage(msg, "success");
      } else {
        showFlashMessage(msg, "error");
      }
      navigate(`/faculty/login`);
    } catch (error) {
      showFlashMessage("An error occurred during registration.", "error");
    }
  };

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
  };

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
        <div className="flex flex-col md:flex-row justify-content">
          {/* Left Column */}
          <div className="flex flex-col justify-center w-full md:w-1/2 order-2 md:order-1 px-6 md:px-12">
            <h1 className="text-center text-3xl font-bold mb-6">Register</h1>

            <div className="space-y-6">
              {/* Name Input */}
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full py-2 px-4 bg-white text-black border border-black rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) => setUsername(e.target.value)}
              />

              {/* Email Input */}
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full py-2 px-4 bg-white text-black border border-black rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Phone Input */}
              <input
                type="text"
                placeholder="Phone number"
                className="w-full py-2 px-4 bg-white text-black border border-black rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) => setPhone(e.target.value)}
              />

              {/* Password Input */}
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full py-2 px-4 bg-white text-black border border-black rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Branch Dropdown */}
              <select
                id="branch"
                value={selectedBranch}
                onChange={handleBranchChange}
                className="w-full py-2 px-4 bg-white text-black border border-black rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="" disabled>
                  Select your branch
                </option>
                <option value="CSE">CSE</option>
                <option value="CSM">CSM</option>
                <option value="CSD">CSD</option>
              </select>
            </div>

            {/* Register Button */}
            <div className="flex justify-center items-center">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-1/2 mt-6"
                onClick={handleRegister}
              >
                Register
              </button>
            </div>


            {/* Login Link */}
            <Link
              to="/faculty/login"
              className="mt-4 text-blue-500 hover:text-blue-600 text-center block"
            >
              Already have an account? Login
            </Link>
          </div>

          {/* Right Column */}
          <div className="flex items-center justify-center w-full md:w-1/2 order-1 md:order-2 mb-6 md:mb-0">
            <img
              src={Facultylr}
              alt="Registration"
              className="rounded-2xl w-full hidden sm:block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
