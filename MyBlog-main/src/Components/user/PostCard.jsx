import React from "react";
import { Link } from "react-router-dom";

function PostCard({ post }) {
  if (!post) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <div className="w-full max-w-[390px]">
        <div>
          <img
            src={post.image || "https://placehold.co/600x400"}
            alt="Post thumbnail"
            className="object-cover w-full bg-center bg-cover rounded-t-2xl max-h-[300px] min-h-[300px]"
          />
        </div>
        <div className="flex flex-col gap-5 px-6 py-6 bg-white shadow md:px-8">
          <p className="bg-[#a3a7dc28] w-fit text-blue-700 px-2 py-1 hover:bg-[#a3a7dc5f] transition-all duration-200 cursor-pointer rounded font-bold mx-auto md:mx-0">
            {post.categoryName}
          </p>
          <Link
            to={`/${post.slug}`}
            className="text-xl font-bold transition-all duration-200 md:text-1xl line-clamp-3 hover:text-blue-700 min-h-[80px] max-h-[80px]"
          >
            {post.title}
          </Link>
          <div className="flex flex-col justify-start gap-4 text-sm md:flex-row md:gap-10 md:text-base">
            <div className="flex items-center space-x-2">
              <i className="ri-user-line"></i>
              <p>
                {typeof post.author === "object"
                  ? post.author.fname
                  : post.author || "Unknown"}
              </p>
            </div>
            <p>{new Date(post.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostCard;
