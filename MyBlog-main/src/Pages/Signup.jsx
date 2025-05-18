import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import authApi from "../api/authApi";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!formData.email.includes("@") || !formData.email.endsWith(".com")) {
      setError("Invalid email format");
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const registerData = await authApi.registerUser({
        fname: formData.firstName,
        lname: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      const loginData = await login(formData.email, formData.password);
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => {
        navigate(loginData.redirect || "/");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.error || err.message || err.detail || "Signup failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="relative w-full max-w-lg p-8 mx-auto space-y-6 bg-white rounded-lg shadow-xl">
        <Link
          to="/"
          className="absolute p-1 rounded-full top-4 right-4 hover:bg-gray-100"
        >
          <i className="text-xl text-gray-500 ri-close-line hover:text-gray-700"></i>
        </Link>
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Create Your Account
          </h1>
          <p className="text-gray-600">Start your blogging journey</p>
        </div>
        {error && <p className="text-center text-red-500">{error}</p>}
        {success && <p className="text-center text-green-500">{success}</p>}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              id="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              id="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <input
            type="email"
            id="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isLoading ? "Loading..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
