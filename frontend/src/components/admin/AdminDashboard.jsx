import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';


const AdminDashboard = () => {

  const [notifications, setNotifications] = useState([])
  

  const [analytics, setAnalytics] = useState({
    viewCount: 0,
    clickCount: 0,
    interactionRate: 0,
    engagementTrends: [],
  });

  useEffect(() => {
    // Fetch analytics data from the server
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics");
        const data = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      }
    };
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const temp = async () => {
      let res = await fetch(`http://localhost:8080/api/admin/notices`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      });
      res = await res.json();
      setNotifications(res.notices);
      console.log(res.notices)
    }
  
    temp();  
  }, []);

  const { msg } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const notification = location.state || {};

  useEffect(() => {
    if (notification.token) {
      localStorage.setItem('token', notification.token);  
    }
  }, [notification]);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    navigate("/");
  };

  const handleSchedulePost = () => {
    navigate("/admin/dashboard/notice");
  };

  const handleNotice = () =>{
    navigate("/admin/dashboard/notice");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleSchedulePost}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Schedule Post
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

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
};

export default AdminDashboard;
