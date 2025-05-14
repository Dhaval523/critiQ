import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Users, List, Plus, Settings, X, Film, Clapperboard, LogOut, Image, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EditSettingsModal = ({ user, onClose, onLogout, onCoverUpdate }) => {
  const [fullName, setFullName] = useState(user.fullName || "");
  const [username, setUsername] = useState(user.username || "");
  const [bio, setBio] = useState(user.bio || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(user.coverImage || "");
  const fileInputRef = useRef(null);
  const accessToken = localStorage.getItem("accessToken");

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("email",email)
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }
      if(avatar){
        formData.append("avatar", avatar);
      }

      const response = await axios.put(
        "http://localhost:5300/api/v1/users/updateProfile",
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data"
          } 
        }
      );
      
      if (coverImage) {
        onCoverUpdate(response.data.data.user.coverImage);
      }
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      setLoading(false);
      return;
    }

    try {
      await axios.put(
        "http://localhost:5300/api/v1/users/changePassword",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password changed successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-950/90 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-gray-900 w-full max-w-[95%] sm:max-w-md md:max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto border border-amber-500/30 shadow-2xl shadow-amber-500/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-amber-400 flex items-center gap-2">
            <Settings className="w-5 h-5" /> Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-700/30 rounded-full text-amber-400 hover:text-amber-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 text-red-300 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Cover Image Upload */}
        <div className="mb-6">
          <div className="relative h-32 rounded-lg overflow-hidden mb-4 border border-amber-600/30">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
                <Image className="text-gray-600 w-10 h-10" />
              </div>
            )}
            <button
              onClick={triggerFileInput}
              className="absolute bottom-3 right-3 bg-amber-600/80 hover:bg-amber-700/90 text-white px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1 text-xs"
            >
              <Camera className="w-4 h-4" />
              <span>Change Cover</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCoverChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4 mb-6">
          <div>
            <label className="text-amber-400 text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full mt-1 p-3 bg-gray-800/50 border border-amber-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-amber-400 text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 p-3 bg-gray-800/50 border border-amber-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-amber-400 text-sm font-medium">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mt-1 p-3 bg-gray-800/50 border border-amber-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              rows="3"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/30"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Updating...</span>
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>

        <form onSubmit={handlePasswordChange} className="space-y-4 mb-6">
          <div>
            <label className="text-amber-400 text-sm font-medium">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full mt-1 p-3 bg-gray-800/50 border border-amber-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-amber-400 text-sm font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-1 p-3 bg-gray-800/50 border border-amber-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-teal-400 text-sm font-medium">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 p-3 bg-gray-800/50 border border-teal-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 rounded-lg transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-teal-500/30"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>

        <button
          onClick={onLogout}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-red-500/30"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </motion.div>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5300/api/v1/users/profileView", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.data?.data) {
          setUser(response.data.data.user);
          setCoverImage(response.data.data.user.coverImage || "");
          setFollowerCount(response.data.data.follower || 0);
          setFollowingCount(response.data.data.following || 0);
          setPlaylists(response.data.data.user.playlists || []);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [accessToken]);

  const fetchFollowers = async () => {
    try {
      const response = await axios.get("http://localhost:5300/api/v1/users/getFollowersAndFollowing", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setFollowers(response.data.data.followers || []);
      setShowFollowersModal(true);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const response = await axios.get("http://localhost:5300/api/v1/users/getFollowersAndFollowing", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setFollowing(response.data.data.following || []);
      setShowFollowingModal(true);
    } catch (error) {
      console.error("Error fetching following:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  const handleCoverUpdate = (newCoverUrl) => {
    setCoverImage(newCoverUrl);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-amber-500 text-base sm:text-lg md:text-xl font-semibold animate-pulse flex items-center gap-3">
        <Clapperboard className="w-6 h-6 animate-bounce" /> Loading your profile...
      </div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-teal-400 text-base sm:text-lg md:text-xl font-semibold flex items-center gap-2">
        <Film className="w-6 h-6" /> No profile found
      </div>
    </div>
  );

  const UserListModal = ({ title, users, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-950/90 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-gray-900 w-full max-w-[95%] sm:max-w-md md:max-w-lg rounded-2xl p-6 max-h-[80vh] overflow-y-auto border border-amber-500/30 shadow-2xl shadow-amber-500/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-amber-400 flex items-center gap-2">
            <Users className="w-5 h-5" /> {title}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-amber-700/30 rounded-full text-amber-500 hover:text-amber-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {users.length > 0 ? (
            users.map((user) => (
              <div 
                key={user._id}
                className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-amber-800/30 transition-colors border border-amber-600/20"
              >
                <img
                  src={user.avatar || "https://via.placeholder.com/40"}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-500 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-amber-500 font-semibold text-sm sm:text-base truncate">{user.fullName}</p>
                  <p className="text-white text-xs">@{user.username}</p>
                </div>
                <div className="text-xs text-amber-400">
                  <span>{user.followers?.length || 0} Fans</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-6 text-sm">No users found</p>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen md:pl-20 items-center bg-gray-950 text-white font-sans">
      {/* Cover Image Section */}
      <div className="relative h-[30vh] sm:h-[35vh] md:h-[40vh] max-h-[400px]">
        {coverImage ? (
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover -z-10"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-800 to-amber-900 flex items-center justify-center">
            <div className="text-center">
              <Clapperboard className="w-10 h-10 mx-auto text-gray-600 mb-2" />
              <p className="text-gray-500">No cover image set</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/20 via-gray-950/60 to-gray-950" />
        
        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 md:px-8 pb-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
            <div className="relative group">
              <img
                src={user.avatar || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-amber-500 object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full border-2 border-amber-400/40 animate-[spin_8s_linear_infinite] opacity-60" />
            </div>
            <div className="text-center sm:text-left space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">{user.fullName}</h1>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg font-medium">@{user.username}</p>
              <div className="flex justify-center sm:justify-start gap-4 sm:gap-6">
                <button 
                  onClick={fetchFollowers}
                  className="text-sm sm:text-base text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                >
                  <Users className="w-4 h-4" /> {followerCount} Fans
                </button>
                <button 
                  onClick={fetchFollowing}
                  className="text-sm sm:text-base text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                >
                  <Users className="w-4 h-4" /> {followingCount} Following
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900/90 p-4 sm:p-6 rounded-2xl border border-amber-500/20 shadow-lg shadow-amber-500/10">
              <p className="text-gray-200 text-sm sm:text-base font-medium italic bg-gray-800/40 p-3 rounded-lg">
                "{user.bio || "Crafting my cinematic journey..."}"
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-amber-400 bg-gray-800/40 px-4 py-2 rounded-lg">
                <List className="w-5 h-5" />
                <span className="text-sm sm:text-base font-semibold">{playlists.length} Lists</span>
              </div>
            </div>
            <div className="space-y-4">
              {/* <button 
                onClick={() => setShowEditModal(true)}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-1"
              >
                <Settings className="w-5 h-5" />
                <span className="text-sm sm:text-base font-semibold">Edit Profile</span>
              </button> */}

              <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-1">
                <Plus className="w-5 h-5" />
                <span className="text-sm sm:text-base font-semibold">New Playlist</span>
              </button>

              <button 
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:-translate-y-1"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm sm:text-base font-semibold">Log Out</span>
              </button>
            </div>
          </div>

          {/* Playlist Section */}
          <div className="lg:col-span-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-2">
              <Clapperboard className="w-6 h-6 text-amber-400" />
              <span>Your Playlists</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {playlists.map((playlist) => (
                <motion.div
                  key={playlist._id}
                  whileHover={{ y: -5 }}
                  className="relative bg-gray-900/90 p-4 sm:p-5 rounded-xl hover:bg-amber-900/30 transition-all duration-300 cursor-pointer border border-amber-500/20 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 group"
                  onClick={() => setSelectedPlaylist(playlist)}
                >
                  <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <h3 className="text-base sm:text-lg font-semibold text-amber-300 group-hover:text-amber-200 truncate relative z-10">{playlist.name}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm mt-1 relative z-10">{playlist.movies?.length || 0} Films</p>
                </motion.div>
              ))}
              {playlists.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-400 text-center py-8 sm:py-10 col-span-full text-sm sm:text-base font-medium"
                >
                  <Film className="w-6 h-6 mx-auto mb-2" /> Create your first playlist!
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedPlaylist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-950/95 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-gray-900 w-full max-w-[95%] sm:max-w-3xl md:max-w-4xl rounded-2xl p-6 max-h-[85vh] overflow-y-auto border border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-400 flex items-center gap-2">
                  <Clapperboard className="w-5 h-5" /> {selectedPlaylist.name}
                </h2>
                <button 
                  onClick={() => setSelectedPlaylist(null)}
                  className="p-2 hover:bg-amber-700/30 rounded-full text-amber-500 hover:text-amber-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {selectedPlaylist.movies?.length > 0 ? (
                  selectedPlaylist.movies.map((movie) => (
                    <motion.div 
                      key={movie.imdbID}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative bg-gray-800/90 rounded-lg overflow-hidden hover:bg-amber-900/30 transition-all duration-300 shadow-lg shadow-amber-500/10 group"
                    >
                      <div className="relative">
                        <img 
                          src={movie.Poster} 
                          alt={movie.Title} 
                          className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg_gradient-to-t from-gray-900/80 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                        <div className="absolute top-2 right-2 bg-amber-500/80 px-2 py-1 rounded-full text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {movie.imdbID}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm sm:text-base font-semibold text-amber-300 group-hover:text-amber-200 truncate">{movie.Title}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm mt-1">{movie.Year}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-6 col-span-full text-sm sm:text-base font-medium">
                    <Film className="w-6 h-6 mx-auto mb-2" /> No films in this playlist
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {showFollowersModal && (
          <UserListModal 
            title="Fans"
            users={followers}
            onClose={() => setShowFollowersModal(false)}
          />
        )}

        {showFollowingModal && (
          <UserListModal 
            title="Following"
            users={following}
            onClose={() => setShowFollowingModal(false)}
          />
        )}

        {showEditModal && (
          <EditSettingsModal 
            user={user}
            onClose={() => setShowEditModal(false)}
            onLogout={handleLogout}
            onCoverUpdate={handleCoverUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;