import React, { useState } from 'react';
import { Star, ImagePlus, Tag, AlertTriangle, Film, Send, Search, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Post = () => {
  const [reviewText, setReviewText] = useState('');
  const [movie, setMovie] = useState('');
  const [rating, setRating] = useState(0);
  const [moviePoster, setMoviePoster] = useState(null);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [mood, setMood] = useState('');
  const [containsSpoilers, setContainsSpoilers] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Add tags on pressing Enter
  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  // Handle movie poster upload
  const handlePosterUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMoviePoster(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Search for a movie poster
  const handleSearchPoster = (e) => {
    e.preventDefault();
    const posterUrl = `https://source.unsplash.com/400x600/?movie,${e.target.search.value}`;
    setMoviePoster(posterUrl);
    setShowSearch(false);
  };

  // Publish the review
  const handlePublish = async (e) => {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found. Please log in again.');
      }

      const reviewData = new FormData();
      reviewData.append('rating', rating);
      reviewData.append('comment', reviewText);
      reviewData.append('mood', mood);
      reviewData.append('tags', JSON.stringify(tags));
      reviewData.append('spoiler', containsSpoilers);
      reviewData.append('movie', movie);

      if (moviePoster) {
        const file = await fetch(moviePoster).then((res) => res.blob());
        reviewData.append('image', file, 'movie-poster.jpg');
      }

      const res = await axios.post(
        'http://localhost:5300/api/v1/reviews/reviewUpload',
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Review created:', res.data);
      setSuccessMessage('Review published successfully!');
      setTimeout(() => navigate('/review'), 2000);
    } catch (error) {
      console.error('Error publishing review:', error);
      setError(error.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 py-12 flex justify-center text-white">
      <div className="w-full max-w-3xl bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-800">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b border-cyan-500/30 pb-6">
          <Film className="w-8 h-8 text-cyan-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Create New Review
          </h1>
        </div>

        {/* Movie Name Input */}
        <div className="mb-8">
          <label className="block text-lg font-semibold mb-4">Movie Name</label>
          <input
            type="text"
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            placeholder="Enter movie name..."
            className="w-full bg-gray-800/50 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Movie Poster Section */}
        <div className="mb-8">
          <label className="block text-lg font-semibold mb-4">Movie Poster</label>
          <div className="group relative h-64 w-full rounded-2xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 transition-all">
            {moviePoster ? (
              <div className="relative w-full h-full">
                <img
                  src={moviePoster}
                  alt="Movie Poster"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <button
                  onClick={() => setMoviePoster(null)}
                  className="absolute top-2 right-2 bg-gray-900/80 p-2 rounded-full hover:bg-gray-900"
                >
                  <X className="w-5 h-5 text-red-400" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <ImagePlus className="w-12 h-12 text-cyan-400 mb-4" />
                <p className="text-gray-400 group-hover:text-cyan-300">
                  Click to upload movie poster
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePosterUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {/* Poster Search Option */}
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="bg-cyan-400/10 hover:bg-cyan-400/20 px-4 py-2 rounded-lg flex items-center gap-2 text-cyan-300"
            >
              <Search className="w-5 h-5" />
              Search Poster
            </button>
          </div>

          {/* Search Modal */}
          {showSearch && (
            <div className="mt-4">
              <form onSubmit={handleSearchPoster} className="flex gap-2">
                <input
                  type="text"
                  name="search"
                  placeholder="Search for a movie..."
                  className="flex-1 bg-gray-800/50 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <button
                  type="submit"
                  className="bg-cyan-400/10 hover:bg-cyan-400/20 px-4 py-2 rounded-lg flex items-center gap-2 text-cyan-300"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Rating Stars */}
        <div className="mb-8">
          <label className="block text-lg font-semibold mb-4">Your Rating</label>
          <div className="flex gap-2">
            {[...Array(5)].map((_, index) => (
              <button
                key={index}
                onClick={() => setRating(index + 1)}
                className={`p-2 rounded-lg transition-all ${index < rating ? 'bg-cyan-400' : 'bg-gray-700 hover:bg-cyan-500/30'
                  }`}
              >
                <Star className="w-6 h-6" fill={index < rating ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div className="mb-8">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review..."
            className="w-full h-48 bg-gray-800/50 rounded-xl p-6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
          />
          <div className="flex justify-end mt-2 text-gray-400">
            {reviewText.length}/2000 characters
          </div>
        </div>

        {/* Tags Input */}
        <div className="mb-8">
          <label className="block text-lg font-semibold mb-4">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-cyan-400/10 text-cyan-300 px-3 py-1 rounded-full flex items-center gap-2"
              >
                <Tag className="w-4 h-4" />
                {tag}
              </span>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagAdd}
              placeholder="Add tags (press Enter)"
              className="w-full bg-gray-800/50 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <Tag className="absolute right-4 top-4 text-gray-400" />
          </div>
        </div>

        {/* Mood & Spoilers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-lg font-semibold mb-4">Mood</label>
            <div className="grid grid-cols-3 gap-2">
              {['😊 Happy', '😢 Sad', '😱 Thrilled'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`p-3 rounded-xl flex items-center justify-center gap-2 ${mood === m
                      ? 'bg-cyan-400/20 border border-cyan-400'
                      : 'bg-gray-700/50 hover:bg-cyan-400/10'
                    }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold mb-4">Contains Spoilers</label>
            <button
              onClick={() => setContainsSpoilers(!containsSpoilers)}
              className={`w-full p-3 rounded-xl flex items-center justify-center gap-2 ${containsSpoilers
                  ? 'bg-red-400/20 border border-red-400'
                  : 'bg-gray-700/50 hover:bg-red-400/10'
                }`}
            >
              <AlertTriangle className="w-5 h-5" />
              {containsSpoilers ? 'Spoiler Warning Added' : 'Mark as Spoiler'}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          className="w-full bg-cyan-400/20 hover:bg-cyan-400/30 py-4 rounded-xl text-cyan-300 hover:text-cyan-200 font-semibold flex items-center justify-center gap-2 transition-all"
          onClick={handlePublish}
        >
          <Send className="w-5 h-5" />
          Publish Review
        </button>

        {/* Success Message */}
        {successMessage && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-center">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
            {error}
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default Post;