
import React, { useState, useEffect, useRef } from 'react';
import { Share, MessageCircle, Heart, Star, Bookmark, Send, Smile, X, MoreHorizontal, Film, Clapperboard, Popcorn } from 'lucide-react';
import io from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import axiosInstance from '../api/axiosInstance';
import dayjs from 'dayjs';

const FilmReelLoader = () => (
  <div className="flex items-center justify-center space-x-1">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="text-yellow-400"
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

const Comment = ({ comment, onDelete, currentUserId }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
    className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors relative group"
  >
    <div className="relative flex-shrink-0">
      {comment.user?.avatar ? (
        <img
          className="w-8 h-8 rounded-full object-cover border border-gray-600"
          src={comment.user.avatar}
          alt={`${comment.user.username}'s avatar`}
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
          <Clapperboard size={16} className="text-gray-400" />
        </div>
      )}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="font-normal text-sm text-gray-200">{comment.user?.username || 'User'}</span>
        <span className="text-xs text-gray-500">{moment(comment.createdAt).fromNow()}</span>
      </div>
      <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
    </div>
    {comment.user?._id === currentUserId && (
      <button
        onClick={() => onDelete(comment._id)}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Delete comment"
      >
        <X size={16} />
      </button>
    )}
  </motion.div>
);

const ReviewCard = ({
  image,
  rating,
  comment,
  tags,
  mood,
  spoiler,
  user,
  movie,
  _id,
  likes = [],
  createdAt
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
  const [commentCount, setCommentCount] = useState(0);
  const [commentLoading, setCommentLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);


  const commentsEndRef = useRef(null);
  const commentInputRef = useRef(null);
  const [socket, setSocket] = useState(null);

  const accessToken = localStorage.getItem("accessToken");
  const currentUserId = localStorage.getItem("userId");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  // Scroll to the latest comment
  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Socket.io initialization
  useEffect(() => {
    const socketInstance = io('https://critiq-backend.onrender.com', {
      auth: { token: accessToken }
    });
    setSocket(socketInstance);

    return () => socketInstance.disconnect();
  }, [accessToken]);

  const handleLikeToggle = () => {
    setIsLiked((prev) => !prev)

  }

  // Real-time comment handling
  useEffect(() => {
    if (!socket) return;

    socket.on('new-comment', (comment) => {
    
      if (comment?.post === _id) {
        setComments(prev => {
          if (!prev.some(c => c._id === comment._id)) {
            const updatedComments = [...prev, comment];
            setCommentCount(prevCount => prevCount + 1); // Increment comment count
            setTimeout(scrollToBottom, 100);
            return updatedComments;
          }
          return prev;
        });
      }
    });

    socket.on('comment-deleted', (deletedCommentId) => {
   
      setComments(prev => {
        const updatedComments = prev.filter(c => c._id !== deletedCommentId);
        setCommentCount(updatedComments.length); // Update comment count
        return updatedComments;
      });
    });

    return () => {
      socket.off('new-comment');
      socket.off('comment-deleted');
    };
  }, [socket, _id]);

  // Fetch like, follow status, and initial comment count
  useEffect(() => {
    if (!_id || !user?._id) return;

    const fetchStatus = async () => {
      try {
        const isLikeResponse = await axiosInstance.post(
          '/api/v1/notification/isLike',
          { postId: _id },
          axiosConfig
        );
        setIsLiked(isLikeResponse.data.data.isLiked);
        setLikesCount(isLikeResponse.data.data.count);

        const isFollowResponse = await axiosInstance.post(
          '/api/v1/users/checkFollow',
          { followedId: user._id },
          axiosConfig
        );
        setIsFollowing(isFollowResponse.data.data.isFollowing);

        const commentResponse = await axiosInstance.get('/api/v1/comment/getcomment', {
          params: { postId: _id },
          ...axiosConfig,
        });
        setCommentCount(commentResponse.data.data.length);
      } catch (error) {
      
        setErrorMessage('Failed to load status. Please try again.');
      }
    };

    fetchStatus();
  }, [_id, user?._id, accessToken, isLiked]);

  // Fetch comments when showComments is toggled
  useEffect(() => {
    if (!showComments || !_id) {
      setComments([]); // Clear comments when hiding
      return;
    }

    const fetchComments = async () => {
      try {
        setCommentLoading(true);
        const response = await axiosInstance.get('/api/v1/comment/getcomment', {
          params: { postId: _id },
          ...axiosConfig,
        });
       
        setComments(response.data.data || []);
        setCommentCount(response.data.data.length); // Update comment count
        setTimeout(scrollToBottom, 100);
      } catch (error) {
      
        setErrorMessage('Failed to load comments. Please try again.');
      } finally {
        setCommentLoading(false);
      }
    };

    fetchComments();
  }, [showComments, _id, accessToken]);

  const handleFollow = async () => {
    try {
      setFollowLoading(true);
      const response = await axiosInstance.post(
        '/api/v1/users/followerAndFollowing',
        { followedId: user._id },
        axiosConfig
      );
      setIsFollowing(response.data.data.isFollowing);
    } catch (error) {
    
      setErrorMessage('Failed to follow user. Please try again.');
    } finally {
      setFollowLoading(false);
    }
  };
  
    const handleLike = async () => {
      try {
        setLikeLoading(true);
        const response = await axiosInstance.post(
          '/api/v1/notification/likeNotification',
          { postId: _id },
          axiosConfig
        );
        setLikesCount(response.data.data.like);
        setIsLiked(response.data.data.isLiked);
      } catch (error) {
      
        setErrorMessage('Failed to like the post. Please try again.');
      } finally {
        setLikeLoading(false);
      }
    };

    

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const response = await axiosInstance.post(
        '/api/v1/comment/createComment',
        { postId: _id, content: newComment },
        axiosConfig
      );
     
      socket.emit('new-comment', response.data.data);
      setNewComment('');
      setCommentCount(prevCount => prevCount + 1); // Increment comment count
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      
      setErrorMessage('Failed to post comment. Please try again.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await axiosInstance.delete('/api/v1/comment/deleteComment', {
        data: { commentId },
        ...axiosConfig,
      });
      socket.emit('comment-deleted', commentId);
      setCommentCount(prevCount => prevCount - 1); // Decrement comment count
    } catch (error) {
     
      setErrorMessage('Failed to delete comment. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 rounded-xl overflow-hidden shadow-lg">
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-2 text-red-500 text-sm text-center"
        >
          {errorMessage}
        </motion.div>
      )}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            {user?.avatar ? (
              <>
                <img
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                  src={user.avatar}
                  alt="User Avatar"
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-full">
                    <FilmReelLoader />
                  </div>
                )}
              </>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700">
                <Clapperboard size={20} className="text-gray-400" />
              </div>
            )}
          </div>
          <h2 className="text-base font-semibold text-white">{user?.username || "Movie Buff"}</h2>
        </div>
        <button
          onClick={handleFollow}
          disabled={followLoading}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-200 border border-gray-500 text-white
            ${followLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'}`}
        >
          {followLoading ? (
            <PopcornLoader />
          ) : isFollowing ? (
            'Following'
          ) : (
            'Follow'
          )}
        </button>
      </div>

      <div className="relative">
        {image ? (
          <>
            <img
              className={`w-full h-96 object-cover ${imageLoading ? 'hidden' : 'block'}`}
              src={image}
              alt="Movie Scene"
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
            {imageLoading && (
              <div className="w-full h-96 bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <FilmReelLoader />
                  <p className="mt-2 text-sm text-gray-400">Loading movie magic...</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-96 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <Clapperboard size={48} className="mx-auto text-gray-600 mb-2" />
              <p className="text-gray-500">No movie image available</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center px-4 py-3">
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
                className={`transition-colors ${isLiked ? "text-red-600" : "text-gray-400"}`}
                onClick={handleLikeToggle}
              />
            </motion.div>
            <span className="text-sm text-gray-400">{likesCount}</span>
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
            className="flex items-center gap-1 text-gray-400 transition-colors"
          >
            <MessageCircle size={22} />
            <span className="text-sm">{commentCount}</span>
          </button>

          {/* <button className="flex items-center gap-1 text-gray-400 transition-colors">
            <Share size={22} />
          </button> */}
        </div>

        <button
          onClick={() => setSaved(!saved)}
          className="text-gray-400 transition-colors"
        >
          <motion.div
            animate={{ y: saved ? [-2, 0, -2, 0] : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Bookmark
              size={22}
              fill={saved ? 'currentColor' : 'none'}
              className={saved ? 'text-gray-400' : ''}
            />
          </motion.div>
        </button>
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-white">{movie || "Movie Title"}</h3>
          {spoiler && (
            <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-red-600 rounded-full">
              Spoiler
            </span>
          )}
        </div>
        {rating && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < rating ? 'currentColor' : 'none'}
                className={i < rating ? 'text-yellow-400' : 'text-gray-400'}
              />
            ))}
            <span className="ml-2 text-sm text-gray-400">{rating}/5</span>
          </div>
        )}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-1 text-gray-300 text-sm"
        >
          {comment || "No review content available..."}
        </motion.p>

        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-blue-400 text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      <div className='text-neutral-500 font-normal text-sm'>{dayjs(createdAt).format("MMMM D, YYYY h:mm A")}</div>
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
            <div className="max-h-64 md:max-h-80 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {commentLoading ? (
                <div className="p-4 text-center">
                  <FilmReelLoader />
                  <p className="mt-2 text-sm text-gray-400">Loading comments...</p>
                </div>
              ) : comments.length === 0 ? (
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
                  <Comment
                    key={comment._id}
                    comment={comment}
                    onDelete={handleDeleteComment}
                    currentUserId={currentUserId}
                  />
                ))
              )}
              <div ref={commentsEndRef} />
            </div>

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
                    maxLength={500}
                    className="w-full bg-gray-800 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 resize-none outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                    disabled={commentLoading}
                    onFocus={() => setShowEmojiPicker(false)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!newComment.trim() || commentLoading}
                  className={`p-1 rounded-full transition-colors ${newComment.trim() && !commentLoading
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

      <div className="p-3 border-t border-gray-800">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center justify-between w-full text-sm text-gray-400 hover:text-amber-500 transition-colors group"
        >
          <span>
            {showComments ? 'Hide comments' : `View all comments (${commentCount})`}
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
