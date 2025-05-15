import React, { useState, useEffect, useRef } from 'react';
import { Share, MessageCircle, Heart, Star, Bookmark, Send, Smile, X, MoreHorizontal, Film, Clapperboard, Popcorn } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import axiosInstance from '../api/axiosInstance';

// Movie-themed loading components
const FilmReelLoader = () => (
  <div className="flex items-center justify-center space-x-1">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="text-cyan-400"
      >
        <Film size={16} />
      </motion.div>
    ))}
  </div>
);

const PopcornLoader = () => (
  <div className="flex items-center justify-center space-x-1">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        className="text-yellow-400"
      >
        <Popcorn size={16} />
      </motion.div>
    ))}
  </div>
);

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
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const commentsEndRef = useRef(null);
  const commentInputRef = useRef(null);
  const [socket, setSocket] = useState(null);

  const accessToken = localStorage.getItem("accessToken");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  // Socket.io initialization
  useEffect(() => {
    const socketInstance = io('https://critiq-3.onrender.com', {
      auth: { token: accessToken }
    });
    setSocket(socketInstance);

    return () => socketInstance.disconnect();
  }, [accessToken]);

  // Real-time comment handling
  useEffect(() => {
    if (!socket) return;

    socket.on('new-comment', (comment) => {
      if (comment.post === _id) {
        setComments(prev => [...prev, comment]);
      }
    });

    socket.on('comment-deleted', (deletedCommentId) => {
      setComments(prev => prev.filter(c => c._id !== deletedCommentId));
    });

    return () => {
      socket.off('new-comment');
      socket.off('comment-deleted');
    };
  }, [socket, _id]);

  // Fetch comments when comments section is opened
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  // Scroll to bottom when comments update
  useEffect(() => {
    if (showComments && commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments.length, showComments]);
  
  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/comment/${_id}`,
        axiosConfig
      );
      setComments(res.data.data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      await axiosInstance.post(
        `/api/v1/comment/createComment`,
        { content: newComment, postId: _id },
        axiosConfig
      );
      setNewComment('');
      setShowEmojiPicker(false);
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstance.get(
        `/api/v1/comment/${commentId}`,
        axiosConfig
      );
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const Comment = ({ comment }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group relative flex gap-3 p-3 hover:bg-gray-800/20 rounded-lg transition-colors"
    >
      <div className="flex-shrink-0">
        <div className="relative">
          <img
            src={comment.user?.avatar || "/default-avatar.png"}
            className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500/30"
            alt="User avatar"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/10 to-cyan-500/20 animate-pulse opacity-30" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-white">
              {comment.user?.username}
            </span>
            <span className="text-xs text-gray-400">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
          
          {comment.user?._id === JSON.parse(localStorage.getItem("user"))?._id && (
            <button
              onClick={() => handleDeleteComment(comment._id)}
              className="text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <p className="mt-1 text-sm text-gray-100 break-words">
          {comment.content}
        </p>
      </div>
    </motion.div>
  );

  useEffect(() => {
    const checkInitialStatus = async () => {
      try {
        const currentUserId = localStorage.getItem("user");
        if (!currentUserId || !_id || !accessToken) return;

        const likeResponse = await axiosInstance.post(
          "/api/v1/notification/isLike", 
          { postId: _id }, 
          axiosConfig
        );
        setIsLiked(likeResponse.data.data.isLiked);

        const followResponse = await axiosInstance.post(
          "/api/v1/users/checkFollow",
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
      await axiosInstance.post(
        "/api/v1/notification/likeNotification",
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
      const response = await axiosInstance.post(
        "/api/v1/users/toggleFollow",
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

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <motion.div
        key={i}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <Star
          size={18}
          fill={i < rating ? 'currentColor' : 'none'}
          className={`transition-colors ${i < rating ? 'text-yellow-400' : 'text-gray-500'}`}
        />
      </motion.div>
    ));
  };

  return (
    <div className="w-full bg-black rounded-md overflow-hidden border border-gray-800 shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1 group relative">
      {/* Movie clapperboard decoration */}
      <div className="absolute -top-6 -left-6 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center rotate-[-15deg] z-10 border border-gray-700 shadow-lg">
        
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 relative z-20">
        <div className="flex items-center gap-3">
          <div className="relative">
            {user?.avatar ? (
              <>
                <img
                  className="w-10 h-10 rounded-full object-cover border-2 shadow-md"
                  src={user.avatar}
                  alt="User Avatar"
                  onLoad={() => setImageLoading(false)}
                />
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-full">
                    <FilmReelLoader />
                  </div>
                )}
              </>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border-2 border-amber-500 shadow-md">
                <Clapperboard size={20} className="text-amber-500" />
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-500/30 animate-pulse opacity-30" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">{user?.username || "Movie Buff"}</h2>
            <p className="text-xs text-gray-400">
              {createdAt ? (
                new Date(createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              ) : (
                <span className="inline-block w-20 h-3 bg-gray-700 rounded animate-pulse"></span>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleFollow}
            disabled={followLoading}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1
              ${isFollowing
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-amber-500 text-white hover:from-cyan-600 hover:to-blue-600'}
              ${followLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            {followLoading ? (
              <PopcornLoader />
            ) : isFollowing ? (
              <>
                <span>Following</span>
                <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </>
            ) : (
              'Follow'
            )}
          </button>
          {errorMessage && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs animate-pulse"
            >
              {errorMessage}
            </motion.p>
          )}
        </div>
      </div>

      {/* Movie Image */}
      <div className="relative">
        <div className="absolute inset-0  pointer-events-none" />
        {image ? (
          <>
            <img
              className={`w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500 ${imageLoading ? 'hidden' : 'block'}`}
              src={image}
              alt="Movie Scene"
              onLoad={() => setImageLoading(false)}
            />
            {imageLoading && (
              <div className="w-full h-72 sm:h-80 bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <FilmReelLoader />
                  <p className="mt-2 text-sm text-gray-400">Loading movie magic...</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-72 sm:h-80 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <Clapperboard size={48} className="mx-auto text-gray-600 mb-2" />
              <p className="text-gray-500">No movie image available</p>
            </div>
          </div>
        )}
        
        {spoiler && (
          <motion.span 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm flex items-center"
          >
            <span className="mr-1">⚠️</span> Spoiler
          </motion.span>
        )}
        <div className="absolute bottom-4 left-4 z-20">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-700 shadow-lg space-x-1"
          >
            <div className="flex">{renderStars()}</div>
            <span className="ml-2 text-sm font-medium text-white">{rating}/5</span>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 flex justify-between items-center border-b border-gray-800">
        <div className="flex gap-4">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`flex items-center gap-1 ${likeLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <motion.div
              whileTap={{ scale: 1.5 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <Heart
                size={22}
                fill={isLiked ? "currentColor" : "none"}
                className={`${isLiked ? "text-red-600 animate-pulse" : "text-gray-400 hover:text-pink-500"} transition-colors`}
              />
            </motion.div>
            <span className={`ml-1 text-sm transition-colors ${isLiked ? "text-pink-500" : "text-gray-400"}`}>
              {likeLoading ? <span className="inline-block w-4 h-4"></span> : likesCount}
            </span>
          </button>
          
          <button 
            onClick={() => {
              setShowComments(!showComments);
              if (!showComments) {
                setTimeout(() => {
                  commentInputRef.current?.focus();
                }, 300);
              }
            }}
            className="flex items-center gap-1 text-gray-400 hover:text-amber-500 transition-colors"
          >
            <MessageCircle size={22} />
            <span className="text-sm">{comments.length}</span>
          </button>
        </div>
        
        <button 
          onClick={() => setSaved(!saved)}
          className="text-gray-400 hover:text-amber-500 transition-colors"
        >
          <motion.div
            animate={{ y: saved ? [-2, 0, -2, 0] : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Bookmark
              size={22}
              fill={saved ? 'currentColor' : 'none'}
              className={saved ? 'text-amber-500' : ''}
            />
          </motion.div>
        </button>
      </div>

      {/* Review Content */}
      <div className="p-4 space-y-4">
        <div className="text-white">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{user?.username || "Anonymous"}</span>
            <span className="text-amber-500 italic">reviewed</span>
            <span className="text-white font-medium">"{movie || "this movie"}"</span>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-gray-300 text-sm leading-relaxed bg-gray-800/30 p-3 rounded-lg border border-gray-700/50 backdrop-blur-sm"
          >
            {comment || "No review content available..."}
          </motion.p>
        </div>
        
        {tags?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <motion.span 
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-white text-xs font-medium bg-cyan-900/30 px-3 py-1 rounded-full border border-cyan-500/20"
              >
                #{tag}
              </motion.span>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500">No tags added</span>
          </div>
        )}
        
        {mood && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-sm text-gray-400">Mood:</span>
            <span className="px-3 py-1 bg-cyan-900/30 rounded-full text-white text-xs font-medium border border-cyan-500/20">
              {mood}
            </span>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-800 overflow-hidden"
          >
            {/* Comments List */}
            <div className="max-h-64 md:max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {comments.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 text-center text-gray-400 text-sm flex flex-col items-center"
                >
                  <MessageCircle className="text-gray-600 mb-2" size={24} />
                  No comments yet. Be the first to comment!
                </motion.div>
              ) : (
                comments.map(comment => (
                  <Comment key={comment._id} comment={comment} />
                ))
              )}
              <div ref={commentsEndRef} />
            </div>

            {/* Comment Input */}
            <form 
              onSubmit={handleCommentSubmit}
              className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-3"
            >
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1 text-gray-400 hover:text-amber-500 transition-colors"
                >
                  <Smile size={20} />
                </button>
                
                <div className="flex-1 relative">
                  <textarea
                    ref={commentInputRef}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows="1"
                    className="w-full bg-gray-800 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 resize-none outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                    disabled={commentLoading}
                    onFocus={() => setShowEmojiPicker(false)}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!newComment.trim() || commentLoading}
                  className={`p-1 rounded-full transition-colors ${
                    newComment.trim() 
                      ? 'text-white hover:text-amber-500' 
                      : 'text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {commentLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-amber-500" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>

              {showEmojiPicker && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-14 left-0 right-0 md:left-auto md:right-2 z-10"
                >
                  <EmojiPicker
                    width="100%"
                    height={350}
                    onEmojiClick={(e) => {
                      setNewComment(prev => prev + e.emoji);
                      commentInputRef.current.focus();
                    }}
                    theme="dark"
                    searchDisabled
                    skinTonesDisabled
                    previewConfig={{ showPreview: false }}
                  />
                </motion.div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Toggle */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center justify-between w-full text-sm text-gray-400 hover:text-amber-500 transition-colors group"
        >
          <span>
            {showComments ? 'Hide comments' : `View all comments (${comments.length})`}
          </span>
          <motion.span
            animate={{ rotate: showComments ? 180 : 0 }}
            className="inline-block group-hover:text-amber-500"
          >
            ▼
          </motion.span>
        </button>
      </div>
    </div>
  );
};
 
export default ReviewCard;