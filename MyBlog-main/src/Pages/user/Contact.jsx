import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Contact = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    user: user ? user.id : null,
    name: user ? `${user.fname} ${user.lname}` : "",
    email: user ? user.email : "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        user: user.id,
        name: `${user.fname} ${user.lname}`,
        email: user.email,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    if (!formData.name.trim()) {
      setError("Name field is required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Message sent successfully!");
        setShowForm(false);
        setTimeout(() => {
          setShowForm(true);
          setFormData({
            user: user ? user.id : null,
            name: user ? `${user.fname} ${user.lname}` : "",
            email: user ? user.email : "",
            subject: "",
            message: "",
          });
          setSuccess(null);
        }, 5000);
      } else {
        setError(data.name ? data.name[0] : "Failed to send message.");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-6xl px-4 mx-auto my-16 sm:px-6 lg:px-8">
      <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
        {/* Image Section */}
        <div className="relative overflow-hidden shadow-md rounded-2xl">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
            alt="Contact"
            className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Form Section */}
        <div className="p-8 transition-shadow duration-500 bg-white shadow-md rounded-2xl hover:shadow-lg">
          {showForm ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <h1 className="font-serif text-3xl font-medium tracking-wide text-gray-900">
                  Contact Us
                </h1>
                <p className="mt-2 text-base leading-relaxed text-gray-500">
                  We’d love to hear from you. Drop us a message!
                </p>
              </div>

              {error && (
                <p className="text-sm text-center text-red-500 animate-fadeIn">
                  {error}
                </p>
              )}

              <div className="space-y-4">
                <input
                  className="w-full px-5 py-3 text-gray-800 placeholder-gray-400 transition-all duration-300 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent disabled:bg-gray-50"
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={!!user}
                />
                <input
                  className="w-full px-5 py-3 text-gray-800 placeholder-gray-400 transition-all duration-300 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent disabled:bg-gray-50"
                  type="email"
                  name="email"
                  placeholder="Your Email *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={!!user}
                />
                <input
                  className="w-full px-5 py-3 text-gray-800 placeholder-gray-400 transition-all duration-300 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
                <textarea
                  className="w-full px-5 py-3 text-gray-800 placeholder-gray-400 transition-all duration-300 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  name="message"
                  rows="5"
                  placeholder="Your Message *"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 font-medium text-white transition-all duration-300 bg-gray-900 rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
                disabled={loading || !user}
              >
                {user ? (
                  loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-4 h-4 text-white animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending
                    </span>
                  ) : (
                    "Send Message"
                  )
                ) : (
                  "Please Login First"
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-center animate-reveal">
              <h2 className="font-serif text-2xl font-medium text-gray-900">
                Message Sent!
              </h2>
              <p className="leading-relaxed text-gray-600">
                Thank you for reaching out. We’ll get back to you soon.
              </p>
              <p className="text-sm text-gray-400">
                Form will reappear in 5 seconds...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes reveal {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-reveal {
          animation: reveal 0.6s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-in forwards;
        }
      `}</style>
    </section>
  );
};

export default Contact;
