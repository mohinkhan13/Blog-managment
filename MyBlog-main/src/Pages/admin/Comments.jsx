import React, { useState, useEffect } from "react";
import axios from "axios";

function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedComments, setExpandedComments] = useState({});
  const commentsPerPage = 10;

  // Fetch Comments and PostStats from API
  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("tokens")
        ? JSON.parse(localStorage.getItem("tokens")).access
        : null;
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const response = await axios.get(
        "http://127.0.0.1:8000/api/comments/",
        config
      );
      const commentsData = response.data;

      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        commentsData.map(async (comment) => {
          const repliesResponse = await axios.get(
            `http://127.0.0.1:8000/api/replies/?comment=${comment.id}`,
            config
          );
          return { ...comment, replies: repliesResponse.data };
        })
      );

      setComments(commentsWithReplies);
    } catch (err) {
      setError("Failed to fetch comments");
      console.error(
        "Error fetching comments:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Filter Comments based on search query
  const filteredComments = comments.filter((comment) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      comment.content?.toLowerCase().includes(searchLower) ||
      comment.user?.username?.toLowerCase().includes(searchLower) ||
      comment.post?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination Logic
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredComments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Toggle Replies Visibility
  const toggleReplies = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Handle Delete Comment with PostStats Refresh
  const handleDeleteComment = async (commentId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this comment and its replies?"
      )
    ) {
      try {
        const token = localStorage.getItem("tokens")
          ? JSON.parse(localStorage.getItem("tokens")).access
          : null;
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        // Delete the comment
        await axios.delete(
          `http://127.0.0.1:8000/api/comments/${commentId}/`,
          config
        );

        // Refresh comments list
        setComments(comments.filter((comment) => comment.id !== commentId));

        // Optional: Fetch updated PostStats if you want to display it elsewhere
        // const statsResponse = await axios.get("http://127.0.0.1:8000/api/post-stats/", config);
        // console.log("Updated PostStats:", statsResponse.data);
      } catch (err) {
        console.error(
          "Error deleting comment:",
          err.response?.data || err.message
        );
        setError("Failed to delete comment");
      }
    }
  };

  // Handle Delete Reply
  const handleDeleteReply = async (commentId, replyId) => {
    if (window.confirm("Are you sure you want to delete this reply?")) {
      try {
        const token = localStorage.getItem("tokens")
          ? JSON.parse(localStorage.getItem("tokens")).access
          : null;
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        await axios.delete(
          `http://127.0.0.1:8000/api/replies/${replyId}/`,
          config
        );
        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: comment.replies.filter(
                    (reply) => reply.id !== replyId
                  ),
                }
              : comment
          )
        );
      } catch (err) {
        console.error(
          "Error deleting reply:",
          err.response?.data || err.message
        );
        setError("Failed to delete reply");
      }
    }
  };

  // Handle Edit Comment (Placeholder)
  const handleEdit = (commentId) => {
    console.log(`Editing comment with ID: ${commentId}`);
    // Future: Redirect to an EditComment page or open a modal
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
          <h1 className="text-2xl font-semibold text-gray-900">Comments</h1>
          <input
            type="text"
            placeholder="Search comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 mt-4 text-gray-700 placeholder-gray-400 border border-gray-200 rounded-md sm:mt-0 sm:w-64 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Comments Table */}
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-indigo-600">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Username
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Post Title
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Replies
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentComments.length > 0 ? (
                  currentComments.map((comment) => (
                    <React.Fragment key={comment.id}>
                      <tr className="transition-colors duration-150 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                          {comment.content.length > 50
                            ? `${comment.content.substring(0, 50)}...`
                            : comment.content}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {comment.user?.username || "Anonymous"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {comment.post || "Unknown"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          <button
                            onClick={() => toggleReplies(comment.id)}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            {comment.replies?.length || 0}{" "}
                            {expandedComments[comment.id] ? "▲" : "▼"}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          <button
                            onClick={() => handleEdit(comment.id)}
                            className="mr-4 text-indigo-600 hover:text-indigo-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      {expandedComments[comment.id] &&
                        comment.replies?.length > 0 && (
                          <tr className="bg-gray-50">
                            <td colSpan="6" className="px-6 py-4">
                              <div className="ml-8 space-y-2">
                                {comment.replies.map((reply) => (
                                  <div
                                    key={reply.id}
                                    className="flex items-center justify-between py-2 pl-4 border-l-2 border-indigo-200"
                                  >
                                    <div>
                                      <p className="text-sm text-gray-700">
                                        {reply.content.length > 50
                                          ? `${reply.content.substring(
                                              0,
                                              50
                                            )}...`
                                          : reply.content}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        By {reply.user?.username || "Anonymous"}{" "}
                                        on{" "}
                                        {new Date(
                                          reply.created_at
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleDeleteReply(comment.id, reply.id)
                                      }
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No comments found
                    </td>
                  </tr>
                )}
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

export default Comments;
