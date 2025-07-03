import { Home, List, Plus, MessageCircle, User, Star } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import React from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const routes = [
    { path: "/home", icon: <Home />, name: "Home" },
    { path: "/review", icon: <Star />, name: "Reviews" },
    { path: "/post", icon: <Plus />, name: "Post" },
    { path: "/notifaction", icon: <MessageCircle />, name: "Notication" },
    { path: "/profile", icon: <User />, name: "Profile" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 md:top-0 md:left-0 w-full z-50 md:w-20 md:h-screen h-16 bg-black border-t md:border-t-0 md:border-r border-cyan-900/30">
      <ul className="flex md:flex-col justify-around items-center h-full px-2 py-3">
        {routes.map((route, index) => (
          <li 
            key={index}
            className="relative group w-12 h-12 flex items-center justify-center"
            onClick={() => navigate(route.path)} 
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`p-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                isActive(route.path)
                  ? "text-amber-500 bg-gray-900"
                  : "text-gray-400 hover:bg-gray-900"
              }`}
            >
              {React.cloneElement(route.icon, {
                size: 26,
                strokeWidth: isActive(route.path) ? 2.5 : 2,
              })}
            </motion.div>

            {/* Desktop Label */}
            <div className="absolute hidden md:group-hover:block left-full ml-4 px-2.5 py-1.5 text-sm bg-black/95 backdrop-blur-sm rounded-md text-white border border-cyan-900/30 shadow-xl">
              {route.name}
              <div className="absolute w-2 h-2 bg-black/95 rotate-45 -left-1 top-1/2 -translate-y-1/2 border-l border-t border-cyan-900/30" />
            </div>

            {/* Active Indicator */}
            {isActive(route.path) && (
              <motion.div 
                className="absolute -top-1.5 md:top-auto md:-left-1 w-6 h-0.5 md:w-0.5 md:h-6 bg-amber-500 rounded-full"
                layoutId="nav-active"
              />
            )}
          </li>
        ))}

        {/* Floating Post Button (Mobile) */}
        {/* <motion.li
          className="absolute -top-6 left-1/2 -translate-x-1/2 md:hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div 
            className="p-3.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/20 border-2 border-cyan-300/30"
            onClick={() => navigate("/post")}
          >
            <Plus size={24} className="text-black stroke-[3]" />
          </div>
        </motion.li> */}
      </ul>
    </nav>
  );
};

export default Navbar;