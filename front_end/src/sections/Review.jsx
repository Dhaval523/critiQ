

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReviewCard from "../components/ReviewCard";
import Navbar from "../components/Navbar";
import LogoNavbar from "../components/LogoNavbar.jsx";
import toast from "react-hot-toast";
import MovieLoader from "../components/MovieLoader";

// Enhanced floating particles with different colors and shapes
const FloatingParticles = ({ count = 35 }) => {
  const particles = Array.from({ length: count });

  return particles.map((_, i) => {
    const size = Math.random() * 10 + 4;
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * 5;
    const colors = ["#ff4081", "#00bcd4", "#ff9800", "#e91e63", "#03a9f4"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const isSquare = Math.random() > 0.7;
    const rotation = Math.random() * 360;

    return (
      <motion.div
        key={i}
        className="absolute opacity-20 blur-[2px]"
        style={{
          width: size,
          height: size,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          background: color,
          borderRadius: isSquare ? "4px" : "50%",
          transform: `rotate(${rotation}deg)`,
        }}
        animate={{
          y: [0, -100, -200, -100, 0],
          x: [0, 50, 100, 50, 0],
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.2, 1],
          rotate: [rotation, rotation + 180, rotation + 360],
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  });
};

const Review = () => {
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("https://critiq-3.onrender.com/api/v1/reviews/getReviews");
        if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`);
        const data = await res.json();
       
        setReviewsData(Array.isArray(data) ? data : []);
        setLoading (false);
      } catch (error) {
  
       
         toast.error("Unable to load reviews. Please try again.", {
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

    fetchReviews();
  }, []);

  // Filter and sort reviews
  const filteredReviews = reviewsData
    .filter((review) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "spoiler" && review.spoiler) ||
        (filter === "popular" && (review.likesCount || 0) > 10);

      const movieName = typeof review.movie === "string" ? review.movie.toLowerCase() : "";
      const searchLower = searchQuery.toLowerCase();
      const tags = Array.isArray(review.tags) ? review.tags : [];
      const matchesSearch =
        movieName.includes(searchLower) ||
        tags.some((tag) => typeof tag === "string" && tag.toLowerCase().includes(searchLower));

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (sort === "highest") {
        return (b.rating || 0) - (a.rating || 0);
      } else {
        return (b.likesCount || 0) - (a.likesCount || 0);
      }
    });

  const renderState = (text) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#2d0072] via-[#a40082] to-[#00b5e0] relative overflow-hidden">
      <FloatingParticles />
      <div className="text-white text-xl font-medium z-10 mb-4">{text}</div>
      {error && (
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/30 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );

  if (loading) return <MovieLoader />;
  if (error) return renderState(`Error: ${error}`);
  if (!reviewsData.length) return renderState("No reviews found.");

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#2d0072] via-[#a40082] to-[#00b5e0] text-white">
      <LogoNavbar />
      <Navbar className="z-50 relative" />
      <FloatingParticles count={45} />

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent to-[#2d0072]/70 z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Header with filters */}
        <div className="mb-12 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies or tags..."
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder-gray-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === "all" ? "bg-amber-500 text-gray-900" : "bg-white/10 backdrop-blur-sm hover:bg-white/20"
              }`}
            >
              All Reviews
            </button>
            <button
              onClick={() => setFilter("popular")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === "popular" ? "bg-amber-500 text-gray-900" : "bg-white/10 backdrop-blur-sm hover:bg-white/20"
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => setFilter("spoiler")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === "spoiler" ? "bg-amber-500 text-gray-900" : "bg-white/10 backdrop-blur-sm hover:bg-white/20"
              }`}
            >
              Spoilers
            </button>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-gray-900 text-white border border-white/20 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50 appearance-none"
            >
              <option className="bg-gray-900 text-white" value="newest">
                Newest First
              </option>
              <option className="bg-gray-900 text-white" value="highest">
                Highest Rated
              </option>
              <option className="bg-gray-900 text-white" value="popular">
                Most Liked
              </option>
            </select>
          </div>
        </div>

        {/* Reviews grid */}
        <AnimatePresence>
          {filteredReviews.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredReviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    type: "spring",    
                    damping: 15,
                  }}
                  className="relative"
                >
                  {/* Decorative element */}
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center z-0 opacity-20"></div>

                  <ReviewCard
                    _id={review._id}
                    image={review.image}
                    rating={review.rating}
                    comment={review.comment}
                    tags={review.tags}
                    mood={review.mood}
                    spoiler={review.spoiler}
                    movie={review.movie}
                    user={review.user}
                    createdAt={review.createdAt}
                    likesCount={review.likesCount}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-3xl mb-4">🎬</div>
              <h3 className="text-xl md:text-2xl font-semibold mb-4">No reviews found</h3>
              <p className="text-gray-300 max-w-md mx-auto">
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => {
                  setFilter("all");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-3 bg-white/10 backdrop-blur-sm border hover:bg-white/20 rounded-lg transition-colors duration-300 text-white font-medium"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating action button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-11 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg flex items-center justify-center z-30"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </motion.button>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-gray-400 mt-16">
        <p>© {new Date().getFullYear()} critiQ. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Review;