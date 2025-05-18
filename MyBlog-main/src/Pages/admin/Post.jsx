import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios"; // For consistent API calls

export default function Post() {
  const { posts, loading, error } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const postsPerPage = 10;

  // Fetch posts on mount
  // useEffect(() => {
  //   dispatch(fetchData());
  // }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("tokens")
        ? JSON.parse(localStorage.getItem("tokens")).access
        : null;
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const response = await axios.delete(
        `http://127.0.0.1:8000/api/posts/${id}/`,
        config
      );
      if (response.status === 204) {
        dispatch(fetchData()); // Refresh posts after delete
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Something went wrong while deleting the post!");
    }
  };

  // Filter Posts
  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort Posts
  const sortedPosts = React.useMemo(() => {
    let sortablePosts = [...filteredPosts];
    if (sortConfig.key) {
      sortablePosts.sort((a, b) => {
        let aValue = a[sortConfig.key] || "";
        let bValue = b[sortConfig.key] || "";
        if (sortConfig.key === "created_at") {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (sortConfig.key === "author") {
          aValue = a.author ? `${a.author.fname} ${a.author.lname}` : "N/A";
          bValue = b.author ? `${b.author.fname} ${b.author.lname}` : "N/A";
        }
        return sortConfig.direction === "asc"
          ? aValue > bValue
            ? 1
            : -1
          : aValue < bValue
          ? 1
          : -1;
      });
    }
    return sortablePosts;
  }, [filteredPosts, sortConfig]);

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-10 h-10 border-2 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-600 animate-fade">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center justify-between mb-8 sm:flex-row">
          <h1 className="text-2xl font-semibold text-gray-900">Posts</h1>
          <div className="flex mt-4 space-x-4 sm:mt-0">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 border border-gray-200 rounded-md sm:w-64 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Link
              to="/admin/addpost"
              className="px-4 py-2 font-semibold text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Add Post
            </Link>
          </div>
        </div>

        {/* Posts Table */}
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-indigo-600">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    ID
                  </th>
                  <th
                    onClick={() => handleSort("title")}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase cursor-pointer hover:text-indigo-200"
                  >
                    Title{" "}
                    {sortConfig.key === "title"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    onClick={() => handleSort("categoryName")}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase cursor-pointer hover:text-indigo-200"
                  >
                    Category{" "}
                    {sortConfig.key === "categoryName"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    onClick={() => handleSort("status")}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase cursor-pointer hover:text-indigo-200"
                  >
                    Status{" "}
                    {sortConfig.key === "status"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    onClick={() => handleSort("author")}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase cursor-pointer hover:text-indigo-200"
                  >
                    Author{" "}
                    {sortConfig.key === "author"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    onClick={() => handleSort("created_at")}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase cursor-pointer hover:text-indigo-200"
                  >
                    Date{" "}
                    {sortConfig.key === "created_at"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="transition-colors duration-150 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {post.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-wrap">
                      {post.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-wrap">
                      {post.categoryName || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          post.status === "publish"
                            ? "bg-green-100 text-green-800"
                            : post.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-wrap">
                      {post.author
                        ? `${post.author.fname} ${post.author.lname}`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <Link
                        to={`/admin/editpost/${post.id}`}
                        className="px-4 py-2 font-semibold text-white transition-colors bg-teal-500 rounded-md hover:bg-teal-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="px-4 py-2 font-semibold text-white transition-colors bg-red-700 rounded-md hover:bg-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-gray-600 bg-gray-100 rounded-md hover:bg-indigo-100 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-gray-600 bg-gray-100 rounded-md hover:bg-indigo-100 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
