

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, Clapperboard } from "lucide-react";

// Floating particles with movie-themed colors
const FloatingParticles = ({ count = 30 }) => {
  const particles = Array.from({ length: count });

  return particles.map((_, i) => {
    const size = Math.random() * 8 + 4;
    const duration = Math.random() * 18 + 12;
    const delay = Math.random() * 4;
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

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const loaderVariants = {
  spin: { rotate: 360, transition: { duration: 1.5, repeat: Infinity, ease: "linear" } },
  pulse: { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7], transition: { duration: 0.8, repeat: Infinity } },
};

const About = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demo (remove in production)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#2d0072] via-[#a40082] to-[#00b5e0] z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-20 h-20 rounded-lg border-4 border-amber-500 shadow-lg flex items-center justify-center"
            variants={loaderVariants}
            animate="spin"
          >
            <Clapperboard className="w-8 h-8 text-white" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-5 h-5 bg-amber-300 rounded-full"
                variants={loaderVariants}
                animate="pulse"
              />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d0072] via-[#a40082] to-[#00b5e0] text-white overflow-hidden relative">
      <FloatingParticles count={30} />

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent to-[#2d0072]/70 z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-700">
            About CritiQ
          </h1>
          <p className="mt-3 text-lg text-gray-300 max-w-md mx-auto">
            A movie review platform crafted with passion by Dhaval Rathod
          </p>
        </motion.header>

        {/* Main Content */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 hover:border-amber-500/50 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img
                  src="https://via.placeholder.com/150" // Replace with your profile image URL
                  alt="Dhaval Rathod"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-amber-500 object-cover shadow-lg"
                />
              </div>

              {/* Introduction */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Hey, I'm Dhaval Rathod!
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  I'm a full-stack developer and movie enthusiast who brought **CritiQ** to life. This platform is my self-made project, designed and built from the ground up to let movie lovers share their reviews, discover new films, and connect through honest opinions. Using **React**, **Tailwind CSS**, **Node.js**, and **MongoDB**, I created a modern, user-friendly space for cinematic discussions.
                </p>
                <p className="text-gray-300 leading-relaxed mb-6">
                  CritiQ reflects my love for coding and cinema. Whether it's crafting a seamless UI or diving into a blockbuster, I'm all about creating and exploring. Thanks for visiting CritiQ!
                </p>

                {/* Social Links */}
                <div className="flex justify-center md:justify-start gap-4">
                  <a
                    href="https://github.com/Dhaval523" // Replace with your GitHub
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/dhavalrathod/" // Replace with your LinkedIn
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a
                    href="mailto:dr93373407@gmail.com" // Replace with your email
                    className="text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    <Mail className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="mt-12"
        >
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 hover:border-amber-500/50 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              Built With
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "React", icon: <Clapperboard className="w-8 h-8 text-amber-500" /> },
                { name: "Tailwind CSS", icon: <Clapperboard className="w-8 h-8 text-amber-500" /> },
                { name: "Node.js", icon: <Clapperboard className="w-8 h-8 text-amber-500" /> },
                { name: "MongoDB", icon: <Clapperboard className="w-8 h-8 text-amber-500" /> },
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="flex flex-col items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                >
                  {tech.icon}
                  <span className="mt-2 text-sm font-medium text-gray-300">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-gray-300 mt-16">
        <p>© {new Date().getFullYear()} CritiQ. Crafted by Dhaval Rathod.</p>
      </footer>
    </div>
  );
};

export default About;