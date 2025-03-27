import React from 'react';

const Mood = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full relative">
      {/* Background Image Section */}
      <div className="relative w-full h-80">
        <img
          className="w-full h-full object-cover opacity-40"
          src="https://m.media-amazon.com/images/S/pv-target-images/8407d02875444d7f7b485e31665157a8edccd0d5ac39d9b44e43c911fea6b6f9._UR1920,1080_CLs%7C1920,1080%7C/G/bundle/BottomRightCardGradient16x9.png,/G/01/digital/video/merch/subs/benefit-id/m-r/Prime/logos/channels-logo-white.png%7C0,0,1920,1080+0,0,1920,1080+1578,847,263,156_SX600_FMwebp_.jpg"
          alt="Mood Background"
        />
        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1 className="text-2xl font-bold text-center mb-4 md:text-4xl">
            How Are <span className="text-cyan-500" >You</span> Feeling <span className="text-cyan-500">Today?</span>
          </h1>
          {/* Mood Buttons */}
          <div className="flex flex-col items-center md:flex-row mt-20">
            <button className="w-24 px-2 mx-3 bg-opacity-20 backdrop-blur-lg border-1 border-amber-50 text-white font-semibold py-2 rounded-xl cursor-pointer transform transition-transform duration-300 hover:-translate-y-2">
              Happy
            </button>
            <button className="w-24 px-2 mx-3 bg-opacity-20 backdrop-blur-lg border-1 border-amber-50 text-white font-semibold py-2 rounded-xl cursor-pointer transform transition-transform duration-300 hover:translate-y-1">
              Sad
            </button>
            <button className="w-24 px-2 mx-3 bg-opacity-20 backdrop-blur-lg border-1 border-amber-50 text-white font-semibold py-2 rounded-xl cursor-pointer transform transition-transform duration-300 hover:-translate-y-2">
              Excited
            </button>
            <button className="w-24 px-2 mx-3 bg-opacity-20 backdrop-blur-lg border-1 border-amber-50   text-white font-semibold py-2 rounded-xl cursor-pointer transform transition-transform duration-300 hover:translate-y-1">
              Relax
            </button>
          </div>
          {/* New Action Button */}
          <div className="mt-6">
            <button className="w-24 px-2 py-2 mx-3  text-white bg-cyan-500 font-semibold rounded-sm shadow-lg hover:bg-blue-600 transition-all duration-300">
              See More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mood;
