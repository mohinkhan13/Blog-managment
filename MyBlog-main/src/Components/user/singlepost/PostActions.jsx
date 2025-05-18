import React from "react";
import { motion } from "framer-motion"; // For animations
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";

function PostActions({ postStats, isLiked, setIsLiked, setPostStats }) {
  // Animation variants
  const { user, tokens } = useContext(AuthContext); // Get tokens from context

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const handleLikeToggle = async () => {
    if (!user) {
      alert("Please login to like posts");
      return;
    }
    if (!postStats) return;

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/post-stats/${postStats.id}/toggle_like/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokens?.access}`, // Use tokens.access
          },
        }
      );

      const updatedStats = res.data;
      setIsLiked(updatedStats.liked_by.includes(user.id));
      setPostStats(updatedStats);
    } catch (err) {
      console.error("Error toggling like:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this post!",
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      // Fallback: Copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-3xl px-4 py-8 mx-auto border-t border-gray-200 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6">
        {/* Like Button */}
        <motion.button
          onClick={handleLikeToggle}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full shadow-md font-semibold text-sm sm:text-base transition-colors duration-300 ${
            isLiked
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
          }`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          disabled={!postStats}
        >
          <i
            className={`text-lg sm:text-xl ${
              isLiked ? "ri-heart-fill" : "ri-heart-line text-red-500"
            }`}
          />
          <span>
            {isLiked ? "Liked" : "Like"} ({postStats?.likes || 0})
          </span>
        </motion.button>

        {/* Share Button */}
        <motion.button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-full shadow-md font-semibold text-sm sm:text-base hover:bg-gray-100 transition-colors duration-300"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <i className="text-lg text-blue-500 ri-share-line sm:text-xl" />
          <span>Share</span>
        </motion.button>
      </div>
    </div>
  );
}

export default PostActions;
