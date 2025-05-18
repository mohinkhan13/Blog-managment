import { useEffect, useState } from "react";

function PostOfTheDay() {
  const [postStats, setPostStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Post of the Week
  const fetchPostStats = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/post-stats/post_of_the_week/"
      );
      if (!res.ok) {
        throw new Error("Failed to fetch post stats");
      }
      const data = await res.json();
      setPostStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostStats();
  }, []);

  // Strip HTML tags from content
  const stripHtml = (html) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  if (loading) {
    return (
      <div className="bg-[#a3a7dc1d] py-10 md:py-20 text-center text-black">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#a3a7dc1d] py-10 md:py-20 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!postStats || !postStats.post) {
    return (
      <div className="bg-[#a3a7dc1d] py-10 md:py-20 text-center text-black">
        No post available
      </div>
    );
  }

  const { post } = postStats;

  return (
    <div className="bg-[#a3a7dc1d] flex justify-center py-10 md:py-20">
      <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 rounded-lg w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] ">
        {/* Left Side Content */}
        <div className="flex flex-col gap-4 w-full md:w-[50%] text-center md:text-left">
          <p className="bg-[#a3a7dc28] w-fit text-blue-700 px-4 md:px-5 py-1.5 hover:bg-[#d2d3d95f] transition-all duration-200 cursor-pointer rounded font-bold mx-auto md:mx-0">
            Blog Of the Day
          </p>
          <div className="min-h-[60px] md:min-h-[80px]">
            <h2 className="text-2xl font-extrabold leading-tight text-black sm:text-3xl md:text-4xl lg:text-4xl">
              {post.title}
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 md:gap-6 mt-2 [&>div>i]:text-lg md:[&>div>i]:text-xl [&>div>p]:text-black [&>div>p]:font-semibold [&>div>i]:text-blue-700">
            <div className="flex items-center justify-center space-x-2 md:justify-start">
              <i className="ri-user-line"></i>
              <p className="truncate max-w-[200px]">
                {typeof post.author === "object"
                  ? post.author.fname
                  : post.author || "Unknown"}
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 md:justify-start">
              <i className="ri-folder-line"></i>
              <p className="truncate max-w-[200px]">
                {post.categoryName || "Uncategorized"}
              </p>
            </div>
          </div>
          <p className="w-full mt-4 text-sm text-justify text-gray-800 md:text-base line-clamp-3">
            {stripHtml(post.content) || "No description available"}
          </p>
          <a
            href={`/${post.slug}`} // Assuming post has an id field
            className="inline-block px-4 py-2 mx-auto mt-4 text-white transition-all duration-200 bg-blue-800 rounded-md md:mt-6 md:px-5 w-fit hover:bg-blue-700 md:mx-0"
          >
            Read More
          </a>
        </div>
        {/* Right Side Image */}
        <div className="w-full md:w-[50%] mt-6 md:mt-0 flex justify-center">
          <div className="relative w-[80%] max-w-[400px] aspect-square">
            <img
              src={post.image || "https://placehold.co/400x400"}
              className="object-cover w-full h-full shadow-md rounded-3xl"
              alt={post.title}
              onError={(e) => {
                e.target.src = "https://placehold.co/400x400";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostOfTheDay;
