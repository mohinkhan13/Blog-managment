import React from "react";
import { motion } from "framer-motion"; // For animations

function PostHeader({ post }) {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div
      className="relative h-[320px] sm:h-[400px] md:h-[500px] bg-fixed bg-center bg-cover overflow-hidden"
      style={{
        backgroundImage: `url(${post.image || "default-image.jpg"})`,
      }}
      role="img"
      aria-label={`Header image for ${post.title}`}
    >
      {/* Enhanced Overlay with subtle grain effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/85 via-gray-900/65 to-gray-900/40 backdrop-blur-sm"></div>

      {/* Animated Content Container */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 sm:px-6 md:px-12"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        {/* Category Tag with Gradient */}
        <motion.p
          className="inline-block px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {post.categoryName || "Uncategorized"}
        </motion.p>

        {/* Title with Text Shadow and Gradient */}
        <motion.h1
          className="max-w-5xl text-2xl font-extrabold leading-tight text-center text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl line-clamp-2 bg-clip-text bg-gradient-to-r from-white to-gray-200 drop-shadow-lg"
          variants={fadeInUp}
        >
          {post.title}
        </motion.h1>

        {/* Meta Information with Avatar and Animation */}
        <motion.div
          className="flex flex-col items-center gap-4 text-sm text-white sm:flex-row sm:gap-8 sm:text-base"
          variants={fadeInUp}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 font-semibold text-white ">
              <span className="p-1 font-medium bg-blue-500 rounded-full shadow-md">
                {typeof post.author === "object"
                  ? post.author.fname
                  : post.author || "Unknown"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-5">
            <i className="text-lg text-blue-400 ri-calendar-line"></i>
            <span className="font-medium">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative Bottom Wave */}
      <svg
        className="absolute bottom-0 w-full text-white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          fillOpacity="0.1"
          d="M0,0 C280,80 720,100 1440,20 V100 H0 Z"
        />
      </svg>
    </div>
  );
}

export default PostHeader;
