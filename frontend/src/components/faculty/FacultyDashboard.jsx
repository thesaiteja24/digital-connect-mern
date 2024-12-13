import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Redirect to Notification Details page
  const viewNotification = (notification) => {
    navigate(`/faculty/dashboard/notification/${notification.id}`, { state: notification });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Faculty Dashboard</h1>

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
