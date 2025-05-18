import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("tokens")
          ? JSON.parse(localStorage.getItem("tokens")).access
          : null;
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const response = await axios.get(
          `http://127.0.0.1:8000/api/users/${id}/`,
          config
        );
        console.log("Fetched User Data:", response.data);
        setUserData({ ...response.data, password: "" }); // Add password field as empty
      } catch (err) {
        setError("Failed to fetch user data");
        console.error(
          "Error fetching user:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare payload, exclude read-only fields
    const payload = {
      fname: userData.fname,
      lname: userData.lname,
      email: userData.email,
      password: userData.password || undefined, // Send undefined if empty
      is_superuser: userData.is_superuser,
      is_admin: userData.is_admin,
      is_staff: userData.is_staff,
    };

    try {
      const token = localStorage.getItem("tokens")
        ? JSON.parse(localStorage.getItem("tokens")).access
        : null;
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      console.log("Submitting User Data:", payload);
      const response = await axios.put(
        `http://127.0.0.1:8000/api/users/${id}/`,
        payload,
        config
      );
      console.log("Update Response:", response.data);
      navigate("/admin/users");
    } catch (err) {
      const errorMessage = err.response?.data
        ? JSON.stringify(err.response.data)
        : "Failed to update user";
      setError(errorMessage);
      console.error("Error updating user:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Cancel
  const handleCancel = () => {
    navigate("/admin/users");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-gray-900 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-medium text-red-500 animate-fade">
          {error || "User data not available"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 sm:px-6 lg:px-8">
      <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit User</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="fname"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="fname"
              name="fname"
              value={userData.fname}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="lname"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lname"
              name="lname"
              value={userData.lname}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password (Leave blank to keep unchanged)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password || ""}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_superuser"
              name="is_superuser"
              checked={userData.is_superuser}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor="is_superuser"
              className="block ml-2 text-sm text-gray-900"
            >
              Superuser Role
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_admin"
              name="is_admin"
              checked={userData.is_admin}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor="is_admin"
              className="block ml-2 text-sm text-gray-900"
            >
              Admin Role
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_staff"
              name="is_staff"
              checked={userData.is_staff}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor="is_staff"
              className="block ml-2 text-sm text-gray-900"
            >
              Staff Role
            </label>
          </div>

          {error && (
            <p className="text-sm text-red-500 animate-fade">{error}</p>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
