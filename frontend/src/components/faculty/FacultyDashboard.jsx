import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";


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

const FacultyDashboard = () => {
  const [flash, setFlash] = useState({
    message: "",
    type: "success",
    show: false,
  });

  const { msg } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  console.log(data);
  const notification = location.state || {};

  // Sample notifications data
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const temp = async () => {
      let res = await fetch(`http://localhost:8080/api/faculty/${data.user.branch}/notices`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      });
      res = await res.json();
      setNotifications(res.notices);
    }
  
    temp();  
  }, []); 
  


  useEffect(() => {
    if (msg) {
      setFlash({ message: msg, type: "success", show: true });

      setTimeout(() => {
        setFlash((prev) => ({ ...prev, show: false }));
      }, 3000);
    }

    if (notification.token) {
      localStorage.setItem("token", notification.token);
    }
  }, [msg]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const viewNotification = (notification) => {
    navigate(`student/dashboard/notification/${notification.id}`, {
      state: notification,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Flash Message */}
      <FlashMessage
        message={flash.message}
        type={flash.type}
        show={flash.show}
      />

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

export default FacultyDashboard;
