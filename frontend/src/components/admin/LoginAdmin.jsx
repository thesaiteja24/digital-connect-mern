import React, { useState } from 'react';
import { Link,useNavigate } from "react-router-dom";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () =>{
      // console.log(email,password);
      let res = await fetch('http://localhost:8080/api/admin/login',{
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
       body:JSON.stringify({
          'email': email,
          'password': password, 
        }),
      });
      res = await res.json();
      let msg = res.message;
      console.log(res);
      if(msg == "Admin login successful!" && res.admin.role == "admin"){
        navigate(`/admin/dashboard/${msg}`, { state: res });
      }
      setMessage(msg);
      if(res.user.role != "student"){
        setMessage("you are not a student");
      }
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row">
          {/* Left Column */}
          <div className="flex flex-col justify-center w-full md:w-1/2 order-2 md:order-1 px-6 md:px-12">
            <h1 className="text-center text-3xl font-bold mb-6">Login</h1>

            {/* Common Class for Uniform Width */}
            <div className="space-y-6">
             

              {/* Email Input */}
              <div>
                {/* <label className="block text-lg font-semibold mb-2 text-black">
                  Your Email
                </label> */}
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full py-2 px-4 bg-white text-black border border-black rounded focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={ (e) => {setEmail(e.target.value)} }
                />
              </div>

              

              {/* Password Input */}
              <div>
                {/* <label className="block text-lg font-semibold mb-2 text-black">
                  Password
                </label> */}
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full py-2 px-4 bg-white text-black border border-black rounded focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={ (e) => {setPassword(e.target.value)} }
                />
              </div>
            </div>

            {/* Register Button */}
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full mt-6" onClick={ handleLogin }>
              Login
            </button>

            {/* Login Link */}
            <Link 
              to="/admin/register" 
              className="mt-4 text-blue-500 hover:text-blue-600 text-center block"
            >
              Don't have an account? Register
            </Link>
          </div>

          {/* Right Column */}
          <div className="flex items-center justify-center w-full md:w-1/2 order-1 md:order-2 mb-6 md:mb-0">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
              alt="Registration"
              className="rounded-2xl w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
