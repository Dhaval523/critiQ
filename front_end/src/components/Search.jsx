import React from 'react';

const Search = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center py-5 px-6 bg-black">
      {/* Movie App Title */}
      <h1 className="text-3xl text-white font-bold mb-4 md:mb-0 md:ml-20">Movie <span className='text-cyan-500'>App</span> </h1>

      {/* Search Box */}
      <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 w-full md:w-auto">
        <input
          className="text-white px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300 w-full md:w-64"
          type="text"
          placeholder="Search Movies.."
        />
        <button className="mt-4 md:mt-0 px-6 py-2 bg-opacity-60 backdrop-blur-lg text-white rounded-md hover:bg-cyan-500 transition duration-200 w-full md:w-auto">
          Search
        </button>
      </div>
    </div>
  );
};

export default Search;
