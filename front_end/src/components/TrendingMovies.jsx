import React, { useState, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers";
import { format, addDays } from "date-fns";
import { CalendarDays, Search, Plus, Trash, AlertCircle, Bell, Save } from "lucide-react";
import axios from "axios";

const TrendingMovies= () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [reminderTime, setReminderTime] = useState("19:00");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState("default");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [playlistName, setPlaylistName] = useState(""); // Playlist name input

  // Load playlist from local storage on component mount
  useEffect(() => {
    const savedPlaylist = JSON.parse(localStorage.getItem("moviePlaylist")) || [];
    setPlaylist(savedPlaylist);
  }, []);

  // Save playlist to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("moviePlaylist", JSON.stringify(playlist));
  }, [playlist]);

  // Fetch trending movies on component mount
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?s=action&apikey=a220b9e` // Replace with your OMDb API key
        );

        if (!response.ok) {
          throw new Error("Failed to fetch trending movies");
        }

        const data = await response.json();

        if (data.Response === "True") {
          setTrendingMovies(data.Search.slice(0, 7)); // Show top 7 trending movies
        }
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    };

    fetchTrendingMovies();
  }, []);

  // Request notification permission on component mount
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
      });
    }
  }, []);

  // Handle search for movies
  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim();

    if (!query) return;

    try {
      const response = await fetch(
        `http://www.omdbapi.com/?s=${query}&apikey=a220b9e` // Replace with your OMDb API key
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (data.Response === "True") {
        setSearchResults(data.Search);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setSearchResults([]);
    }
  };

  // Add movie to playlist
  const addToPlaylist = (movie) => {
    if (playlist.length < 7 && !playlist.some((m) => m.imdbID === movie.imdbID)) {
      setPlaylist([...playlist, { ...movie, date: addDays(new Date(), playlist.length) }]);
    }
  };

  // Remove movie from playlist
  const handleRemove = (id) => {
    setPlaylist(playlist.filter((movie) => movie.imdbID !== id));
  };

  // Handle drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event) => {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          return { x: 0, y: event.key === "ArrowUp" ? -1 : 1 };
        }
        return null;
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPlaylist((items) => {
        const oldIndex = items.findIndex((item) => item.imdbID === active.id);
        const newIndex = items.findIndex((item) => item.imdbID === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Schedule notifications for the playlist
  const scheduleNotifications = () => {
    if (notificationPermission !== "granted") {
      alert("Please allow notifications to enable reminders.");
      return;
    }

    playlist.forEach((movie) => {
      // Split the reminderTime into hours and minutes
      const [hours, minutes] = reminderTime.split(":").map(Number);

      // Create a new date object for the movie's notification time
      const notificationTime = new Date(movie.date);
      notificationTime.setHours(hours, minutes, 0, 0); // Set the time for the notification

      // Calculate the timeout (difference between notification time and current time)
      const timeout = notificationTime.getTime() - Date.now();

      // Schedule the notification if the timeout is positive
      if (timeout > 0) {
        setTimeout(() => {
          new Notification(`Movie Reminder: ${movie.Title}`, {
            body: `It's time to watch ${movie.Title} (${movie.Year})!`,
            icon: movie.Poster,
          });
        }, timeout);
      } else {
        console.warn(`Notification time for ${movie.Title} has already passed.`);
      }
    });
  };

  // Save playlist to backend
  const savePlaylist = async () => {
    if (!playlistName.trim()) {
      alert("Please enter a name for your playlist.");
      return;
    }
  
    const accessToken = localStorage.getItem("accessToken"); // Get token from localStorage
    if (!accessToken) {
      alert("You are not authenticated. Please log in.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:5300/api/v1/playlist/savePlaylist",
        {
          name: playlistName,
          movies: playlist,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Ensure token is valid
          },
        }
      );
  
      alert("Playlist saved successfully!");
      setIsModalOpen(false);
      setPlaylistName("");
      setPlaylist([]);
      console.log(response)
    } catch (error) {
      console.error("Error saving playlist:", error);
      alert("Failed to save playlist. Check console for details.");
    }
  };
  
  return (
    <div className="text-white p-5 md:px-20 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <CalendarDays className="w-8 h-8 text-cyan-500" />
        <h1 className="text-xl md:text-3xl font-bold">
          My Movie <span className="text-cyan-500">Plan</span>
        </h1>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex items-center bg-gray-800 rounded-lg p-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-white ml-2 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            Search
          </button>
        </form>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {searchResults.map((movie) => (
              <div
                key={movie.imdbID}
                className="relative group bg-gray-800 rounded-lg overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/20"
              >
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full h-64 object-cover transform transition-all duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                  <h3 className="text-lg font-semibold">{movie.Title}</h3>
                  <p className="text-sm text-gray-400">{movie.Year}</p>
                  <button
                    onClick={() => addToPlaylist(movie)}
                    className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Playlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Movies */}
      {searchResults.length === 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Trending Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {trendingMovies.map((movie) => (
              <div
                key={movie.imdbID}
                className="relative group bg-gray-800 rounded-lg overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/20"
              >
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full h-64 object-cover transform transition-all duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                  <h3 className="text-lg font-semibold">{movie.Title}</h3>
                  <p className="text-sm text-gray-400">{movie.Year}</p>
                  <button
                    onClick={() => addToPlaylist(movie)}
                    className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Playlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Playlist Section */}
      <div className="bg-gray-800 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Playlist</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Playlist
          </button>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        >
          <SortableContext items={playlist} strategy={verticalListSortingStrategy}>
            {playlist.map((movie) => (
              <SortableItem key={movie.imdbID} id={movie.imdbID} movie={movie} onRemove={handleRemove} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Reminder Settings */}
      <div className="bg-gray-800 p-6 rounded-xl mt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-cyan-500" />
          Reminder Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="bg-gray-700 rounded-lg p-2 text-white"
              />
              Daily Reminder
            </label>
          </div>
          <button
            onClick={scheduleNotifications}
            className="w-full bg-cyan-600 hover:bg-cyan-700 py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <Bell className="w-5 h-5" />
            Enable Notifications
          </button>
        </div>
      </div>

      {/* Save Playlist Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Save Playlist</h3>
            <input
              type="text"
              placeholder="Enter playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full bg-gray-700 rounded-lg p-2 text-white mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={savePlaylist}
                className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sortable Item Component
const SortableItem = ({ id, movie, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between gap-4 bg-gray-700 p-4 rounded-lg mb-4"
    >
      <img src={movie.Poster} alt={movie.Title} className="w-16 h-16 object-cover rounded-lg" />
      <div>
        <h3 className="text-lg font-semibold">{movie.Title}</h3>
        <p className="text-sm text-gray-400">{movie.Year}</p>
        <p className="text-sm text-gray-400">{format(movie.date, "EEEE, MMMM do")}</p>
      </div>
      <button onClick={() => onRemove(movie.imdbID)}>
        <Trash className="h-5 w-5 text-red-500 hover:text-red-600" />
      </button>
    </div>
  );
};

export default TrendingMovies;