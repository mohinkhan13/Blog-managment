import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    try {
      const redirect = await login(formData.email, formData.password);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        navigate(redirect || "/");
      }, 2000);
    } catch (err) {
      setError(
        err.error ||
          err.detail ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="relative w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <Link
          to="/"
          className="absolute p-1 rounded-full top-4 right-4 hover:bg-gray-100"
        >
          <i className="text-xl text-gray-500 ri-close-line hover:text-gray-700"></i>
        </Link>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>
        {error && <p className="text-center text-red-500">{error}</p>}
        {success && <p className="text-center text-green-500">{success}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isLoading ? "Loading..." : "Sign in"}
          </button>
        </form>
        <div>
          <p>
            Already have Account{" "}
            <Link to={"/signup"} className="font-semibold text-blue-700">
              signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
