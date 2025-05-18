import React from "react";
import { motion } from "framer-motion"; // For animations

function PostContent({ post, postStats }) {
  // Animation variant for fade-in effect
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="max-w-4xl px-4 py-12 mx-auto bg-white rounded-lg shadow-lg sm:px-6 md:px-8"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Content */}
      <div
        className="font-sans text-[22px] leading-relaxed prose prose-lg text-justify text-gray-800 sm:prose-xl max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Decorative Divider */}
      <div className="w-24 h-1 mx-auto mt-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
      <div className="mt-4 text-gray-500">
        <i className="ri-eye-line"></i> {postStats?.views || 0}
      </div>
    </motion.div>
  );
}

export default PostContent;
