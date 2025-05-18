import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: { count: 0, growth: 0 },
    posts: { count: 0, growth: 0 },
    comments: { count: 0, growth: 0 },
    views: { count: 0, growth: 0 },
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postData, setPostData] = useState({ labels: [], datasets: [] });

  // Card configurations
  const cardConfigs = [
    { name: "Users", icon: "ri-user-line", color: "#48b4d5", key: "users" },
    { name: "Posts", icon: "ri-article-line", color: "#FFB200", key: "posts" },
    {
      name: "Comments",
      icon: "ri-chat-3-line",
      color: "#2D336B",
      key: "comments",
    },
    { name: "Views", icon: "ri-eye-line", color: "#FF0000", key: "views" },
  ];

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("tokens")
          ? JSON.parse(localStorage.getItem("tokens")).access
          : null;
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const [usersRes, postsRes, commentsRes, postStatsRes] =
          await Promise.all([
            axios.get("http://127.0.0.1:8000/api/users/", config),
            axios.get("http://127.0.0.1:8000/api/posts/", config),
            axios.get("http://127.0.0.1:8000/api/comments/", config),
            axios.get("http://127.0.0.1:8000/api/post-stats/", config),
          ]);

        const totalViews = postStatsRes.data.reduce(
          (acc, stat) => acc + (stat.views || 0),
          0
        );

        // Dummy last month data (replace with real backend API if available)
        const lastMonthStats = {
          users: Math.floor(usersRes.data.length * 0.95), // 5% less as dummy
          posts: Math.floor(postsRes.data.length * 0.95),
          comments: Math.floor(commentsRes.data.length * 0.95),
          views: Math.floor(totalViews * 0.95),
        };

        const calculateGrowth = (current, last) => {
          if (last === 0) return 0;
          return (((current - last) / last) * 100).toFixed(1);
        };

        setStats({
          users: {
            count: usersRes.data.length,
            growth: calculateGrowth(usersRes.data.length, lastMonthStats.users),
          },
          posts: {
            count: postsRes.data.length,
            growth: calculateGrowth(postsRes.data.length, lastMonthStats.posts),
          },
          comments: {
            count: commentsRes.data.length,
            growth: calculateGrowth(
              commentsRes.data.length,
              lastMonthStats.comments
            ),
          },
          views: {
            count: totalViews,
            growth: calculateGrowth(totalViews, lastMonthStats.views),
          },
        });

        // Recent Posts (latest 5)
        const sortedPosts = postsRes.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        const recentPostsWithViews = sortedPosts.map((post) => ({
          ...post,
          views:
            postStatsRes.data.find((stat) => stat.post === post.id)?.views || 0,
        }));
        setRecentPosts(recentPostsWithViews);

        // Chart data for posts and views (top 5)
        const labels = sortedPosts.map(
          (post) => post.title.substring(0, 20) + "..."
        );
        const viewsData = recentPostsWithViews.map((post) => post.views);
        setPostData({
          labels,
          datasets: [
            {
              label: "Views",
              data: viewsData,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        setError("Failed to fetch dashboard data");
        console.error(
          "Error fetching dashboard data:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { color: "#6B7280" },
      },
      x: { grid: { display: false }, ticks: { color: "#6B7280" } },
    },
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
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Overview of your blog's performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          {cardConfigs.map((card) => (
            <div
              key={card.name}
              className="flex items-center justify-between p-6 transition-transform bg-white rounded-lg shadow-sm hover:scale-105"
            >
              <div>
                <p className="text-sm text-gray-500">{card.name}</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {stats[card.key].count}
                </p>
                <p className="flex items-center gap-1 mt-1 text-xs text-green-600">
                  <i
                    className={`ri-arrow-${
                      stats[card.key].growth >= 0 ? "up" : "down"
                    }-line ${
                      stats[card.key].growth >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  ></i>
                  <span
                    className={
                      stats[card.key].growth >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {Math.abs(stats[card.key].growth)}%
                  </span>
                  <span className="text-gray-500">Since Last Month</span>
                </p>
              </div>
              <div
                className="flex items-center justify-center w-12 h-12 text-xl text-white rounded-full"
                style={{ backgroundColor: card.color }}
              >
                <i className={card.icon}></i>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Posts */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Recent Posts
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-indigo-600 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-indigo-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-indigo-600 uppercase">
                    Views
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {recentPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="transition-colors duration-150 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                      {post.title.length > 30
                        ? `${post.title.substring(0, 30)}...`
                        : post.title}
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
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {post.views}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart Section */}
        <div className="p-6 mt-8 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Recent Post Views
          </h2>
          <div className="h-64">
            <Bar data={postData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
