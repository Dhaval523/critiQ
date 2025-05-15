import React, { useState } from 'react';
import { Star, ImagePlus, Tag, AlertTriangle, Film, Send, Search, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Post = () => {
  const [step, setStep] = useState(1);
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const steps = [
    { title: "Movie Information", subtitle: "Let's start with the basics" },
    { title: "Review Details", subtitle: "Share your thoughts" },
    { title: "Tags & Mood", subtitle: "Add context to your review" },
    { title: "Publish", subtitle: "Final checks before sharing" }
  ];

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handlePosterUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setMoviePoster(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSearchPoster = (e) => {
    e.preventDefault();
    const posterUrl = `https://source.unsplash.com/400x600/?movie,${e.target.search.value}`;
    setMoviePoster(posterUrl);
    setShowSearch(false);
  };

  const validateStep = () => {
    if (step === 1 && (!movie.trim() || !moviePoster)) {
      setError('Please provide movie title and poster');
      return false;
    }
    if (step === 2 && (!rating || reviewText.length < 50)) {
      setError('Please provide rating and review (minimum 50 characters)');
      return false;
    }
    if (step === 3 && tags.length < 1) {
      setError('Please add at least one tag');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (!validateStep()) return;
    setError('');
    setStep(s => Math.min(s + 1, 4));
  };

  const handlePublish = async () => {
    try {
      setIsSubmitting(true);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('Authentication required');

      const formData = new FormData();
      formData.append('movie', movie);
      formData.append('rating', rating);
      formData.append('comment', reviewText);
      formData.append('mood', mood);
      formData.append('tags', JSON.stringify(tags));
      formData.append('spoiler', containsSpoilers);

      if (moviePoster) {
        const blob = await fetch(moviePoster).then(res => res.blob());
        formData.append('image', blob, 'poster.jpg');
      }

      await axiosInstance.post('/api/v1/reviews/reviewUpload', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      setSuccessMessage('Review published successfully!');
      setTimeout(() => navigate('/review'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-4 md:pt-8 pb-20 px-2 md:px-4 relative">
      {/* Progress Indicator */}
      <div className="w-full max-w-4xl mb-8 md:mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-amber-500/50 -translate-y-1/2 z-0" />
          {steps.map((_, index) => (
            <div key={index} className="relative z-10 flex-1 flex justify-center">
              <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all 
                ${step > index + 1 ? 'bg-amber-500' : 'bg-amber-900'} 
                ${step === index + 1 ? 'ring-4 ring-amber-500/30' : ''}`}>
                {step > index + 1 ? (
                  <Check className="w-3 h-3 md:w-4 md:h-4 text-black" />
                ) : (
                  <span className={`text-sm md:text-base font-medium ${step === index + 1 ? 'text-amber-500' : 'text-amber-600'}`}>
                    {index + 1}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-3xl bg-gray-900/80 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-8 shadow-2xl border border-amber-500/30">
        <AnimatePresence mode='wait'>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: step > 4 ? 0 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step Header */}
            <div className="mb-6 md:mb-10">
              <h2 className="text-lg md:text-2xl font-bold text-amber-500">{steps[step - 1].title}</h2>
              <p className="text-gray-400 mt-1 md:mt-2 text-sm md:text-base">{steps[step - 1].subtitle}</p>
            </div>

            {/* Step Content */}
            {step === 1 && (
              <div className="space-y-6 md:space-y-8">
                <div className="group relative">
                  <label className="block text-sm font-medium text-amber-500 mb-2 md:mb-3">Movie Title</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={movie}
                      onChange={(e) => setMovie(e.target.value)}
                      className="w-full bg-gray-800/50 rounded-lg md:rounded-xl p-3 md:p-4 pl-10 md:pl-12 text-sm md:text-base text-white placeholder-gray-500 
                        focus:outline-none focus:ring-2 focus:ring-amber-500 border border-transparent 
                        group-hover:border-amber-500/30 transition-all"
                      placeholder="Inception, The Dark Knight..."
                    />
                    <Film className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-amber-500 mb-2 md:mb-3">Movie Poster</label>
                  <div className="relative h-48 md:h-64 rounded-lg md:rounded-xl border-2 border-dashed border-amber-500/50 
                    hover:border-amber-500/30 transition-all overflow-hidden">
                    {moviePoster ? (
                      <div className="relative h-full w-full">
                        <img src={moviePoster} className="h-full w-full object-cover" alt="Movie poster" />
                        <button
                          onClick={() => setMoviePoster(null)}
                          className="absolute top-2 right-2 md:top-3 md:right-3 bg-gray-900/80 p-1 md:p-1.5 rounded-full 
                            hover:bg-gray-900 transition-all"
                        >
                          <X className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-4 md:p-6">
                        <ImagePlus className="w-8 h-8 md:w-12 md:h-12 text-amber-500 mb-2 md:mb-4 opacity-60" />
                        <p className="text-center text-gray-400 group-hover:text-amber-500 transition-colors text-sm md:text-base">
                          Drag & drop or click to upload poster
                        </p>
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handlePosterUpload}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className="mt-3 md:mt-4 flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors text-sm md:text-base"
                  >
                    <Search className="w-3 h-3 md:w-4 md:h-4" />
                    {showSearch ? 'Cancel Search' : 'Search for Poster'}
                  </button>
                  {showSearch && (
                    <form onSubmit={handleSearchPoster} className="mt-3 md:mt-4 flex gap-2">
                      <input
                        type="text"
                        name="search"
                        placeholder="Search movie posters..."
                        className="flex-1 bg-gray-800/50 rounded-lg md:rounded-xl p-2 md:p-3 text-sm md:text-base text-white placeholder-gray-500 
                          focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="submit"
                        className="px-3 md:px-4 py-1.5 md:py-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg md:rounded-xl 
                          text-amber-400 transition-colors text-sm md:text-base"
                      >
                        Search
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 md:space-y-8">
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-3 md:mb-4">Your Rating</label>
                  <div className="flex gap-2 flex-wrap">
                    {[...Array(5)].map((_, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-lg transition-colors ${index < rating ? 'bg-amber-500' : 'bg-gray-700 hover:bg-amber-500/30'}`}
                        onClick={() => setRating(index + 1)}
                      >
                        <Star className="w-5 h-5 md:w-7 md:h-7" fill={index < rating ? 'currentColor' : 'none'} />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-3">Review</label>
                  <div className="relative">
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      maxLength={2000}
                      className="w-full h-40 md:h-48 bg-gray-800/50 rounded-xl p-4 text-sm md:text-base text-white placeholder-gray-500 
                        focus:outline-none focus:ring-2 focus:ring-amber-500 border border-transparent 
                        resize-none"
                      placeholder="Share your detailed thoughts about the movie..."
                    />
                    <div className="absolute bottom-4 right-4 text-gray-400 text-xs md:text-sm">
                      {reviewText.length}/2000
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 md:space-y-8">
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-3">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-amber-500/10 px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-2"
                      >
                        <Tag className="w-3 h-3 md:w-4 md:h-4 text-amber-500" />
                        <span className="text-amber-300 text-xs md:text-sm">{tag}</span>
                        <button
                          onClick={() => setTags(tags.filter((_, i) => i !== index))}
                          className="text-amber-500 hover:text-amber-400"
                        >
                          <X className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={handleTagAdd}
                      placeholder="Add tag and press Enter"
                      className="w-full bg-gray-800/50 rounded-xl p-3 md:p-4 pl-10 md:pl-12 text-sm md:text-base text-white placeholder-gray-500 
                        focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <Tag className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-3">Mood</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['😊 Happy', '😢 Sad', '🎉 Excited', '🤔 Thoughtful'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMood(m)}
                        className={`p-3 rounded-xl text-left transition-colors ${
                          mood === m ? 'bg-amber-500/20 border border-amber-500' : 'bg-gray-700/50 hover:bg-amber-500/10'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => setContainsSpoilers(!containsSpoilers)}
                    className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors ${
                      containsSpoilers ? 'bg-red-500/20 border border-red-500' : 'bg-gray-700/50 hover:bg-red-500/10'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">
                      {containsSpoilers ? 'Contains Spoilers' : 'Mark as Spoiler'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 md:space-y-8">
                <div className="bg-gray-800/50 rounded-xl p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold text-amber-500 mb-3 md:mb-4">Preview</h3>
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      {moviePoster && (
                        <img src={moviePoster} className="w-16 h-20 md:w-20 md:h-28 object-cover rounded-lg" alt="Movie poster" />
                      )}
                      <div>
                        <h4 className="text-lg md:text-xl font-medium text-amber-300">{movie}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {[...Array(rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-amber-500 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 line-clamp-3 text-sm md:text-base">{reviewText}</p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, i) => (
                        <span key={i} className="bg-amber-500/10 text-amber-300 px-2 py-1 rounded-full text-xs md:text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs md:text-sm">
                      {mood && <span className="text-amber-300">{mood}</span>}
                      {containsSpoilers && (
                        <span className="text-red-400 flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3 md:w-4 md:h-4" />
                          Spoiler Warning
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="mt-8 md:mt-12 flex justify-between">
              {step > 1 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl bg-amber-500/30 hover:bg-amber-500/50 
                    text-amber-300 transition-colors disabled:opacity-50 text-sm md:text-base"
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                  Previous
                </button>
              )}
              
              <div className="flex-1" />
              
              {step < 4 ? (
                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl bg-amber-500/10 hover:bg-amber-500/20 
                    text-amber-300 transition-colors disabled:opacity-50 text-sm md:text-base"
                  disabled={isSubmitting}
                >
                  Next
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl bg-amber-500/10 hover:bg-amber-500/20 
                    text-amber-300 transition-colors disabled:opacity-50 text-sm md:text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Publishing...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 md:w-5 md:h-5" />
                      Publish Review
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 md:mt-6 p-3 md:p-4 bg-red-900/30 backdrop-blur-lg rounded-lg md:rounded-xl border border-red-400/20 text-red-300 text-sm md:text-base"
              >
                {error}
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 md:mt-6 p-3 md:p-4 bg-green-900/30 backdrop-blur-lg rounded-lg md:rounded-xl border border-green-400/20 text-green-300 text-sm md:text-base"
              >
                {successMessage}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <Navbar />
    </div>
  );
};

export default Post;