import React, { useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong with comments.</h1>;
    }
    return this.props.children;
  }
}

function CommentSection({
  post,
  comments,
  setComments,
  newComment,
  setNewComment,
  replyContent,
  setReplyContent,
}) {
  const { user, tokens } = useContext(AuthContext);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    if (!user || !tokens?.access) {
      alert("Please login to post a comment");
      return;
    }

    const commentData = {
      post: post.id,
      content: newComment,
    };

    console.log("Posting comment data:", commentData); // Debug

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/comments/`,
        commentData,
        {
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        }
      );
      setComments([...comments, { ...res.data, replies: [] }]);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
      const errorMessage = err.response?.data
        ? JSON.stringify(err.response.data)
        : "Unknown error";
      alert(`Failed to post comment: ${errorMessage}`);
    }
  };

  const handleAddReply = async (commentId) => {
    if (!replyContent[commentId]?.trim()) return;

    if (!user || !tokens?.access) {
      alert("Please login to post a reply");
      return;
    }

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/replies/`,
        {
          comment: commentId,
          content: replyContent[commentId],
        },
        {
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        }
      );
      setComments((prevComments) =>
        prevComments.map((c) =>
          c.id === commentId
            ? { ...c, replies: [...(c.replies || []), res.data] }
            : c
        )
      );
      setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
    } catch (err) {
      console.error("Error posting reply:", err);
      alert(
        "Failed to post reply: " +
          (err.response?.data?.detail || "Unknown error")
      );
    }
  };

  return (
    <motion.div
      className="max-w-3xl px-4 py-12 mx-auto bg-white rounded-lg shadow-lg sm:px-6"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      {/* Header */}
      <h2 className="pb-4 mb-8 text-2xl font-bold text-gray-800 border-b border-gray-200 sm:text-3xl">
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      <div className="mb-10">
        <textarea
          className="w-full p-4 transition-all duration-300 border border-gray-200 shadow-sm resize-none bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="4"
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <motion.button
          onClick={handleAddComment}
          className="px-6 py-2 mt-3 font-semibold text-white transition-all duration-300 bg-blue-600 shadow-md rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!newComment.trim()}
        >
          Post Comment
        </motion.button>
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500">
            No comments yet. Be the first!
          </p>
        ) : (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              className="flex gap-4 sm:gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Avatar */}
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 font-semibold text-white rounded-full shadow-md sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-indigo-500">
                {comment.user?.username?.charAt(0) || "U"}
              </div>

              {/* Comment Content */}
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {typeof comment.user === "object"
                    ? comment.user.username
                    : comment.user || "Unknown"}
                </p>
                <span className="text-xs text-gray-400">
                  •{" "}
                  {comment.created_at
                    ? new Date(comment.created_at).toLocaleString()
                    : "Just now"}
                </span>
                <p className="mt-2 leading-relaxed text-gray-700">
                  {comment.content}
                </p>
                <div className="flex items-center gap-4 mt-3 sm:gap-6">
                  <button
                    className="text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700 hover:underline"
                    onClick={() =>
                      setReplyContent({ ...replyContent, [comment.id]: "" })
                    }
                  >
                    Reply
                  </button>
                </div>

                {/* Reply Form */}
                {replyContent[comment.id] !== undefined && (
                  <div className="mt-4 ml-0 sm:ml-6">
                    <textarea
                      className="w-full p-3 transition-all duration-300 border border-gray-200 shadow-sm resize-none bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="2"
                      placeholder="Write a reply..."
                      value={replyContent[comment.id]}
                      onChange={(e) =>
                        setReplyContent({
                          ...replyContent,
                          [comment.id]: e.target.value,
                        })
                      }
                    />
                    <motion.button
                      onClick={() => handleAddReply(comment.id)}
                      className="px-4 py-1 mt-2 font-semibold text-white transition-all duration-300 bg-blue-600 shadow-md rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!replyContent[comment.id]?.trim()}
                    >
                      Post Reply
                    </motion.button>
                  </div>
                )}

                {/* Replies */}
                {comment.replies?.length > 0 && (
                  <div className="pl-4 mt-4 space-y-4 border-l-2 border-gray-200 sm:ml-6">
                    {comment.replies.map((reply) => (
                      <div key={reply.id}>
                        <div className="flex items-center gap-2 mt-1 sm:gap-3">
                          <p className="font-semibold text-gray-700">
                            {typeof reply.user === "object"
                              ? reply.user.username
                              : reply.user || "Unknown"}
                          </p>
                          <span className="text-xs text-gray-400">
                            •{" "}
                            {reply.created_at
                              ? new Date(reply.created_at).toLocaleString()
                              : "Just now"}
                          </span>
                        </div>
                        <p className="mt-1 leading-relaxed text-gray-600">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

export default CommentSection;
