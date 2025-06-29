
import React from "react";

const boxOfficeData = [
  {
    rank: 1,
    title: "Lilo & Stitch",
    dailyGross: 3629699,
    percentChange: -62.8,
    theaters: 4185,
    avgPerTheater: 867,
    totalToDate: 339288587,
    days: 18,
    distributor: "Walt Disney Studios Motion Pictures",
  },
  {
    rank: 2,
    title: "From the World of John Wick: Ballerina",
    dailyGross: 2059124,
    percentChange: -64.8,
    theaters: 3409,
    avgPerTheater: 604,
    totalToDate: 26560787,
    days: 4,
    distributor: "Lionsgate",
  },
  {
    rank: 3,
    title: "Mission: Impossible - The Final Reckoning",
    dailyGross: 1652072,
    percentChange: -63.2,
    theaters: 3496,
    avgPerTheater: 472,
    totalToDate: 150693767,
    days: 18,
    distributor: "Paramount Pictures",
  },
  {
    rank: 4,
    title: "Karate Kid: Legends",
    dailyGross: 850136,
    percentChange: -66.3,
    theaters: 3859,
    avgPerTheater: 220,
    totalToDate: 36156126,
    days: 11,
    distributor: "Sony Pictures Releasing",
  },
  {
    rank: 5,
    title: "Final Destination: Bloodlines",
    dailyGross: 824012,
    percentChange: -55.3,
    theaters: 2867,
    avgPerTheater: 287,
    totalToDate: 124338516,
    days: 25,
    distributor: "Warner Bros.",
  },
  {
    rank: 6,
    title: "The Phoenician Scheme",
    dailyGross: 674030,
    percentChange: -56.6,
    theaters: 1678,
    avgPerTheater: 401,
    totalToDate: 7677760,
    days: 11,
    distributor: "Focus Features",
  },
  {
    rank: 7,
    title: "Sinners",
    dailyGross: 383145,
    percentChange: -51.5,
    theaters: 1518,
    avgPerTheater: 252,
    totalToDate: 272928506,
    distributor: "Warner Bros.",
  },
  {
    rank: 8,
    title: "Dan Da Dan: Evil Eye",
    dailyGross: 355706,
    percentChange: -52.3,
    theaters: 1085,
    avgPerTheater: 327,
    totalToDate: 3548268,
    distributor: "GKIDS",
  },
  {
    rank: 9,
    title: "Thunderbolts",
    dailyGross: 290362,
    percentChange: -57.0,
    theaters: 1955,
    avgPerTheater: 148,
    totalToDate: 186703800,
    distributor: "Walt Disney Studios Motion Pictures",
  },
  {
    rank: 10,
    title: "The Last Rodeo",
    dailyGross: 146785,
    percentChange: -56.0,
    theaters: 1235,
    avgPerTheater: 118,
    totalToDate: 13145001,
    distributor: "Angel Studios",
  },
  {
    rank: 11,
    title: "A Minecraft Movie",
    dailyGross: 32703,
    percentChange: -60.7,
    theaters: 346,
    avgPerTheater: 94,
    totalToDate: 423612301,
    distributor: "Warner Bros.",
  },
  {
    rank: 12,
    title: "The Accountant 2",
    dailyGross: 13254,
    percentChange: -67.9,
    theaters: 290,
    avgPerTheater: 45,
    totalToDate: 65486713,
    distributor: "Amazon MGM Studios",
  },
];

const BoxOffice = () => {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <section className="relative overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8 animate-fadeIn">
      <div className="absolute inset-0 rounded-2xl overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-[borderPulse_3s_infinite]"></div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-amber-300">Daily Box Office</h2>
          <span className="bg-amber-500 text-gray-900 text-xs px-2 py-1 rounded-full animate-pulse">
            Updated Today
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boxOfficeData.map((movie, index) => (
            <div
              key={movie.rank}
              className={`relative bg-gray-900/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-amber-500/50 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/20 animate-fadeInCard delay-${index * 100}`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-amber-300 truncate">
                    {movie.rank}. {movie.title}
                  </h3>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      movie.rank <= 3 ? "bg-amber-400 text-gray-900" : "bg-gray-600 text-gray-300"
                    }`}
                  >
                    #{movie.rank}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-400">Daily Gross:</span>
                    <span className="text-amber-100 font-medium">{formatCurrency(movie.dailyGross)}</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="text-gray-400">Change:</span>
                    <span
                      className={`font-medium flex items-center gap-1 ${
                        movie.percentChange >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {movie.percentChange >= 0 ? "↑" : "↓"} {movie.percentChange.toFixed(1)}%
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Theaters:</span>
                    <span className="text-amber-100 font-medium">{movie.theaters.toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Avg. Per Theater:</span>
                    <span className="text-amber-100 font-medium">{formatCurrency(movie.avgPerTheater)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Total Gross:</span>
                    <span className="text-amber-100 font-medium">{formatCurrency(movie.totalToDate)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Days:</span>
                    <span className="text-amber-100 font-medium">{movie.days}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Distributor:</span>
                    <span className="text-amber-100 font-medium truncate">{movie.distributor}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BoxOffice;
