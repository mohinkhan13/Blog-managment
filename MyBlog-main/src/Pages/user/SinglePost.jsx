import React, { useEffect, useRef, useMemo, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import PostHeader from "../../Components/user/singlepost/PostHeader";
import PostContent from "../../Components/user/singlepost/PostContent";
import PostActions from "../../Components/user/singlepost/PostActions";
import CommentSection from "../../Components/user/singlepost/CommentSection";

function SinglePost() {
  const { slug } = useParams();
  const { posts, loading, error } = useSelector((state) => state.data);
  const errorRef = useRef(null);
  const [postStats, setPostStats] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState({});
  const { user, tokens } = useContext(AuthContext);
  const hasUpdatedViews = useRef(false);
  const hasLoggedPost = useRef(false); // To log Post Found only once
  const hasLoggedStats = useRef(false); // To log stats fetch only once
  const hasLoggedComments = useRef(false); // To log comments fetch only once

  useEffect(() => {
    window.scrollTo(0, 0);
    if (error) errorRef.current?.focus();
  }, [error]);

  const post = useMemo(() => {
    const foundPost = posts.find((p) => p.slug === slug);
    if (!hasLoggedPost.current) {
      console.log("Post Found:", foundPost);
      hasLoggedPost.current = true;
    }
    return foundPost;
  }, [posts, slug]);

  // Fetch Post Stats and Update Views
  useEffect(() => {
    if (!post) {
      if (!hasLoggedStats.current) {
        console.log("Skipping fetch - Post missing");
        hasLoggedStats.current = true;
      }
      return;
    }

    const fetchAndUpdateStats = async () => {
      const config = tokens?.access
        ? { headers: { Authorization: `Bearer ${tokens?.access}` } }
        : {};
      if (!hasLoggedStats.current) {
        console.log("Config for API:", config);
        console.log("Fetching stats for post ID:", post.id);
      }

      try {
        const statsRes = await axios.get(
          `http://127.0.0.1:8000/api/post-stats/?post=${post.id}`,
          config
        );
        if (!hasLoggedStats.current) {
          console.log("Stats Response:", statsRes.data);
          hasLoggedStats.current = true;
        }
        const correctStats = statsRes.data.find(
          (stat) => stat.post.id === post.id
        );

        if (correctStats) {
          console.log("Initial Stats from Backend:", correctStats);
          setPostStats(correctStats);
          setIsLiked(user && correctStats.liked_by.includes(user.id));

          if (!hasUpdatedViews.current) {
            console.log("Updating views - Current Views:", correctStats.views);
            const updatedStats = await updateViews(
              correctStats.id,
              correctStats.views,
              config
            );
            if (updatedStats) {
              console.log("Updated Stats after Increment:", updatedStats);
              setPostStats(updatedStats);
            } else {
              console.warn("Views update failed, keeping original stats.");
              setPostStats(correctStats);
            }
            hasUpdatedViews.current = true;
          } else {
            console.log("Views already updated this session");
          }
        } else {
          console.warn("No stats found, creating new stats...");
          const newStats = await createPostStats(post.id, config);
          if (newStats) {
            console.log("Newly Created Stats:", newStats);
            setPostStats(newStats);
          } else {
            console.warn("Failed to create stats, setting default.");
            setPostStats({ post: post.id, views: 0, likes: 0, liked_by: [] });
          }
        }
      } catch (err) {
        console.error(
          "Error fetching/updating stats:",
          err.response?.data || err.message
        );
        setPostStats({ post: post.id, views: 0, likes: 0, liked_by: [] });
      }
    };

    fetchAndUpdateStats();
  }, [post, user, tokens]);

  // Fetch Comments and Replies
  useEffect(() => {
    if (!post) {
      if (!hasLoggedComments.current) {
        console.log("Skipping comments fetch - Post missing");
        hasLoggedComments.current = true;
      }
      return;
    }

    const fetchCommentsAndReplies = async () => {
      try {
        if (!hasLoggedComments.current) {
          console.log("Fetching comments for post ID:", post.id);
        }
        const commentRes = await axios.get(
          `http://127.0.0.1:8000/api/comments/?post=${post.id}`
        );
        if (!hasLoggedComments.current) {
          console.log("Comments Response:", commentRes.data);
          hasLoggedComments.current = true;
        }
        const filteredComments = commentRes.data.filter(
          (comment) => comment.post === post.id
        );

        const commentsWithReplies = await Promise.all(
          filteredComments.map(async (comment) => {
            const replyRes = await axios.get(
              `http://127.0.0.1:8000/api/replies/?comment=${comment.id}`
            );
            console.log(`Replies for comment ${comment.id}:`, replyRes.data);
            return { ...comment, replies: replyRes.data || [] };
          })
        );

        setComments(commentsWithReplies);
      } catch (err) {
        console.error(
          "Error fetching comments and replies:",
          err.response?.data || err.message
        );
      }
    };

    fetchCommentsAndReplies();
  }, [post]);

  const updateViews = async (postStatsId, currentViews, config) => {
    try {
      const res = await axios.patch(
        `http://127.0.0.1:8000/api/post-stats/${postStatsId}/`,
        { views: currentViews + 1 },
        config
      );
      console.log("PATCH Response:", res.data);
      return res.data;
    } catch (err) {
      console.error("Error updating views:", err.response?.data || err.message);
      return null;
    }
  };

  const createPostStats = async (postId, config) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/post-stats/`,
        { post: postId, views: 1, likes: 0, liked_by: [] },
        config
      );
      console.log("POST Response:", res.data);
      return res.data;
    } catch (err) {
      console.error(
        "Error creating post stats:",
        err.response?.data || err.message
      );
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-900 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-gray-50"
        ref={errorRef}
        tabIndex={-1}
      >
        <p className="text-lg font-medium text-red-500 animate-fade">
          {error || "Something went wrong!"}
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-red-500 animate-fade">
          Post not found
        </p>
      </div>
    );
  }

  return (
    <section className="max-w-4xl px-4 mx-auto my-12 transition-shadow duration-500 bg-white shadow-md sm:px-6 lg:px-8 rounded-2xl hover:shadow-lg">
      <div className="py-8 space-y-8">
        <PostHeader post={post} />
        <PostContent post={post} postStats={postStats} />
        <PostActions
          postStats={postStats}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          setPostStats={setPostStats}
        />
        <CommentSection
          post={post}
          comments={comments}
          setComments={setComments}
          newComment={newComment}
          setNewComment={setNewComment}
          replyContent={replyContent}
          setReplyContent={setReplyContent}
        />
      </div>
    </section>
  );
}

export default SinglePost;
