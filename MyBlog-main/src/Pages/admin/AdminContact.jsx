import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminContact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const contactsPerPage = 10;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("tokens")
          ? JSON.parse(localStorage.getItem("tokens")).access
          : null;
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const response = await axios.get(
          "http://127.0.0.1:8000/api/contacts/",
          config
        );
        setContacts(response.data);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch contact requests";
        setError(errorMessage);
        console.error(
          "Error fetching contacts:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Filter Contacts based on search query
  const filteredContacts = contacts.filter((contact) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      contact.name?.toLowerCase().includes(searchLower) ||
      contact.email?.toLowerCase().includes(searchLower) ||
      contact.subject?.toLowerCase().includes(searchLower)
    );
  });

  // Sorting Logic
  const sortedContacts = React.useMemo(() => {
    let sortableContacts = [...filteredContacts];
    if (sortConfig.key) {
      sortableContacts.sort((a, b) => {
        let aValue = a[sortConfig.key] || "";
        let bValue = b[sortConfig.key] || "";
        if (sortConfig.key === "created_at") {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
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
    return sortableContacts;
  }, [filteredContacts, sortConfig]);

  // Pagination Logic
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = sortedContacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );
  const totalPages = Math.ceil(sortedContacts.length / contactsPerPage);

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
          <h1 className="text-2xl font-semibold text-gray-900">
            Contact Requests
          </h1>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 mt-4 text-gray-700 placeholder-gray-400 border border-gray-200 rounded-md sm:mt-0 sm:w-64 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Contacts Table */}
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-indigo-600">
                <tr>
                  <th
                    onClick={() => handleSort("name")}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase cursor-pointer hover:text-indigo-200"
                  >
                    Name{" "}
                    {sortConfig.key === "name"
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
                    onClick={() => handleSort("subject")}
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase cursor-pointer hover:text-indigo-200"
                  >
                    Subject{" "}
                    {sortConfig.key === "subject"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
                    Message
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentContacts.length > 0 ? (
                  currentContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="transition-colors duration-150 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {contact.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {contact.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {contact.subject}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {contact.message.length > 50
                          ? `${contact.message.substring(0, 50)}...`
                          : contact.message}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No contact requests found
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

export default AdminContact;
