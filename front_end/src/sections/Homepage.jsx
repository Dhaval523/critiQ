

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaFilm, FaPenAlt, FaSearch, FaPlay, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MOVIE_POSTERS = [
  "https://image.tmdb.org/t/p/w500/4m1Au3YkjqsxF8iwQy0fPYSxE0h.jpg", // Jawan
  "https://image.tmdb.org/t/p/w500/gPbM0MK8CP8A174rmUwGsADNYKD.jpg", // Oppenheimer
  "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", // Hollywood
  "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg", // Guardians of the Galaxy Vol. 3
  "https://image.tmdb.org/t/p/w500/qnqGbB22YJ7dSs4o6M7exTpNxPz.jpg", // Ant-Man and the Wasp: Quantumania
];

const CritiQLogo = () => (
  <h1 className="text-3xl md:text-5xl font-extrabold text-amber-500 drop-shadow-lg">
    Criti<span className="text-white">Q</span>
  </h1>
);

const CritiQOpening = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sequence = [
      () => setStage(1), 500,
      () => setStage(2), 1000,
      () => setStage(3), 100,
      () => setStage(4), 1000,
      () => setStage(5), 800,
      () => {
        setStage(6);
      
          setShowContent(true);
          onComplete?.();
        
      },
    ];

    let delay = 0;
    const timeouts = [];
    sequence.forEach((item) => {
      if (typeof item === "function") {
        const timeout = setTimeout(item, delay);
        timeouts.push(timeout);
      } else {
        delay += item;
      }
    });

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  const cameraLoaderVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const posterVariants = {
    hidden: { opacity: 0, y: 50, rotate: 5 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        delay: i * 0.2,
        type: "spring",
        stiffness: 80,
        damping: 12,
      },
    }),
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.3 + 0.5,
        duration: 0.7,
        ease: "easeOut",
      },
    }),
  };

  const heroVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#2d0072] via-[#a40082] to-[#00b5e0] text-white overflow-hidden flex flex-col">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2d0072]/70 z-0 pointer-events-none"></div>

      {/* Grain Effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-30 pointer-events-none" />

      {/* Loader Animation (Unchanged) */}
      <AnimatePresence>
        {stage === 2 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-amber-500"
              variants={cameraLoaderVariants}
              initial="initial"
              animate="animate"
            >
              {MOVIE_POSTERS.map((poster, i) => (
                <div
                  key={i}
                  className="absolute w-10 h-10 md:w-16 md:h-16 overflow-hidden"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `
                      translate(-50%, -50%)
                      rotate(${i * (360 / MOVIE_POSTERS.length)}deg)
                      translateX(4rem)
                    `,
                    transformOrigin: "center center",
                  }}
                >
                  <img src={poster} alt="" className="w-full h-full object-cover rounded-sm" />
                </div>
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-6 h-6 md:w-8 md:h-8 bg-red-600 rounded-full"
                  animate={{
                    scale: [1, 1.2],
                    opacity: [0.8, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {showContent && (
        <div className="relative z-10 flex flex-col flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.header
            className="flex items-center justify-between py-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CritiQLogo />
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500/90 hover:bg-amber-600 text-black font-semibold rounded-full transition-all text-sm"
              >
                <FaUser className="text-sm" /> Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 px-4 py-2 bg-transparent border border-amber-500 hover:bg-amber-500/20 text-white font-semibold rounded-full transition-all text-sm"
              >
                Sign Up
              </button>
            </div>
          </motion.header>

          {/* Hero Section */}
          <motion.section
            className="flex flex-col items-center text-center py-12 md:py-20"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-700 mb-4">
              Welcome to CritiQ
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
              Share your movie reviews, discover new films, and connect with fellow cinephiles on a platform built for movie lovers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/review")}
                className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-full transition-all text-base"
              >
                <FaPlay className="text-sm" /> Explore Reviews
              </button>
              <button
                onClick={() => navigate("/about")}
                className="flex items-center gap-2 px-6 py-3 bg-transparent border border-amber-500 hover:bg-amber-500/20 text-white font-semibold rounded-full transition-all text-base"
              >
                Learn More
              </button>
            </div>
          </motion.section>

          {/* Movie Posters Section */}
          {stage >= 4 && (
            <motion.section
              className="py-12"
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-2xl md:text-3xl font-semibold text-white text-center mb-8">
                Trending Movies
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {MOVIE_POSTERS.map((poster, i) => (
                  <motion.div
                    key={i}
                    className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg hover:shadow-amber-500/50 transition-all"
                    variants={posterVariants}
                    custom={i}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={poster} alt={`Movie ${i + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-3">
                      <button
                        onClick={() => navigate("/review")} // Adjust route as needed
                        className="w-full py-2 bg-amber-500 text-black font-semibold rounded text-sm flex items-center justify-center"
                      >
                        <FaPlay className="mr-2 text-xs" /> Review
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Features Section */}
          {stage >= 5 && (
            <motion.section
              className="py-12"
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-2xl md:text-3xl font-semibold text-white text-center mb-8">
                Why CritiQ?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: <FaStar className="w-6 h-6 text-amber-500" />, text: "Rate & Review", desc: "Share your honest opinions on your favorite films." },
                  { icon: <FaPenAlt className="w-6 h-6 text-amber-500" />, text: "Write Critiques", desc: "Dive deep with detailed analyses and insights." },
                  { icon: <FaFilm className="w-6 h-6 text-amber-500" />, text: "Discover Films", desc: "Find new movies tailored to your taste." },
                  { icon: <FaSearch className="w-6 h-6 text-amber-500" />, text: "Follow Critics", desc: "Connect with trusted reviewers and communities." },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    className="p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:border-amber-500/50 transition-all"
                    variants={featureVariants}
                    custom={i}
                    whileHover={{ y: -5 }}
                  >
                    <div className="mb-4">{feature.icon}</div>
                    <h4 className="text-lg font-semibold text-white mb-2">{feature.text}</h4>
                    <p className="text-sm text-gray-300">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Footer */}
          <footer className="mt-auto py-8 text-center text-gray-300">
            <p>© {new Date().getFullYear()} CritiQ. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-4">
              <a href="/about" className="text-amber-500 hover:text-amber-400 text-sm">About</a>
             
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default CritiQOpening;