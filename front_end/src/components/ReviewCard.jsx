import React, { useState, useEffect } from 'react';
import { Share, MessageCircle, Heart, Star, Bookmark } from 'lucide-react';
import axios from 'axios';

const ReviewCard = ({ 
  image, 
  rating, 
  comment, 
  tags, 
  mood, 
  spoiler, 
  user, 
  createdAt, 
  movie, 
  _id, 
  likes = [] 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes.length);
  const [followLoading, setFollowLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const accessToken = localStorage.getItem("accessToken");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    const checkInitialStatus = async () => {
      try {
        const currentUserId = localStorage.getItem("user");
        if (!currentUserId || !_id || !accessToken) return;

        const likeResponse = await axios.post(
          "http://localhost:5300/api/v1/notifiaction/isLike", 
          { postId: _id }, 
          axiosConfig
        );
        setIsLiked(likeResponse.data.data.isLiked);

        const followResponse = await axios.post(
          "http://localhost:5300/api/v1/users/checkFollow",
          { followedId: user._id.toString() },
          axiosConfig
        );
        setIsFollowing(followResponse.data.data.isFollowing);
      } catch (error) {
        console.error("Error checking initial status:", error.response?.data || error.message);
      }
    };

    if (accessToken) {
      checkInitialStatus();
    }
  }, [_id, user?._id, accessToken]);

  const handleLike = async () => {
    if (likeLoading || !_id || !accessToken) return;
    
    setLikeLoading(true);
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

    try {
      await axios.post(
        "http://localhost:5300/api/v1/notifiaction/likeNotification",
        { postId: _id },
        axiosConfig
      );
    } catch (error) {
      setIsLiked(prev => !prev);
      setLikesCount(prev => newLikedState ? prev - 1 : prev + 1);
      console.error("Error toggling like:", error.response?.data || error.message);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user?._id || followLoading || !accessToken) {
      setErrorMessage("Please log in to follow");
      return;
    }

    setFollowLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post(
        "http://localhost:5300/api/v1/users/toggleFollow",
        { followedId: user._id.toString() },
        axiosConfig
      );
      setIsFollowing(response.data.data.isFollowing);
    } catch (error) {
      console.error("Error toggling follow:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Failed to toggle follow");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleSave = () => setSaved(prev => !prev);
  const handleShare = () => alert('Share this review!');
  const handleComment = () => alert('Open comments section!');

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={18}
        fill={i < rating ? 'currentColor' : 'none'}
        className={`transition-colors ${i < rating ? 'text-yellow-400' : 'text-gray-500'}`}
      />
    ));
  };

  return (
    <div className="w-full bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500 shadow-md"
              src={user?.avatar || "https://via.placeholder.com/50"}
              alt="User Avatar"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-500/30 animate-pulse opacity-30" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">{user?.username}</h2>
            <p className="text-xs text-gray-400">
              {new Date(createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleFollow}
            disabled={followLoading}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
              ${isFollowing
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-cyan-600 text-white hover:bg-cyan-700'}
              ${followLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            {followLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mx-auto" />
            ) : isFollowing ? (
              'Following'
            ) : (
              'Follow'
            )}
          </button>
          {errorMessage && (
            <p className="text-red-500 text-xs">{errorMessage}</p>
          )}
        </div>
      </div>

      {/* Movie Image */}
      <div className="relative">
        <img
          className="w-full h-72 sm:h-80 object-cover"
          src={image || "https://via.placeholder.com/600x400"}
          alt="Movie Scene"
        />
        {spoiler && (
          <span className="absolute top-3 left-3 bg-pink-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
            Spoiler
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 flex justify-between items-center border-b border-gray-800">
        <div className="flex gap-4">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`flex items-center ${likeLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <Heart
              size={22}
              fill={isLiked ? "currentColor" : "none"}
              className={`${isLiked ? "text-pink-500 animate-heartbeat" : "text-gray-400 hover:text-pink-500"} transition-colors`}
            />
            <span className="ml-1 text-gray-400 text-sm">{likesCount}</span>
          </button>
          <button 
            onClick={handleComment}
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <MessageCircle size={22} />
          </button>
          <button 
            onClick={handleShare}
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <Share size={22} />
          </button>
        </div>
        <button 
          onClick={handleSave}
          className="text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <Bookmark
            size={22}
            fill={saved ? 'currentColor' : 'none'}
            className={saved ? 'text-cyan-400 animate-bounce' : ''}
          />
        </button>
      </div>

      {/* Review Content */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex">{renderStars()}</div>
          <span className="text-sm text-gray-400">{rating}/5</span>
        </div>
        
        <div className="text-white">
          <span className="font-semibold text-cyan-300">{user?.username}</span>
          <span className="ml-2 text-cyan-400 italic">"{movie}"</span>
          <p className="mt-2 text-gray-300 text-sm leading-relaxed">{comment}</p>
        </div>
        
        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="text-cyan-400 text-xs font-medium bg-cyan-900/30 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {mood && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Mood:</span>
            <span className="px-2 py-1 bg-cyan-900/30 rounded-full text-cyan-400 text-xs font-medium">
              {mood}
            </span>
          </div>
        )}
      </div>

      {/* Comment Section */}
      <div className="p-4 border-t border-gray-800">
        <button
          className="text-gray-400 text-sm hover:text-cyan-400 transition-colors"
          onClick={handleComment}
        >
          Add a comment...
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;