import React, { useEffect, useState } from "react";
import ReviewCard from "../components/ReviewCard";
import Navbar from "../components/Navbar";
import axiosInstance from "../api/axiosInstance";

const Review = () => {
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get("/api/v1/reviews/getReviews");
        if (!res.ok) {
          throw new Error(`Failed to fetch reviews: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setReviewsData(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-lg">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (!reviewsData.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-lg">No reviews found.</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen w-full py-12 text-white">
      <Navbar className="z-50" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviewsData.map((review) => (
          <div key={review._id} className="w-full">
            <ReviewCard
              image={review.image}
              rating={review.rating}
              comment={review.comment}
              tags={review.tags}
              mood={review.mood}
              spoiler={review.spoiler}
              movie={review.movie}
              user={review.user}
              createdAt={review.createdAt}
              _id={review._id}
              likes={review.likes}
              className = "z-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;