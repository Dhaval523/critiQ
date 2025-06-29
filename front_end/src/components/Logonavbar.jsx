import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';

import axiosInstance from '../api/axiosInstance';
const accessToken = localStorage.getItem('accessToken');
const  LogoNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [settingOpen , setSettingOpen] = useState(false);
   const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const toggleSetting = ()=>{

    setSettingOpen(!settingOpen)
}
const logout = () =>{
  axiosInstance.post("/api/v1/users/logout",{
    headers: { 'Authorization': `Bearer ${accessToken}` }
  
  })
  navigate("/login") ;
}
  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-2 transition-all duration-500 ${
           'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Animated CritiQ Logo */}
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div 
            className="relative"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div 
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <motion.span 
                className="text-xl font-bold text-gray-900"
                animate={{ 
                  opacity: [0.8, 1, 0.8],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                C
              </motion.span>
            </motion.div>
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600"
              animate={{
                x: [0, -5, 0],
                y: [0, -5, 0],
                scale: [1, 0.8, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600"
              animate={{
                x: [0, 5, 0],
                y: [0, 5, 0],
                scale: [1, 0.8, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
          
          <motion.h1 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600"

            animate={{
              backgroundPosition: ["0%", "100%", "0%"]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: "200% auto"
            }}
          
          >
            CritiQ
          </motion.h1>
        </motion.div>
          <div className="flex items-end gap-4">
            <div className="relative">
              <img 
                src={user?.avatar|| "https://via.placeholder.com/40"} 
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/30"
                onClick={()=>navigate('/profile')}
              />
              <motion.div 
                className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-gray-900"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
               <div className="flex items-center  justify-center w-15 h-15 "
                onClick={toggleSetting}>
                <Settings/>
               </div>
            </div>
          </div>
          {
      settingOpen && (
          <div className='absolute right-10 top-12 px-4 py-4 w-35 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50'>
             <button onClick={() => navigate("/")} className="w-full   px-4 py-2 text-sm mb-2 text-center bg-yellow-600 text-black font-semibold rounded-lg hover:bg-gray-700">
                 Home
             </button>
             <button onClick={() => navigate("/about")} className="w-full  text-center px-4 py-2 text-sm mb-2 bg-yellow-600 text-black font-semibold rounded-lg hover:bg-gray-700">
                 About
             </button>
             <button onClick={ logout} className="w-full  text-center px-4 py-2 text-sm mb-2 bg-yellow-700 text-black font-semibold rounded-lg hover:bg-gray-700">
                 logout
             </button>
             
          </div>
      )}
       
      </div>
   
       
    </motion.nav>
    
  );
};

export default LogoNavbar ;