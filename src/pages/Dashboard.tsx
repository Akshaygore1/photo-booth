import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { client } from "../lib/appwrite";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const sendPing = async () => {
    try {
      const result = await client.ping();
      const log = {
        date: new Date(),
        method: "GET",
        path: "/v1/ping",
        status: 200,
        response: JSON.stringify(result),
      };
      console.log(log);
      alert("Ping successful! Check console for details.");
    } catch (err) {
      console.error(err);
      alert("Ping failed! Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Photo Booth Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Welcome, {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              User Information
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">ID:</span> {user?.$id}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p>
                <span className="font-medium">Name:</span> {user?.name}
              </p>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={sendPing}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
              >
                Test Appwrite Connection
              </button>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-300">
                Take Photo
              </button>
              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition duration-300">
                View Gallery
              </button>
            </div>
          </div>

          {/* Photo Booth Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Photo Booth Status
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Camera:</span>
                <span className="text-green-500 font-medium">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Storage:</span>
                <span className="text-green-500 font-medium">Available</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Backend:</span>
                <span className="text-green-500 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
