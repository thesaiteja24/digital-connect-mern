import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const AdminDashboard = () => {
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

      <main className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-700">Total Views</h3>
            <p className="text-3xl font-bold text-gray-900">
              {analytics.viewCount}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-700">Total Clicks</h3>
            <p className="text-3xl font-bold text-gray-900">
              {analytics.clickCount}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-700">
              Interaction Rate
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {analytics.interactionRate}%
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Engagement Trends
          </h3>
          <ul className="space-y-2">
            {analytics.engagementTrends.map((trend, index) => (
              <li key={index} className="flex justify-between">
                <span className="text-gray-700">{trend.date}</span>
                <span className="font-bold text-gray-900">
                  {trend.engagement}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
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
