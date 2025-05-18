import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function PostStats() {
  const [stats, setStats] = useState([]);
  const [postOfTheWeek, setPostOfTheWeek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const statsPerPage = 10;

  // Fetch Post Stats and Post of the Week
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("tokens")
          ? JSON.parse(localStorage.getItem("tokens")).access
          : null;
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const statsResponse = await axios.get(
          "http://127.0.0.1:8000/api/post-stats/",
          config
        );
        setStats(statsResponse.data);

        const potwResponse = await axios.get(
          "http://127.0.0.1:8000/api/post-stats/post_of_the_week/",
          config
        );
        setPostOfTheWeek(potwResponse.data);
      } catch (err) {
        setError("Failed to fetch post stats");
        console.error(
          "Error fetching data:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Stats
  const filteredStats = stats.filter((stat) =>
    stat.post?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting Logic
  const sortedStats = React.useMemo(() => {
    let sortableStats = [...filteredStats];
    if (sortConfig.key) {
      sortableStats.sort((a, b) => {
        let aValue = a[sortConfig.key] || 0;
        let bValue = b[sortConfig.key] || 0;
        if (sortConfig.key === "post") {
          aValue = a.post?.title || "";
          bValue = b.post?.title || "";
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
    return sortableStats;
  }, [filteredStats, sortConfig]);

  // Pagination Logic
  const indexOfLastStat = currentPage * statsPerPage;
  const indexOfFirstStat = indexOfLastStat - statsPerPage;
  const currentStats = sortedStats.slice(indexOfFirstStat, indexOfLastStat);
  const totalPages = Math.ceil(sortedStats.length / statsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Total Stats
  const totalStats = React.useMemo(() => {
    return stats.reduce(
      (acc, stat) => ({
        views: acc.views + (stat.views || 0),
        likes: acc.likes + (stat.likes || 0),
        comments: acc.comments + (stat.comments || 0),
        shares: acc.shares + (stat.shares || 0),
      }),
      { views: 0, likes: 0, comments: 0, shares: 0 }
    );
  }, [stats]);

  // Chart Data
  const barChartData = {
    labels: currentStats.map((stat) => stat.post?.title || "Unknown"),
    datasets: [
      {
        label: "Views",
        data: currentStats.map((stat) => stat.views || 0),
        backgroundColor: "rgba(99, 102, 241, 0.5)", // Indigo-600 with opacity
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
      },
      {
        label: "Likes",
        data: currentStats.map((stat) => stat.likes || 0),
        backgroundColor: "rgba(147, 197, 253, 0.5)", // Light Blue-300 with opacity
        borderColor: "rgba(147, 197, 253, 1)",
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: ["Views", "Likes", "Comments", "Shares"],
    datasets: [
      {
        data: [
          totalStats.views,
          totalStats.likes,
          totalStats.comments,
          totalStats.shares,
        ],
        backgroundColor: [
          "rgba(99, 102, 241, 0.7)", // Indigo-600
          "rgba(147, 197, 253, 0.7)", // Light Blue-300
          "rgba(167, 139, 250, 0.7)", // Violet-400
          "rgba(196, 181, 253, 0.7)", // Purple-300
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Minimal look
      tooltip: { backgroundColor: "#4B5563", borderRadius: 8 }, // Gray-600 tooltip
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { color: "#6B7280" },
      }, // Gray-500
      x: { grid: { display: false }, ticks: { color: "#6B7280" } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#6B7280", font: { size: 12 } },
      },
      tooltip: { backgroundColor: "#4B5563", borderRadius: 8 },
    },
    cutout: "70%", // Thinner ring for minimal look
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
    <div className="min-h-screen px-6 py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <h1 className="text-2xl font-semibold text-gray-900">
            Post Analytics
          </h1>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 mt-4 text-gray-700 placeholder-gray-400 border border-gray-200 rounded-md sm:mt-0 sm:w-64 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Post of the Week */}
        {postOfTheWeek && (
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="mb-4 text-lg font-medium text-gray-900">
              Post of the Week
            </h2>
            <div className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6">
              <div className="flex-1">
                <p className="text-base font-semibold text-gray-800">
                  {postOfTheWeek.post?.title}
                </p>
                <p className="text-sm text-gray-500">
                  By {postOfTheWeek.post?.author?.username || "Unknown"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-gray-500">Views</p>
                  <p className="text-base font-semibold text-indigo-600">
                    {postOfTheWeek.views}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Likes</p>
                  <p className="text-base font-semibold text-indigo-600">
                    {postOfTheWeek.likes}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Comments</p>
                  <p className="text-base font-semibold text-indigo-600">
                    {postOfTheWeek.comments}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Shares</p>
                  <p className="text-base font-semibold text-indigo-600">
                    {postOfTheWeek.shares}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Total Stats with Doughnut Chart */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Engagement Overview
          </h2>
          <div className="flex flex-col items-center space-y-6 lg:flex-row lg:space-y-0 lg:space-x-6">
            <div className="w-full h-48 lg:w-1/3">
              <Doughnut data={doughnutChartData} options={doughnutOptions} />
            </div>
            <div className="grid w-full grid-cols-2 gap-4 lg:w-2/3">
              <div>
                <p className="text-xs text-gray-500">Total Views</p>
                <p className="text-base font-semibold text-gray-800">
                  {totalStats.views}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Likes</p>
                <p className="text-base font-semibold text-gray-800">
                  {totalStats.likes}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Comments</p>
                <p className="text-base font-semibold text-gray-800">
                  {totalStats.comments}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Shares</p>
                <p className="text-base font-semibold text-gray-800">
                  {totalStats.shares}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Table with Bar Chart */}
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="mb-4 text-lg font-medium text-gray-900">
              Post Performance
            </h2>
            <div className="h-64 mb-6">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => handleSort("post")}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 uppercase cursor-pointer hover:text-indigo-600"
                  >
                    Post Title{" "}
                    {sortConfig.key === "post"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    onClick={() => handleSort("views")}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 uppercase cursor-pointer hover:text-indigo-600"
                  >
                    Views{" "}
                    {sortConfig.key === "views"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    onClick={() => handleSort("likes")}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 uppercase cursor-pointer hover:text-indigo-600"
                  >
                    Likes{" "}
                    {sortConfig.key === "likes"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    onClick={() => handleSort("comments")}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 uppercase cursor-pointer hover:text-indigo-600"
                  >
                    Comments{" "}
                    {sortConfig.key === "comments"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    onClick={() => handleSort("shares")}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 uppercase cursor-pointer hover:text-indigo-600"
                  >
                    Shares{" "}
                    {sortConfig.key === "shares"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-600 uppercase">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentStats.length > 0 ? (
                  currentStats.map((stat) => {
                    const engagementScore = (
                      0.2 * (stat.views || 0) +
                      0.3 * (stat.likes || 0) +
                      0.3 * (stat.comments || 0) +
                      0.2 * (stat.shares || 0)
                    ).toFixed(2);
                    return (
                      <tr
                        key={stat.id}
                        className="transition-colors duration-150 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                          {stat.post?.title || "Unknown"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {stat.views || 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {stat.likes || 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {stat.comments || 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {stat.shares || 0}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-indigo-600 whitespace-nowrap">
                          {engagementScore}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No post stats found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
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

export default PostStats;
