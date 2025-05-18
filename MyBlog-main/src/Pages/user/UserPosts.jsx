import React, { useState } from "react";
import { useSelector } from "react-redux";
import PostCard from "../../Components/user/PostCard";

function UserPosts() {
  const { posts, loading, error } = useSelector((state) => state.data);

  // State to manage the number of posts to display
  const [visiblePosts, setVisiblePosts] = useState(6);

  if (loading) {
    return (
      <div className="flex justify-center my-20">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-20 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Function to handle "Load More" button click
  const handleLoadMore = () => {
    setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 6);
  };

  return (
    <div className="flex flex-col items-center gap-6 my-20 md:gap-10">
      {/* Display only the visible posts */}
      {posts.length > 0 ? (
        <>
          <div className="flex flex-wrap justify-center w-full gap-6">
            {posts.slice(0, visiblePosts).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Load More Button */}
          {visiblePosts < posts.length && (
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 text-white transition-all duration-300 ease-in-out transform bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 hover:scale-105"
            >
              Load More
            </button>
          )}
        </>
      ) : (
        <p className="text-gray-500">No posts available.</p>
      )}
    </div>
  );
}

export default UserPosts;
