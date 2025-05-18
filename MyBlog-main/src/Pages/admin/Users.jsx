import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();

  // Fetch Users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("tokens")
          ? JSON.parse(localStorage.getItem("tokens")).access
          : null;
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const response = await axios.get(
          "http://127.0.0.1:8000/api/users/",
          config
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.fname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Delete User (Placeholder function)
  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // API call to delete user
      console.log(`Deleting user with ID: ${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-gray-900 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col items-center justify-between mb-6 sm:flex-row">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <div className="mt-4 sm:mt-0">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none sm:w-64 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-700">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {user.fname} {user.lname}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(user.joined_on).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {user.is_superuser ? "Admin" : "User"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        <button
                          className="mr-4 text-indigo-600 hover:text-indigo-800"
                          onClick={() =>
                            navigate(`/admin/users/edit/${user.id}`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
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
