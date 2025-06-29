import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MOVIE_POSTERS = [
  "https://image.tmdb.org/t/p/w500/4m1Au3YkjqsxF8iwQy0fPYSxE0h.jpg", // Jawan
  "https://image.tmdb.org/t/p/w500/gPbM0MK8CP8A174rmUwGsADNYKD.jpg", // Oppenheimer
  "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", // Hollywood
  "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg", // Guardians of the Galaxy
  "https://image.tmdb.org/t/p/w500/qnqGbB22YJ7dSs4o6M7exTpNxPz.jpg", // Ant-Man
];

const MovieLoader = ({ onComplete }) => {
  const [stage, setStage] = useState(1);
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
     }, 5000);
      }
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
        ease: "linear"
      }
    }
  };

  return (
    <AnimatePresence>
      {stage === 2 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/90 z-50"
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
                  transformOrigin: "center center"
                }}
              >
                <img
                  src={poster}
                  alt=""
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>
            ))}

            {/* Center pulse */}
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
                  repeatType: "mirror"
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MovieLoader;
