import React, { useState, useRef, useCallback } from 'react';
import { Star, ImagePlus, Tag, AlertTriangle, Film, Send, Search, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoNavbar from '../components/LogoNavbar';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import Navbar from '../components/Navbar';
import MovieLoader from '../components/MovieLoader';
import toast from 'react-hot-toast';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const steps = [
    { title: 'Movie Spotlight', subtitle: 'Introduce the film' },
    { title: 'Your Critique', subtitle: 'Share your thoughts' },
    { title: 'Mood & Tags', subtitle: 'Set the vibe' },
    { title: 'Launch Review', subtitle: 'Go live' },
  ];

  const searchMovies = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setSearchLoading(false);
        return;
      }

      setSearchLoading(true);

      try {
        const response = await fetch(
          `https://imdb236.p.rapidapi.com/api/imdb/search?originalTitle=${encodeURIComponent(query)}`,
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': '11ada81770msh49c3dd7cea3fe53p178a8cjsn1e0020aab805',
              'X-RapidAPI-Host': 'imdb236.p.rapidapi.com',
            },
          }
        );

        const data = await response.json();
     
        

        if (data?.results && Array.isArray(data.results)) {
          const results = data.results.map((movie) => ({
            title: movie.originalTitle || 'Unknown Title',
            poster: movie.primaryImage || 'https://via.placeholder.com/300x450?text=No+Poster',
          }));

          setSearchResults(results);
         
        } else {
          setSearchResults([]);
      //      toast.error("🎬 No posters in the spotlight right now!", {
      //   style: {
      //     background: '#1a0b3d',
      //     color: '#f87171',
      //     border: '1px solid rgba(251, 113, 133, 0.3)',
      //     boxShadow: '0 0 15px rgba(251, 113, 133, 0.3)',
      //   },
      // });
        }
      } catch (error) {
       
        setSearchResults([]);
         
        
      } finally {
        toast.error("Failed to search movies. Please try again.", {
          style: {
            background: '#1a0b3d',
            color: '#f87171',
            border: '1px solid rgba(251, 113, 133, 0.3)',
            boxShadow: '0 0 15px rgba(251, 113, 133, 0.3)',
          },
        });
        setSearchLoading(false);
      }
    }, 500),
    []
  );

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchMovies(searchQuery);
  };

  const selectMovie = (title, poster) => {
    setMovie(title);
    setMoviePoster(poster);
    setShowSearch(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  const validateStep = () => {
    if (step === 1 && (!movie.trim() || !moviePoster)) {
      
   
       toast.error("Please provide movie title and poster", {
        style: {
          background: '#1a0b3d',
          color: '#f87171',
          border: '1px solid rgba(251, 113, 133, 0.3)',
          boxShadow: '0 0 15px rgba(251, 113, 133, 0.3)',
        },
      });
      return false;
    }
    if (step === 2 && (!rating || reviewText.length < 50)) {
     
       toast.error("Please provide rating and review (minimum 50 characters)", {
        style: {
          background: '#1a0b3d',
          color: '#f87171',
          border: '1px solid rgba(251, 113, 133, 0.3)',
          boxShadow: '0 0 15px rgba(251, 113, 133, 0.3)',
        },
      });
      return false;
    }
    if (step === 3 && tags.length < 1) {

       toast.error("Please add at least one tag", {
        style: {
          background: '#1a0b3d',
          color: '#f87171',
          border: '1px solid rgba(251, 113, 133, 0.3)',
          boxShadow: '0 0 15px rgba(251, 113, 133, 0.3)',
        },
      });
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

      const res=  await axiosInstance.post('/api/v1/reviews/reviewUpload', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      

       toast.success("🎬 Your review just hit the big screen!", {
          style: {
            background: '#1a0b3d',
            color: '#86efac', // green-400
            border: '1px solid rgba(134, 239, 172, 0.3)',
            boxShadow: '0 0 15px rgba(134, 239, 172, 0.3)',
          },
        });
      setTimeout(() => navigate('/review'), 2000);
    } catch (err) {
     
         toast.error("Failed to publish review", {
        style: {
          background: '#1a0b3d',
          color: '#f87171',
          border: '1px solid rgba(251, 113, 133, 0.3)',
          boxShadow: '0 0 15px rgba(251, 113, 133, 0.3)',
        },
      });
     
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-gradient-to-br from-[#2d0072] via-[#a40082] to-[#00b5e0] py-12 text-white flex justify-center items-center">
      {/* Animated Background */}
     
      <GlowingOrbs count={20} />

      <LogoNavbar className="z-50 relative" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
       

        {/* Form Container */}
        <motion.div
          className="w-full max-w-3xl holographic rounded-2xl p-8 shadow-2xl glow animate-fadeIn"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step Header */}
              <div className="mb-10">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-400">
                  {steps[step - 1].title}
                </h2>
                <p className="text-gray-200 mt-2 text-base">{steps[step - 1].subtitle}</p>
              </div>
            
              {/* Step Content */}
              {step === 1 && (
                <div className="space-y-8">
                  <div className="group relative">
                    <label className="block text-sm font-medium text-amber-300 mb-3">Movie Title</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={movie}
                        onChange={(e) => setMovie(e.target.value)}
                        className="w-full bg-[#1a0b3d]/50 backdrop-blur-sm rounded-xl p-4 pl-12 text-white placeholder-gray-400 
                          focus:outline-none focus:ring-2 focus:ring-amber-400/50 border border-amber-400/20 
                          group-hover:border-amber-400/50 transition-all glow"
                        placeholder="Enter movie title..."
                      />
                      <Film className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                    </div>
                  </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowSearch(!showSearch)}
                      className="mt-4 flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <Search className="w-5 h-5" />
                      {showSearch ? 'Cancel Search' : 'Search Poster'}
                    </motion.button>
               {showSearch && (
                      <>
                        <form onSubmit={handleSearchSubmit} className="mt-4 flex gap-3">
                          <input
                            type="text"
                            name="search"
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              searchMovies(e.target.value);
                            }}
                            placeholder="Search movie posters..."
                            className="flex-1 bg-[#1a0b3d]/50 backdrop-blur-sm rounded-xl p-4 text-white placeholder-gray-400 
                              focus:outline-none focus:ring-2 focus:ring-amber-400/50 border border-amber-400/20 glow"
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="submit"
                            className="px-4 py-2 font-normal  text-10 bg-gradient-to-r from-amber-400 to-pink-400 text-[#0a002a] rounded-xl glow"
                          >
                            Search
                          </motion.button>
                        </form>
                        {searchLoading && (
                          <MovieLoader />
                        )}
                        {searchResults.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                            <AnimatePresence>
                              {searchResults.map((result, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="relative cursor-pointer group"
                                  onClick={() => selectMovie(result.title, result.poster)}
                                >
                                  <img
                                    src={result.poster}
                                    alt={result.title}
                                    className="w-full h-40 object-cover rounded-lg group-hover:ring-2 group-hover:ring-amber-400 transition-all"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-[#0a002a]/70 text-gray-200 text-sm p-2 rounded-b-lg">
                                    {result.title}
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        )}
                      </>
                    )}

                  <div className="group">
                    <label className="block text-sm font-medium text-amber-300 mb-3">Movie Poster</label>
                    <div className="relative h-72 rounded-xl border-2 border-dashed border-amber-400/30 
                      hover:border-amber-400/50 transition-all overflow-hidden glow">
                      {moviePoster ? (
                        <div className="relative h-full w-full">
                          <img src={moviePoster} className="h-full w-full object-cover rounded-xl" alt="Movie poster" />
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMoviePoster(null)}
                            className="absolute top-3 right-3 bg-[#0a002a]/80 p-2 rounded-full hover:bg-[#0a002a]"
                          >
                            <X className="w-5 h-5 text-amber-400" />
                          </motion.button>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center p-6">
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            className="mb-4"
                          >
                            <ImagePlus className="w-16 h-16 text-amber-400 opacity-80" />
                          </motion.div>
                          <p className="text-center text-gray-200 group-hover:text-amber-400 transition-colors text-base">
                            Drag & drop or click to upload
                          </p>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handlePosterUpload}
                          />
                        </div>
                      )}
                    </div>
                    
                   
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-amber-300 mb-4">Your Rating</label>
                    <div className="flex gap-4">
                      {[...Array(5)].map((_, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.3, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-3 rounded-full transition-colors glow
                            ${index < rating ? 'bg-gradient-to-r from-amber-300 to-pink-400' : 'bg-[#1a0b3d]/50 hover:bg-amber-400/20'}`}
                          onClick={() => setRating(index + 1)}
                        >
                          <Star className="w-8 h-8" fill={index < rating ? '#0a002a' : 'none'} />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-300 mb-3">Review</label>
                    <div className="relative">
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        maxLength={2000}
                        className="w-full h-56 bg-[#1a0b3d]/50 backdrop-blur-sm rounded-xl p-5 text-white placeholder-gray-400 
                          focus:outline-none focus:ring-2 focus:ring-amber-400/50 border border-amber-400/20 resize-none glow"
                        placeholder="Pour your heart out..."
                      />
                      <div className="absolute bottom-4 right-4 text-gray-200 text-sm">
                        {reviewText.length}/2000
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-amber-300 mb-3">Tags</label>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <AnimatePresence>
                        {tags.map((tag, index) => (
                          <motion.div
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="bg-gradient-to-r from-amber-400/20 to-pink-400/20 px-4 py-2 rounded-full flex items-center gap-2 glow"
                          >
                            <Tag className="w-4 h-4 text-amber-400" />
                            <span className="text-amber-200 text-sm">{tag}</span>
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setTags(tags.filter((_, i) => i !== index))}
                              className="text-amber-400 hover:text-amber-300"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={handleTagAdd}
                        placeholder="Add tag & hit Enter"
                        className="w-full bg-[#1a0b3d]/50 backdrop-blur-sm rounded-xl p-4 pl-12 text-white placeholder-gray-400 
                          focus:outline-none focus:ring-2 focus:ring-amber-400/50 border border-amber-400/20 glow"
                      />
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-300 mb-3">Mood</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['😊 Happy', '😢 Sad', '🎉 Excited', '🤔 Thoughtful'].map((m) => (
                        <motion.button
                          key={m}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setMood(m)}
                          className={`p-4 rounded-xl text-left transition-colors glow
                            ${mood === m ? 'bg-gradient-to-r from-amber-400/30 to-pink-400/30 border border-amber-400' : 'bg-[#1a0b3d]/50 hover:bg-amber-400/20'}`}
                        >
                          <span className="text-lg">{m}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setContainsSpoilers(!containsSpoilers)}
                      className={`w-full p-4 rounded-xl flex items-center gap-3 transition-colors glow
                        ${containsSpoilers ? 'bg-red-500/30 border border-red-400' : 'bg-[#1a0b3d]/50 hover:bg-red-500/20'}`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                      <span className="text-base">
                        {containsSpoilers ? 'Contains Spoilers' : 'Mark as Spoiler'}
                      </span>
                    </motion.button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8">
                  <div className="holographic rounded-xl p-6 glow">
                    <h3 className="text-lg font-semibold text-amber-300 mb-4">Review Preview</h3>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        {moviePoster && (
                          <img src={moviePoster} className="w-24 h-36 object-cover rounded-lg glow" alt="Movie poster" />
                        )}
                        <div>
                          <h4 className="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-400">
                            {movie}
                          </h4>
                          <div className="flex items-center gap-2 mt-2">
                            {[...Array(rating)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-200 line-clamp-4 text-base">{reviewText}</p>
                      <div className="flex flex-wrap gap-3">
                        {tags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-gradient-to-r from-amber-400/20 to-pink-400/20 text-amber-200 px-4 py-1 rounded-full text-sm glow"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-base">
                        {mood && <span className="text-amber-300">{mood}</span>}
                        {containsSpoilers && (
                          <span className="text-red-400 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Spoiler Warning
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="mt-12 flex justify-between">
                {step > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(s => s - 1)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#1a0b3d]/50 hover:bg-amber-400/20 
                      text-amber-300 transition-colors disabled:opacity-50 glow font-normal"
                    disabled={isSubmitting}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </motion.button>
                )}
                
                <div className="flex-1" />
                
                {step < 4 ? (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-4 py-2 font-normal rounded-xl bg-gradient-to-r from-amber-400 to-pink-400 
                      text-[#0a002a] transition-colors disabled:opacity-50 glow"
                    disabled={isSubmitting}
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePublish}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-pink-400 
                      text-[#0a002a] transition-colors disabled:opacity-50 glow"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Publishing...'
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Launch Review
                      </>
                    )}
                  </motion.button>
                )}
              </div>

              {/* Error/Success Messages */}
              {/* <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-6 p-4 holographic rounded-xl border border-red-400/30 text-red-300 glow"
                  >
                    {error}
                  </motion.div>
                )}
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-6 p-4 holographic rounded-xl border border-green-400/30 text-green-300 glow"
                  >
                    {successMessage}
                  </motion.div>
                )}
              </AnimatePresence> */}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <footer className="relative z-10 py-8 text-center text-gray-200 mt-16">
          <p>© {new Date().getFullYear()} Movie Review Community. All rights reserved.</p>
        </footer>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-11 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-pink-400 shadow-2xl flex items-center justify-center z-30 glow"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#0a002a">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </motion.button>
      <Navbar/>
    </div>
  );
};

export default Post;