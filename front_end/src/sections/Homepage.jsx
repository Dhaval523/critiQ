import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaFilm, FaPenAlt, FaSearch, FaPlay, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const MOVIE_POSTERS = [
  // existing posters
  "https://image.tmdb.org/t/p/w500/4m1Au3YkjqsxF8iwQy0fPYSxE0h.jpg", // Jawan
  "https://image.tmdb.org/t/p/w500/gPbM0MK8CP8A174rmUwGsADNYKD.jpg", // Oppenheimer
  "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", // Hollywood

  "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg", // Guardians of the Galaxy Vol. 3
  "https://image.tmdb.org/t/p/w500/qnqGbB22YJ7dSs4o6M7exTpNxPz.jpg", // Ant-Man and the Wasp: Quantumania

  
];

const CritiQLogo = () => (
  <h1 className="text-3xl md:text-5xl font-extrabold text-amber-500 drop-shadow-md">
    Criti<span className="text-white">Q</span>
  </h1>
);

const CritiQOpening = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const sequence = [
      () => setStage(1), 500,
      () => setStage(2), 3000,
      () => setStage(3), 1500,
      () => setStage(4), 2000,
      () => setStage(5), 1500,
      () => {
        setStage(6);
        setTimeout(() => {
          setShowContent(true);
          onComplete?.();
        }, 1000);
      }
    ];

    let delay = 0;
    const timeouts = [];
    sequence.forEach((item) => {
      if (typeof item === 'function') {
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
        ease: "linear"
      }
    }
  };

  const posterVariants = {
    hidden: { x: "100vw", rotate: 45 },
    visible: (i) => ({
      x: 0,
      rotate: 0,
      transition: {
        delay: i * 0.3,
        type: "spring",
        stiffness: 50,
        damping: 10
      }
    })
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2 + 0.5,
        duration: 0.8
      }
    })
  };
const navigate = useNavigate();
  return (
    <div className="relative w-full md:h-screen h-auto bg-black overflow-hidden flex items-center justify-center">
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-amber-900/20 to-blue-900/10"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Grain Effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />

      {/* Loader Animation */}
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
                    left: '50%',
                    top: '50%',
                    transform: `
                      translate(-50%, -50%)
                      rotate(${i * (360 / MOVIE_POSTERS.length)}deg)
                      translateX(4rem)
                    `,
                    transformOrigin: 'center center'
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
                    opacity: [0.8, 1]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: 'mirror'
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 w-full max-w-6xl mx-auto">
        {stage >= 3 && (
          <motion.div
            className="absolute top-4 right-4 md:top-6 md:right-6 z-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
           
          </motion.div>
        )}

        {/* Logo */}
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              className="mb-6 md:mb-12 px-2"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "backOut" }}
            >
              <CritiQLogo />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posters */}
        {stage >= 4 && (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-4 mb-6 md:mb-12 px-2"
            initial="hidden"
            animate="visible"
          >
            {MOVIE_POSTERS.map((poster, i) => (
              <motion.div
                key={i}
                className="aspect-[2/3] rounded-lg md:rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow relative"
                variants={posterVariants}
                custom={i}
                whileHover={{ scale: 1.05 }}
              >
                <img src={poster} alt={`Movie ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-2">
                  <button className="w-full py-1 md:py-1.5 bg-amber-500 text-black font-bold rounded text-xs md:text-sm flex items-center justify-center">
                    <FaPlay className="mr-1 text-xs" /> Review
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Features */}
        {stage >= 5 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-12 px-2"
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: <FaStar />, text: "Rate & Review", desc: "Share your honest opinions" },
              { icon: <FaPenAlt />, text: "Write Critiques", desc: "Detailed analysis" },
              { icon: <FaFilm />, text: "Discover Films", desc: "Find new favorites" },
              { icon: <FaSearch />, text: "Follow Critics", desc: "Trusted reviewers" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="p-3 md:p-4 bg-gray-900/80 rounded-lg md:rounded-xl backdrop-blur-md border border-gray-800 hover:border-amber-400 transition-all"
                variants={featureVariants}
                custom={i}
                whileHover={{ y: -5 }}
              >
                <div className="text-amber-400 mb-2 text-xl">{feature.icon}</div>
                <h3 className="text-white font-bold text-sm md:text-base mb-1">{feature.text}</h3>
                <p className="text-gray-400 text-xs md:text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
        <div className='flex justify-center items-center p-5'>
        <button 
        onClick={()=>{
         navigate("/login")
        }}
        className="flex h-10 items-center gap-2 px-6 py-1.5 shadow-amber-200 border-s-amber-200  md:px-6 md:py-2 bg-amber-500/90 hover:bg-amber-600 text-black rounded-full transition-all text-xs md:text-sm">
              <FaUser className="text-xs md:text-sm" /> Sign In
            </button>
        </div>
         
      </div>
    </div>
  );
};

export default CritiQOpening;
