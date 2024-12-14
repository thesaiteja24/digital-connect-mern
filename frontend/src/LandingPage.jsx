import React from "react";
import { Link } from "react-router-dom";
import NoticeBoardImage from "./assets/Leonardo_Phoenix_A_modern_digital_notice_board_set_against_a_c_2.jpg";
import StudentAvatar from "./assets/DALL·E 2024-12-13 21.58.59 - A cartoon-style avatar of a 20-year-old engineering student, resembling a.png";
import FacultyAvatar from "./assets/Untitled design (1).png";
import AdminAvatar from "./assets/Untitled design (2).png";

export default function LandingPage() {
  return (
    <div className="min-h-scree" style={{ backgroundColor: "#E9F1FA" }}>
      {/* Navbar */}
      <nav className="p-4 shadow-md" style={{ backgroundColor: "#37AFE1" }}      >
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Digital Connect</h1>
          <div className="space-x-10">
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
      <div className="flex flex-col md:flex-row items-center justify-between p-8" style={{ backgroundColor: 'rgb(75 141 216 / 29%)' }}>
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold mb-4">Welcome to the Digital Connect</h2>
          <h3 className="text-xl font-bold mb-4">A Smart Notification System for Instant Updates</h3>
          <p className="text-gray-700 mb-4">
          An advanced communication platform designed to modernize how notices and updates are shared within institutions. It allows administrators to post categorized notifications, ensuring the right information reaches the appropriate audience.
          </p>
          <Link
            to="/landingregister"
            className="px-4 py-2 text-white rounded hover:bg-blue-600"
            style={{ backgroundColor: "#00ABE4" }}
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
              description: "Stay updated with personalized notices and alerts! Access department-specific announcements, event schedules, and exam updates directly from the Digital Notice Board.",
              img: StudentAvatar,
            },
            {
              title: "Lecturer",
              description: "Effortlessly manage and share updates! Post announcements, schedule notices, and keep students informed through the Digital Notice Board.",
              img: FacultyAvatar,
            },
            {
              title: "Admin",
              description: "Oversee and organize efficiently! Manage users, monitor engagement, and ensure seamless communication with the Digital Notice Board.",
              img: AdminAvatar,
            },
          ].map((card, index) => (
            <div
              key={index}
              className=" p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              style={{ backgroundColor: 'rgb(75 141 216 / 29%)' }}
            >
              <img
                src={card.img}
                alt={card.title}
                className="h-50 w-full object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Notice Board */}
      <div className="p-8" style={{ backgroundColor: 'rgb(75 141 216 / 29%)' }}>
        <h2 className="text-center text-2xl font-bold mb-4">Notice Board</h2>
        <ul className="space-y-4 text-gray-700">
          {[
            "Upcoming exams are scheduled for next week.",
            "Campus will remain closed on national holidays.",
            "New library resources have been added.",
          ].map((notice, index) => (
            <li key={index} className="p-4 bg-white rounded shadow">
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
              className=" p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              style={{ backgroundColor: 'rgb(75 141 216 / 29%)' }}
            >
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{event.date}</p>
              <p className="text-gray-700">{event.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Bot Button */}
      <div className="fixed bottom-10 right-4 z-50">
        <Link
          target="_blank"
          to="/chatbot"
          className="bg-blue-500 text-white p-6 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          <span className="text-3xl">💬</span>
        </Link>
      </div>

    </div>
  );
}
