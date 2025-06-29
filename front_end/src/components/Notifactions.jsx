import React, { useState, useEffect } from 'react';
import { Bell, UserPlus, Heart, MessageCircle, RefreshCw, Lock, X, Check } from 'lucide-react';
import io from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';
import MovieLoader from './MovieLoader';

// Glowing Orbs Component
const GlowingOrbs = ({ count = 20 }) => {
  const orbs = Array.from({ length: count });
  return orbs.map((_, i) => {
    const size = Math.random() * 20 + 10;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 3;
    const colors = ['#ff4081', '#00bcd4', '#ff9800', '#e91e63', '#03a9f4'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return (
      <motion.div
        key={i}
        className="absolute rounded-full opacity-30 blur-lg"
        style={{
          width: size,
          height: size,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          background: `radial-gradient(circle, ${color} 20%, transparent 70%)`,
        }}
        animate={{
          y: [0, -150, 150, 0],
          x: [0, 100, -100, 0],
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    );
  });
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const accessToken = localStorage.getItem('accessToken');
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/v1/notification/getNotification', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (response.data?.data?.notifications) {
        const validNotifications = response.data.data.notifications.filter(
          (n) => n.sender !== null && n.sender !== undefined
        );
        setNotifications(validNotifications);
        if (validNotifications.length < response.data.data.notifications.length) {
          toast.error('Some notifications could not be displayed due to missing user data.', {
            style: {
              background: '#1a0b3d',
              color: '#f87171',
              border: '1px solid rgba(251, 113, 133, 0.3)',
              boxShadow: '0 0 15px rgba(251, 113, 133, 0.3)',
            },
          });
        }
      } else {
        setNotifications([]);
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching notifications:', error.response?.data || error.message);
      setError('Failed to load notifications. Please try again.');
      toast.error('Failed to load notifications.', {
        style: {
          background: '#1a0b3d',
          color: '#f87171',
          border: '1px solid rgba(251, 113, 133, 0.3)',
          boxShadow: '0 0 15px rgba(251, 113, 133, 0.3)',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Initialize socket.io and fetch notifications
  useEffect(() => {
    if (!accessToken) {
      setError('Please sign in to view notifications.');
      setLoading(false);
      toast.error('Please sign in to view notifications.', {
        style: {
          background: '#1a0b3d',
          color: '#f87171',
          border: '1px solid rgba(251, 113, 133, 0.3)',
          boxShadow: '0 0 15px rgba(251, 113, 133, 0.3)',
        },
      });
      return;
    }

    fetchNotifications();

    const socketInstance = io('https://critiq-3.onrender.com', {
      auth: { token: accessToken },
    });
    setSocket(socketInstance);

    socketInstance.on('new-notification', (notification) => {
      if (notification?.sender) {
        setNotifications((prev) => {
          if (!prev.some((n) => n?._id === notification?._id)) {
            toast.success('New notification received!', {
              style: {
                background: '#1a0b3d',
                color: '#34d399',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                boxShadow: '0 0 15px rgba(52, 211, 153, 0.3)',
              },
            });
            return [notification, ...prev];
          }
          return prev;
        });
      }
    });

    return () => {
      socketInstance.off('new-notification');
      socketInstance.disconnect();
    };
  }, [accessToken]);

  // Clear all notifications
  const clearNotifications = async () => {
    try {
      await axiosInstance.delete('/api/v1/notification/clearNotifications', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setNotifications([]);
      setError(null);
      toast.success('All notifications cleared!', {
        style: {
          background: '#1a0b3d',
          color: '#34d399',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          boxShadow: '0 0 15px rgba(52, 211, 153, 0.3)',
        },
      });
    } catch (error) {
      console.error('Error clearing notifications:', error.response?.data || error.message);
      setError('Failed to clear notifications. Please try again.');
      toast.error('Failed to clear notifications.', {
        style: {
          background: '#1a0b3d',
          color: '#f87171',
          border: '1px solid rgba(251, 113, 133, 0.3)',
          boxShadow: '0 0 15px rgba(251, 113, 133, 0.3)',
        },
      });
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.patch(`/api/v1/notification/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error.response?.data || error.message);
      setError('Failed to mark notification as read.');
      toast.error('Failed to mark notification as read.', {
        style: {
          background: '#1a0b3d',
          color: '#f87171',
          border: '1px solid rgba(251, 113, 133, 0.3)',
          boxShadow: '0 0 15px rgba(251, 113, 133, 0.3)',
        },
      });
    }
  };

  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase() || '') {
      case 'follow':
        return <UserPlus className="w-5 h-5 text-cyan-400" />;
      case 'like':
        return <Heart className="w-5 h-5 text-pink-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  // Generate notification message
  const getNotificationMessage = (notification) => {
    const username = notification?.sender?.username || 'Unknown User';
    const type = notification?.type?.toLowerCase() || '';
    switch (type) {
      case 'follow':
        return (
          <span>
            <span className="font-bold text-cyan-400">@{username}</span> started following you
          </span>
        );
      case 'like':
        return (
          <span>
            <span className="font-bold text-pink-500">@{username}</span> liked your post
          </span>
        );
      case 'comment':
        return (
          <span>
            <span className="font-bold text-blue-400">@{username}</span> commented on your post
          </span>
        );
      default:
        return 'New notification';
    }
  };

  // Format time
  const formatTimeAgo = (date) => {
    try {
      const now = new Date();
      const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
      if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    } catch {
      return 'Unknown time';
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'unread') return !notification.read;
    return true;
  });

  // Loading state
  if (loading) {
    return (
     <MovieLoader/>
    );
  }

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-gradient-to-br from-[#2d0072] via-[#a40082] to-[#00b5e0] py-12   md:py-12 text-white flex justify-center items-center px-4 sm:px-6">
      <Toaster position="top-right" />
     
      <GlowingOrbs count={20} />
      
      
    
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchNotifications}
              className="p-2.5 rounded-lg bg-[#1a0b3d]/50 hover:bg-amber-400/20 text-gray-200 hover:text-amber-400 transition-colors flex items-center"
              title="Refresh notifications"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>
            {/* {notifications.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearNotifications}
                className="px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </motion.button> */}
            
          </div>
        </div>

        {/* Filter Tabs */}
        {/* <div className="flex gap-2 mb-6 md:mb-8">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeFilter === 'all' 
                ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-gray-900' 
                : 'bg-[#1a0b3d]/50 text-gray-300 hover:bg-[#1a0b3d]/70'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeFilter === 'unread' 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-gray-900' 
                : 'bg-[#1a0b3d]/50 text-gray-300 hover:bg-[#1a0b3d]/70'
            }`}
          >
            Unread
          </button>
        </div> */}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 mb-6 bg-[#1a0b3d]/80 backdrop-blur-sm rounded-xl border border-red-400/30 text-red-300 text-center"
          >
            {error}
            <button
              onClick={fetchNotifications}
              className="ml-3 text-amber-400 hover:text-amber-300 underline"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`relative flex items-start gap-4 p-4 sm:p-5 bg-[#1a0b3d]/50 backdrop-blur-sm rounded-xl border ${
                    notification.read
                      ? 'border-amber-400/20'
                      : 'border-cyan-500/50'
                  } hover:border-cyan-500/70 transition-all duration-300`}
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Notification icon */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-[#1a0b3d] flex items-center justify-center border border-cyan-500/30">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  
                  {/* Notification content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-200 text-sm sm:text-base font-medium">
                      {getNotificationMessage(notification)}
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                    
                    {notification.spoiler && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-red-500/20 text-red-300 text-xs rounded">
                        Contains spoilers
                      </span>
                    )}
                  </div>
                  
                  {/* User avatar and actions */}
                  <div className="flex flex-col items-end gap-2">
                    {notification.sender?.avatar ? (
                      <img
                        src={notification.sender.avatar}
                        alt={notification.sender.username || 'User'}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-cyan-500/50"
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1a0b3d] flex items-center justify-center border border-cyan-500/50">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    
                    {/* {!notification.read && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => markAsRead(notification._id)}
                        className="text-xs px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Mark as read</span>
                      </motion.button>
                    )} */}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 sm:py-16 bg-[#1a0b3d]/50 backdrop-blur-sm rounded-xl p-8 border border-amber-400/20"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-700/10 flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-amber-400" />
                </div>
                <p className="text-gray-200 text-lg sm:text-xl font-medium">
                  No notifications yet
                </p>
                <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-md mx-auto">
                  You'll see updates here when people interact with your content
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Back to top button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg flex items-center justify-center z-30"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </motion.button>
    </div>
  );
};

export default Notifications;