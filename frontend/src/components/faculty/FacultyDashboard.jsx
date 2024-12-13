import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const FacultyDashboard = () => {
  // Sample notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Exam Schedule Released",
      message: "Check the exam timetable on the portal.",
      image: "https://via.placeholder.com/150",
      details: "The exam schedule for all courses has been updated. Visit the Exams section for more details.",
      read: false,
    },
    {
      id: 2,
      title: "Holiday Notice",
      message: "Campus will remain closed on December 25th.",
      image: "https://via.placeholder.com/150",
      details: "This holiday is in observance of Christmas. Enjoy your break!",
      read: true,
    },
    {
      id: 3,
      title: "Workshop on AI",
      message: "Join the workshop on AI at 3 PM on Friday.",
      image: "https://via.placeholder.com/150",
      details: "The AI workshop will cover recent advancements in machine learning. Venue: Room 305, CS Building.",
      read: false,
    },
  ]);

  const { msg } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const notification = location.state || {}; // Get the notification object

  const [flash, setFlash] = useState({
    message: "",
    type: "success",
    show: false,
  });

  useEffect(() => {
    if (msg) {
      setFlash({ message: msg, type: "success", show: true });

      // Hide the flash message after 3 seconds
      setTimeout(() => {
        setFlash((prev) => ({ ...prev, show: false }));
      }, 3000);
    }

    if (notification.token) {
      localStorage.setItem('token', notification.token);
    }
  }, [msg, notification]);

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setFlash({ message: "Notification marked as read!", type: "success", show: true });
    setTimeout(() => setFlash((prev) => ({ ...prev, show: false })), 3000); // Hide flash message after 3 seconds
  };

  // Redirect to Notification Details page
  const viewNotification = (notification) => {
    navigate(`/faculty/dashboard/notification/${notification.id}`, { state: notification });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setFlash({ message: "Logged out successfully!", type: "success", show: true });
    setTimeout(() => setFlash((prev) => ({ ...prev, show: false })), 3000); // Hide flash message after 3 seconds
    navigate("/");
  };

  const FlashMessage = ({ message, type, show }) => {
    if (!show) return null;

    return (
      <div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded shadow-md  border-2 border-black`}
      >
        {message}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Flash Message */}
      <FlashMessage message={flash.message} type={flash.type} show={flash.show} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Faculty Dashboard</h1>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            <img
              src={notification.image}
              alt={notification.title}
              className="rounded-t-lg w-full h-40 object-cover mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">
              {notification.title}
            </h3>
            <p className="text-sm text-gray-600 mt-2">{notification.message}</p>
            <div className="flex justify-between items-center mt-4">
              <Link
                to="#"
                onClick={() => viewNotification(notification)}
                className="text-green-500 hover:underline text-sm"
              >
                View
              </Link>
              {!notification.read ? (
                <Link
                  to="#"
                  onClick={() => markAsRead(notification.id)}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Mark as Read
                </Link>
              ) : (
                <span className="text-gray-400 text-sm">Read</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyDashboard;
