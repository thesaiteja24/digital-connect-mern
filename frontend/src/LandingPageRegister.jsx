import React from "react";
import { Link, useNavigate } from "react-router-dom";

const LandingPageRegister = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      
      {/* Main Content */}
      <main className="flex flex-col lg:flex-row max-w-7xl mx-auto py-16 px-4 lg:space-x-16">
        {/* Left Section */}
        <section className="flex-1 bg-light-blue p-8 border-r border-gray-300">
          <h2 className="text-2xl font-semibold text-bright-blue">For Faculty</h2>
          <p className="mt-4 text-gray-700">
            We are the market-leading technical interview platform to identify and hire developers with the right skills.
          </p>
          <button className="mt-6 bg-bright-blue text-white px-4 py-2 rounded-md font-medium" onClick={() => navigate("/faculty/register")}>
            Sign up
          </button>
          <p className="mt-4 text-sm text-gray-600">
            Do you an account? <Link to="/faculty/login" className="text-bright-blue hover:underline">Login</Link>.
          </p>
        </section>

        {/* Right Section */}
        <section className="flex-1 bg-white p-8">
          <h2 className="text-2xl font-semibold text-bright-blue">For Student</h2>
          <p className="mt-4 text-gray-700">
            Join over 21 million developers, practice coding skills, prepare for interviews, and get hired.
          </p>
          <button className="mt-6 bg-gray-800 text-white px-4 py-2 rounded-md font-medium" onClick={() => navigate("/student/register")}>
            Sign up
          </button>
          <p className="mt-4 text-sm text-gray-600">
            Do you an account? <Link to="/student/login" className="text-bright-blue hover:underline">Login</Link>.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          We use cookies to ensure you have the best browsing experience on our website. Read our <a href="#" className="text-bright-blue hover:underline">cookie policy</a> for more information.
        </div>
      </footer>
    </div>
  );
};

export default LandingPageRegister;
