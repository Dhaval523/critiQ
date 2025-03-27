import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, UserPlus, Heart } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("accessToken");

  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5300/api/v1/notifiaction/getNotification",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.data?.data?.notifications) {
        setNotifications(response.data.data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();

    // Polling: Refresh notifications every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-2xl font-semibold animate-pulse tracking-wider">
          <div className="flex items-center gap-2">
            <Bell className="w-8 h-8 animate-bounce" />
            Loading Notifications...
          </div>
        </div>
      </div>
    );

  // Function to get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case "follow":
        return <UserPlus className="w-6 h-6 text-cyan-400" />;
      case "like":
        return <Heart className="w-6 h-6 text-pink-400" />;
      default:
        return <Bell className="w-6 h-6 text-gray-400" />;
    }
  };

  // Function to generate notification messages
  const getNotificationMessage = (notification) => {
    switch (notification.type) {
      case "follow":
        return (
          <span>
            <span className="font-bold text-cyan-300">
              {notification.sender.fullName}
            </span>{" "}
            <span className="text-gray-400 text-sm">@{notification.sender.username}</span> started following you
          </span>
        );
      case "like":
        return (
          <span>
            <span className="font-bold text-pink-300">
              {notification.sender.fullName}
            </span>{" "}
            <span className="text-gray-400 text-sm">@{notification.sender.username}</span> liked your{" "}
            <span className="text-gray-200">{notification.contentType}</span>
          </span>
        );
      default:
        return "New notification";
    }
  };

  // Function to format time
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-5  px-4  lg:p-20">
      <div className="w-auto mx-auto">
        {/* Header */}
        

        {/* Notifications List */}
        <div className="space-y-4 sm:space-y-6">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="relative flex items-start gap-4 sm:gap-5 p-4 sm:p-6 bg-gray-900/40 rounded-xl sm:rounded-2xl border border-gray-800/30 hover:border-cyan-500/50 transition-all duration-300 shadow-lg sm:shadow-xl shadow-cyan-500/5 hover:shadow-cyan-500/10"
              >
                <div className="relative flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 animate-pulse opacity-30 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-200 text-sm sm:text-lg font-medium tracking-wide">
                    {getNotificationMessage(notification)}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    {formatTimeAgo(notification.createdAt)}
                  </p>
                </div>
                {notification.sender.avatar && (
                  <img
                    src={notification.sender.avatar}
                    alt={notification.sender.username}
                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-cyan-500/50 shadow-md"
                  />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 sm:py-16">
              <Bell className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg font-medium tracking-wide">
                No notifications yet
              </p>
              <p className="text-gray-500 text-sm mt-2">
                You'll see updates here when people interact with you
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;