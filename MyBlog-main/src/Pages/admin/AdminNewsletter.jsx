import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminNewsletter() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const subsPerPage = 10;

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = localStorage.getItem("tokens")
          ? JSON.parse(localStorage.getItem("tokens")).access
          : null;
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const response = await axios.get(
          "http://127.0.0.1:8000/api/newsletter/",
          config
        );
        console.log("Subscriptions Data:", response.data); // Debug
        setSubscriptions(response.data);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Failed to fetch newsletter subscriptions";
        setError(errorMessage);
        console.error(
          "Error fetching subscriptions:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const searchLower = searchQuery.toLowerCase();
    const username = sub.user ? `${sub.user.fname} ${sub.user.lname}` : "N/A";
    return (
      sub.email?.toLowerCase().includes(searchLower) ||
      username.toLowerCase().includes(searchLower)
    );
  });

  const sortedSubscriptions = React.useMemo(() => {
    let sortableSubs = [...filteredSubscriptions];
    if (sortConfig.key) {
      sortableSubs.sort((a, b) => {
        let aValue = a[sortConfig.key] || "";
        let bValue = b[sortConfig.key] || "";
        if (sortConfig.key === "user") {
          aValue = a.user ? `${a.user.fname} ${a.user.lname}` : "N/A";
          bValue = b.user ? `${b.user.fname} ${b.user.lname}` : "N/A";
        } else if (sortConfig.key === "subscribed_at") {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (sortConfig.key === "is_active") {
          aValue = a.is_active ? 1 : 0;
          bValue = b.is_active ? 1 : 0;
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
    return sortableSubs;
  }, [filteredSubscriptions, sortConfig]);

  const indexOfLastSub = currentPage * subsPerPage;
  const indexOfFirstSub = indexOfLastSub - subsPerPage;
  const currentSubs = sortedSubscriptions.slice(
    indexOfFirstSub,
    indexOfLastSub
  );
  const totalPages = Math.ceil(sortedSubscriptions.length / subsPerPage);

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
        <div className="flex flex-col items-center justify-between mb-8 sm:flex-row">
          <h1 className="text-2xl font-semibold text-gray-900">
            Newsletter Subscriptions
          </h1>
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 mt-4 text-gray-700 placeholder-gray-400 border border-gray-200 rounded-md sm:mt-0 sm:w-64 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-indigo-600">
                <tr>
                  <th
                    onClick={() => handleSort("user")}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase cursor-pointer hover:text-indigo-200"
                  >
                    Name{" "}
                    {sortConfig.key === "user"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    onClick={() => handleSort("email")}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase cursor-pointer hover:text-indigo-200"
                  >
                    Email{" "}
                    {sortConfig.key === "email"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    onClick={() => handleSort("is_active")}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase cursor-pointer hover:text-indigo-200"
                  >
                    Status{" "}
                    {sortConfig.key === "is_active"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th
                    onClick={() => handleSort("subscribed_at")}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase cursor-pointer hover:text-indigo-200"
                  >
                    Subscribed Date{" "}
                    {sortConfig.key === "subscribed_at"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentSubs.length > 0 ? (
                  currentSubs.map((sub) => (
                    <tr
                      key={sub.id}
                      className="transition-colors duration-150 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {sub.user
                          ? `${sub.user.fname} ${sub.user.lname}`
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {sub.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            sub.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {sub.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(sub.subscribed_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No newsletter subscriptions found
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

export default AdminNewsletter;
