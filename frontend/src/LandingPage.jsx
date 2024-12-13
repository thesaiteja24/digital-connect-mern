import React from "react";
import { Link } from "react-router-dom";
import NoticeBoardImage from "./assets/Leonardo_Phoenix_A_modern_digital_notice_board_set_against_a_c_2.jpg";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-500 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Digital Connect</h1>
          <div className="space-x-4">
            <Link
              to="/landinglogin"
              className="text-white font-medium hover:text-blue-300"
            >
              Login
            </Link>
            <Link
              to="/landingregister"
              className="text-white font-medium hover:text-blue-300"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Section 1: Content and Image */}
      <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-white">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-4">Welcome to the Digital Connect</h2>
          <p className="text-gray-700 mb-4">
            Access everything you need, whether you're a student, lecturer, or
            admin. Stay connected, informed, and up-to-date.
          </p>
          <Link
            to="/landingregister"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Get Started
          </Link>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <img
            src={NoticeBoardImage}
            alt="no image"
            className="rounded-lg shadow-md w-full"
          />
        </div>
      </div>

      {/* Section 2: Cards */}
      <div className="py-12 bg-gray-100">
        <h2 className="text-center text-2xl font-bold mb-8">Who Are You?</h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Student",
              description: "Access classes, assignments, and resources for your academic journey.",
              img: "https://via.placeholder.com/300",
            },
            {
              title: "Lecturer",
              description: "Manage courses, post materials, and communicate with students.",
              img: "https://via.placeholder.com/300",
            },
            {
              title: "Admin",
              description: "Handle user accounts, announcements, and institutional data.",
              img: "https://via.placeholder.com/300",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <img
                src={card.img}
                alt={card.title}
                className="h-40 w-full object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Notice Board */}
      <div className="p-8 bg-white">
        <h2 className="text-center text-2xl font-bold mb-4">Notice Board</h2>
        <ul className="space-y-4 text-gray-700">
          {[
            "Upcoming exams are scheduled for next week.",
            "Campus will remain closed on national holidays.",
            "New library resources have been added.",
          ].map((notice, index) => (
            <li key={index} className="p-4 bg-gray-100 rounded shadow">
              {notice}
            </li>
          ))}
        </ul>
      </div>

      {/* Section 4: Events */}
      <div className="p-8 bg-gray-100">
        <h2 className="text-center text-2xl font-bold mb-4">Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Annual Sports Day",
              date: "March 15, 2024",
              description: "Participate in various sports activities and show your talent!",
            },
            {
              title: "Tech Fest",
              date: "April 20, 2024",
              description: "Showcase your innovative projects and learn from experts.",
            },
          ].map((event, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{event.date}</p>
              <p className="text-gray-700">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

