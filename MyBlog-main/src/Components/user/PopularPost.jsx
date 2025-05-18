import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import PostCard from "./PostCard";

function PopularPost() {
  const { posts, loading, error } = useSelector((state) => state.data);

  // Limit the number of posts to 6 for the "Popular Posts" section
  const popularPosts = useMemo(() => posts.slice(0, 6), [posts]);

  if (loading) {
    return (
      <div className="flex flex-col w-full gap-10 px-4 py-8 md:py-10 md:px-30 bg-gray-50">
        <h1 className="text-2xl font-bold text-center md:text-3xl">
          Popular Posts
        </h1>
        <div className="grid justify-center grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array(6)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                className="w-full bg-gray-200 rounded-lg h-80 animate-pulse"
              />
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full gap-10 px-4 py-8 md:py-10 md:px-30 bg-gray-50">
        <h1 className="text-2xl font-bold text-center md:text-3xl">
          Popular Posts
        </h1>
        <div className="py-8 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-10 px-4 py-8 md:py-10 md:px-30 bg-gray-50">
      <div>
        <h1 className="text-2xl font-bold text-center md:text-3xl">
          Popular Posts
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {popularPosts.length > 0 ? (
          popularPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No popular posts available.
          </p>
        )}
      </div>
    </div>
  );
}

export default PopularPost;
