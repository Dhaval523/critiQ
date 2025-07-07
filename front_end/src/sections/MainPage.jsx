
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axiosInstance from "../api/axiosInstance";
import debounce from "lodash.debounce";
import movieQ from "../data/movieQ.json";
import BoxOffice from "../components/Boxofffice";
import { ImageOff } from "lucide-react";
import Logo from "../components/logo.jsx";

// MovieCard Component
const MovieCard = ({ movie, index }) => {
  const navigate = useNavigate();
  const formattedDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "N/A";

  return (
    <div
      className={`relative bg-gray-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-amber-500/50 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer animate-fadeInCard delay-${index * 100}`}
    
    >
      <div className="relative h-64">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = "https://via.placeholder.com/300x450?text=No+Poster")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <span
          className={`absolute top-2 left-2 w-8 h-8 flex items-center justify-center font-bold text-sm rounded-full ${movie.ratingValue > 6 ? "bg-green-500" : movie.ratingValue > 4 ? "bg-amber-500" : "bg-red-500"
            } text-gray-900`}
        >
          {movie.rating}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-amber-300 mb-2 truncate">{movie.title}</h3>
        <p className="text-gray-400 text-sm mb-2">
          <span className="font-medium">Release:</span> {formattedDate}
        </p>
        <p className="text-gray-400 text-sm line-clamp-1">
          <span className="font-medium">Genres:</span> {movie.genres?.join(", ") || "N/A"}
        </p>
      </div>
    </div>
  );
};

// MovieTriviaChallenge Component
const MovieTriviaChallenge = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionBatchStartIndex, setQuestionBatchStartIndex] = useState(0);
  const [error, setError] = useState(null);

  // Validate movieQ data
  useEffect(() => {
    if (!movieQ || !Array.isArray(movieQ) || movieQ.length === 0) {
      setError("No trivia questions available.");
    } else {
      const invalidQuestions = movieQ.filter(
        (q) =>
          !q.question ||
          !Array.isArray(q.options) ||
          q.correct == null ||
          q.correct < 0 ||
          q.correct >= q.options.length
      );
      if (invalidQuestions.length > 0) {
        setError("Some questions in the dataset are invalid.");
      }
    }
  }, []);

  const currentBatchQuestions = movieQ.slice(
    questionBatchStartIndex,
    questionBatchStartIndex + 5
  );

  const handleAnswer = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    if (optionIndex === currentBatchQuestions[currentQuestionIndex].correct) {
      setScore((prev) => prev + 1);
    }
    setTimeout(() => {
      if (currentQuestionIndex < currentBatchQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setQuestionBatchStartIndex((prev) => (prev + 5) % (movieQ.length || 1));
  };

  if (error) {
    return (
      <section className="relative overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8 animate-fadeIn">
        <div className="relative z-10">
          <h3 className="font-bold text-xl text-amber-300 mb-4">Movie Trivia Challenge</h3>
          <p className="text-red-400 text-center">{error}</p>
        </div>
      </section>
    );
  }

  if (currentBatchQuestions.length === 0) {
    return (
      <section className="relative overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8 animate-fadeIn">
        <div className="relative z-10">
          <h3 className="font-bold text-xl text-amber-300 mb-4">Movie Trivia Challenge</h3>
          <p className="text-gray-400 text-center">Loading questions...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8 animate-fadeIn">
      <div className="absolute inset-0 rounded-2xl overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-[borderPulse_3s_infinite]"></div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl text-amber-300">Movie Trivia Challenge</h3>
          <span className="bg-amber-500 text-gray-900 text-xs px-2 py-1 rounded-full animate-pulse">
            Test Your Knowledge
          </span>
        </div>
        {showResult ? (
          <div className="text-center animate-fadeIn">
            <p className="text-lg mb-4">
              Your score: <span className="font-bold text-2xl text-amber-400">{score}/{currentBatchQuestions.length}</span>
            </p>
            <p className="text-amber-300 mb-6">
              {score === currentBatchQuestions.length
                ? "🎬 Movie Master! Perfect score!"
                : score > currentBatchQuestions.length / 2
                  ? "👍 Solid movie knowledge!"
                  : "🍿 Time for a movie marathon!"}
            </p>
            <button
              onClick={resetQuiz}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-700 text-gray-900 font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.03]"
            >
              Play Again
            </button>
          </div>
        ) : (
          <>
            <p className="text-amber-100/80 mb-4">Test your movie knowledge!</p>
            <div className="mb-6">
              <p className="text-lg font-medium mb-2">{currentBatchQuestions[currentQuestionIndex].question}</p>
              <p className="text-sm text-gray-400 mb-4">
                Category: {currentBatchQuestions[currentQuestionIndex].category || "General"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentBatchQuestions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-300 transform hover:scale-[1.03] ${selectedAnswer === index
                        ? index === currentBatchQuestions[currentQuestionIndex].correct
                          ? "bg-green-500/20 border-green-500 text-green-300"
                          : "bg-red-500/20 border-red-500 text-red-300"
                        : "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-amber-500 text-gray-300"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Question {currentQuestionIndex + 1} of {currentBatchQuestions.length}
            </p>
          </>
        )}
      </div>
    </section>
  );
};

const MovieReviewApp = () => {
  const [activeMovie, setActiveMovie] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [topMovies, setTopMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const [newsList, setNewsList] = useState([]);
  const [blogList , setBlogList] = useState([]);
  const [activeNews, setActiveNews] = useState(0);
  const [isLoading , setIsLoading] = useState(false);

  // Fetch top movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const cachedData = localStorage.getItem("topMovies");
        const cachedTime = localStorage.getItem("topMoviesDate");
        const today = new Date().toDateString();

        if (cachedData && cachedTime === today) {
          setTopMovies(JSON.parse(cachedData));
          return;
        }

        const response = await fetch(
          "https://imdb236.p.rapidapi.com/api/imdb/most-popular-movies",
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": "11ada81770msh49c3dd7cea3fe53p178a8cjsn1e0020aab805",
              "X-RapidAPI-Host": "imdb236.p.rapidapi.com",
            },
          }
        );

        const json = await response.json();

        if (Array.isArray(json)) {
          const top10 = json.slice(0, 10).map((movie) => ({
            id: movie.id || `movie-${Math.random()}`,
            title: movie.primaryTitle || "Untitled",
            poster: movie.primaryImage || "https://via.placeholder.com/150x225?text=No+Poster",
            rating: movie.averageRating ? movie.averageRating.toFixed(1) : "N/A",
            ratingValue: parseFloat(movie.averageRating) || 0,
          }));

          localStorage.setItem("topMovies", JSON.stringify(top10));
          localStorage.setItem("topMoviesDate", today);
          setTopMovies(top10);
          setError("");
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to load top movies. Please try again later.");
        setTopMovies([
          {
            id: "fallback-1",
            title: "Sample Movie",
            poster: "https://via.placeholder.com/150x225?text=No+Poster",
            rating: "N/A",
            ratingValue: 0,
          },
        ]);
      }
    };

    fetchMovies();
  }, []);

  // Search movies
  const searchMovies = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults(null);
        setSearchLoading(false);
        return;
      }

      setSearchLoading(true);

      try {
        const response = await fetch(
          `https://imdb236.p.rapidapi.com/api/imdb/search?originalTitle=${encodeURIComponent(query)}`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": "11ada81770msh49c3dd7cea3fe53p178a8cjsn1e0020aab805",
              "X-RapidAPI-Host": "imdb236.p.rapidapi.com",
            },
          }
        );

        const data = await response.json();

        if (data?.results && Array.isArray(data.results)) {
          const results = data.results.map((movie) => ({
            id: movie.id || `movie-${Math.random()}`,
            title: movie.primaryTitle || "Untitled",
            poster: movie.primaryImage || "https://via.placeholder.com/300x450?text=No+Poster",
            rating: movie.averageRating ? movie.averageRating.toFixed(1) : "N/A",
            ratingValue: parseFloat(movie.averageRating) || 0,
            releaseDate: movie.releaseDate || "",
            genres: movie.genres || [],
            description: movie.description || "",
            url: movie.url || "",
          }));

          setSearchResults(results);
          setError("");
        } else {
          setSearchResults([]);
          setError("No movies found.");
        }
      } catch (error) {
        console.error("Error searching movies:", error);
        setSearchResults([]);
        setError("Failed to search movies. Please try again.");
      } finally {
        setSearchLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    searchMovies(searchQuery);
  }, [searchQuery, searchMovies]);

  const fetchLatestFilmNews = async () => {
    try {
      const response = await fetch(
        "https://real-time-news-data.p.rapidapi.com/search?query=film%20related%20news&limit=15&time_published=1d&country=IN&lang=en",
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": "11ada81770msh49c3dd7cea3fe53p178a8cjsn1e0020aab805",
            "X-RapidAPI-Host": "real-time-news-data.p.rapidapi.com",
          },
        }
      );

      const json = await response.json();

      if (json?.data && Array.isArray(json.data)) {
        const formattedNews = json.data.map((item, index) => ({
          id: index,
          title: item.title || "Untitled",
          link: item.link || "#",
          snippet: item.snippet || "",
          image:
            item.photo_url ||
            item.thumbnail_url ||
            "https://via.placeholder.com/300x200?text=No+Image",
          published: item.published_datetime_utc || "",
          author: item.authors?.[0] || "Unknown",
          source: item.source_name || "",
          favicon: item.source_favicon_url || "",
        }));

        localStorage.setItem("cachedFilmNews", JSON.stringify(formattedNews));
        localStorage.setItem("cachedFilmNewsTimestamp", Date.now());

        setNewsList(formattedNews);
      } else {
        setNewsList([]);
        setError("No news found.");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNewsList([]);
      setError("Failed to load news.");
    }
  };
  const fetchBlog = async () => {
    try {
      const response = await fetch(
        "https://real-time-news-data.p.rapidapi.com/search?query=new%20%20movies%20news&limit=3&time_published=1d&country=IN&lang=en",
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": "11ada81770msh49c3dd7cea3fe53p178a8cjsn1e0020aab805",
            "X-RapidAPI-Host": "real-time-news-data.p.rapidapi.com",
          },
        }
      );
      const json = await response.json();
      if (json?.data && Array.isArray(json.data)) {
        const formatteBlog = json.data.map((item, index) => ({
          id: item.id || `blog-${index}-${Date.now()}`, // Use item.id if available, else generate unique ID
          title: item.title || "Untitled",
          link: item.link || "#",
          snippet: item.snippet || "",
          image:
            item.photo_url ||
            item.thumbnail_url ||
            "https://via.placeholder.com/300x200?text=No+Image",
          published: item.published_datetime_utc || "",
          author: item.authors?.[0] || "Unknown",
          source: item.source_name || "",
          favicon: item.source_favicon_url || "",
        }));
  
        localStorage.setItem("cachedBlog", JSON.stringify(formatteBlog));
        localStorage.setItem("cachedBlogTimestamp", Date.now().toString());
  
        setBlogList(formatteBlog);
        setError(null); // Clear any previous errors
      } else {
        setBlogList([]);
        setError("No blog posts found.");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      setBlogList([]);
      setError("Failed to load blog posts.");
    }
  };
  
  useEffect(() => {
    const cachedNews = localStorage.getItem("cachedFilmNews");
    const cachedNewsTimestamp = localStorage.getItem("cachedFilmNewsTimestamp");
    const cachedBlog = localStorage.getItem("cachedBlog");
    const cachedBlogTimestamp = localStorage.getItem("cachedBlogTimestamp");
  
    const oneDay = 24 * 60 * 60 * 1000;
    const now = Date.now();
  
    let shouldFetchNews = true;
    let shouldFetchBlog = true;
  
    // Check if cached news is valid
    if (cachedNews && cachedNewsTimestamp && now - parseInt(cachedNewsTimestamp) < oneDay) {
      setNewsList(JSON.parse(cachedNews));
      shouldFetchNews = false;
    }
  
    // Check if cached blog is valid
    if (cachedBlog && cachedBlogTimestamp && now - parseInt(cachedBlogTimestamp) < oneDay) {
      setBlogList(JSON.parse(cachedBlog));
      shouldFetchBlog = false;
    }
  
    // Fetch data if cache is invalid or missing
    if (shouldFetchBlog) {
      fetchBlog(); // Assuming fetchBlogPosts was meant to be fetchBlog
    }
    if (shouldFetchNews) {
      fetchLatestFilmNews(); // Ensure this function is defined elsewhere
    }
  }, []);
    useEffect(() => {
      const interval = setInterval(() => {
        setActiveNews((prev) => (prev + 1) % newsList.length);
      }, 5000);

      return () => clearInterval(interval);
    }, [newsList.length]);

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleClearSearch = () => {
      setSearchQuery("");
      setSearchResults(null);
      setError("");
    };

    return (
      <div className="min-h-screen relative w-full overflow-hidden bg-gradient-to-br from-[#2d0072] via-[#a40082] to-[#00b5e0] py-12 text-white">
         
         
         <Logo />
        
        <Navbar isScrolled={isScrolled} />

        <main className="relative z-10 pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <section className="mb-12">
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <SearchIcon className="w-5 h-5 text-amber-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies (e.g., Jawan)..."
                  className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 focus:border-amber-500 text-white placeholder-gray-400 rounded-full pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-300 hover:shadow-amber-500/20"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute inset-y-0 right-0 flex items-center pr-4"
                  >
                    <XIcon className="w-5 h-5 text-gray-400 hover:text-amber-400" />
                  </button>
                )}
              </div>
            </section>

            {searchResults !== null && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-amber-300">
                    Search Results {searchResults.length > 0 ? `(${searchResults.length})` : ""}
                  </h2>
                  {searchResults.length > 0 && (
                    <button
                      onClick={handleClearSearch}
                      className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      Clear Results
                      <XIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {searchLoading ? (
                  <div className="flex justify-center">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : error && !searchResults.length ? (
                  <p className="text-red-400 text-center">{error}</p>
                ) : searchResults.length === 0 ? (
                  <p className="text-gray-400 text-center">No movies found for "{searchQuery}".</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {searchResults.map((movie, index) => (
                      <MovieCard key={movie.id} movie={movie} index={index} />
                    ))}
                  </div>
                )}
              </section>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <section className="relative overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden z-0">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-[borderPulse_3s_infinite]"></div>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
                        Latest Film News
                      </h2>
                      <div className="flex gap-2">
                        <span className="bg-amber-500 text-gray-900 text-xs px-2 py-1 rounded-full animate-pulse">
                          New
                        </span>
                        <div className="flex">
                          {newsList.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveNews(idx)}
                              className={`w-2 h-2 rounded-full mx-0.5 transition-all ${idx === activeNews ? "bg-amber-500 w-4" : "bg-gray-600"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {newsList.length > 0 ? (
                      <div className="flex flex-col md:flex-row gap-6 animate-fadeInNews">
                        <div className="flex-shrink-0">
                          <img
                            src={newsList[activeNews].image}
                            alt={newsList[activeNews].title}
                            className="w-full md:w-48 h-32 object-cover rounded-xl border border-gray-600"
                            onError={(e) => (e.target.src = "https://via.placeholder.com/300x200?text=No+Image")}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-amber-300 mb-2 line-clamp-2">
                            {newsList[activeNews].title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                            {newsList[activeNews].snippet}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{new Date(newsList[activeNews].published).toLocaleDateString()}</span>
                            <span>by {newsList[activeNews].author}</span>
                            <span>{newsList[activeNews].source}</span>
                          </div>
                          <a
                            href={newsList[activeNews].link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1"
                          >
                            Read Full Article
                            <ArrowRightIcon className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center">{error || "No news available."}</p>
                    )}
                  </div>
                </section>

                <MovieTriviaChallenge />
                <BoxOffice />
              </div>

              <div className="space-y-8">
                <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Top 10 Movies of the Week</h2>
                    <button className="text-xs text-amber-400 hover:text-amber-300">
                      View Chart
                    </button>
                  </div>
                  {error && (
                    <div className="text-red-400 text-sm mb-4 text-center">{error}</div>
                  )}
                  <div className="space-y-4">
                    {topMovies.map((movie, index) => (
                      <div
                        key={movie.id}
                        className="flex items-center gap-4 pb-3 border-b border-gray-700/50 hover:bg-gray-700/30 rounded-lg px-3 py-2 transition-all duration-300 cursor-pointer"
                    
                        onMouseEnter={(e) => e.currentTarget.classList.add("bg-gray-700/30")}
                        onMouseLeave={(e) => e.currentTarget.classList.remove("bg-gray-700/30")}
                      >
                        <div className="relative flex-shrink-0 w-16 h-24">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full h-full object-cover rounded-md border border-gray-600"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/150x225?text=No+Poster";
                            }}
                          />
                          <span
                            className={`absolute -top-2 -left-2 w-6 h-6 flex items-center justify-center font-bold text-xs rounded-full ${index < 3 ? "bg-amber-400 text-gray-900" : "bg-gray-600 text-gray-300"
                              }`}
                          >
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-sm line-clamp-2">{movie.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {movie.ratingValue > 6 ? (
                            <span className="text-green-400 font-bold text-sm">{movie.rating}</span>
                          ) : movie.ratingValue > 4 ? (
                            <span className="text-amber-400 font-bold text-sm">{movie.rating}</span>
                          ) : movie.ratingValue > 0 ? (
                            <span className="text-red-400 font-bold text-sm">{movie.rating}</span>
                          ) : (
                            <span className="text-gray-500 text-xs">N/A</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-amber-100">Movie-Related Blogs & News</h2>
      
      {isLoading ? (
        <div className="text-center text-gray-400 py-4">Loading articles...</div>
      ) : error ? (
        <div className="text-center text-red-400 py-4">{error}</div>
      ) :  blogList.length === 0 ? (
        <div className="text-center text-gray-400 py-4">No articles found.</div>
      ) : (
        <div className="space-y-6">
          { blogList.map((post) => (
            <article
              key={post.id}
              className="pb-4 border-b border-gray-700/50 last:border-0 last:pb-0 group"
              aria-labelledby={`post-title-${post.id}`}
            >
              <h3
                id={`post-title-${post.id}`}
                className="font-bold mb-1 text-amber-100 group-hover:text-amber-400 transition-colors duration-300"
              >
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {post.title}
                </a>
              </h3>
              <p className="text-gray-400 text-sm">
                {post.published ? new Date(post.published).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : 'Date unavailable'}
              </p>
              <p className="text-gray-300 text-sm mt-1 line-clamp-2">{post.snippet}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                {post.favicon && (
                  <img
                    src={post.favicon}
                    alt={`${post.source} favicon`}
                    className="w-4 h-4"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                )}
                <span>{post.source}</span>
                <span>•</span>
                <span>{post.author}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* <button
       
        disabled={isLoading}
        className="mt-6 w-full border border-gray-600 hover:border-amber-500 text-gray-300 hover:text-amber-400 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="View all movie-related articles"
      >
        View All Articles
        <ArrowRightIcon className="w-4 h-4" />
      </button> */}
    </section>

                {/* <section className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-500 w-10 h-10 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-white">N</span>
                    </div>
                    <h3 className="font-bold text-lg">Netflix</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Stream newly released movies and exclusive content</p>
                  <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 rounded-lg transition-all duration-300 transform hover:scale-[1.02]">
                    Explore Library
                  </button>
                </section> */}

                <section className="bg-gradient-to-br from-amber-900/30 to-amber-900/10 rounded-2xl p-6 border border-amber-800/50">
                  <h3 className="font-bold text-lg mb-2 text-amber-200">Stay Updated</h3>
                  <p className="text-amber-100/80 mb-4">
                    Subscribe to our newsletter for the latest movie reviews and news
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="flex-1 bg-amber-900/20 border border-amber-800/50 rounded-lg px-4 py-2.5 text-amber-100 placeholder-amber-200/50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-medium px-4 py-2.5 rounded-lg transition-all duration-300">
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
          <footer className="relative z-10 py-8 text-center text-gray-400 mt-16">
        <p>© {new Date().getFullYear()} critiQ. All rights reserved.</p>
      </footer>
      
        </main>

        <style jsx global>{`
        @keyframes borderPulse {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInCard {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadeInNews {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-content {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-content {
          animation: fadeInCard 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-content {
          animation: fadeInNews 0.6s ease-out forwards;
          opacity: 0;
        }
        .delay-0 {
          animation-delay: 0ms;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
      </div>
    );
  };

  // Icons
  const HeartIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-red-400"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
        clipRule="evenodd"
      />
    </svg>
  );

  const CommentIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-amber-400"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
        clipRule="evenodd"
      />
    </svg>
  );

  const PlayIcon = ({ className = "w-5 h-5" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
        clipRule="evenodd"
      />
    </svg>
  );

  const ArrowRightIcon = ({ className = "w-5 h-5" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );

  const SearchIcon = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"    
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 100-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
        clipRule="evenodd"
      />
    </svg>
  );

  const XIcon = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );

  export default MovieReviewApp;
