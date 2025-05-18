import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const NewsletterUpdate = () => {
  const { user } = useContext(AuthContext);
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkSubscription = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/newsletter/`);
        const data = await response.json();
        const isAlreadySubscribed = data.some(
          (entry) => entry.email === user.email
        );
        setIsSubscribed(isAlreadySubscribed);
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    };
    checkSubscription();
  }, [user]);

  const handleChange = (e) => setEmail(e.target.value);

  const handleSubscribe = async () => {
    if (!user) return; // Prevent action if user is not logged in

    if (!email.trim()) {
      setMessage("Please enter a valid email!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/newsletter/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, user: user?.id || null }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setShowCongrats(true);
        setTimeout(() => setShowCongrats(false), 4000);
        setMessage("");
      } else {
        const data = await response.json();
        setMessage(data.email ? data.email[0] : "Failed to subscribe!");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-[60vh] bg-gradient-to-b from-white to-gray-100 py-16">
      <div className="w-full max-w-md p-8 transition-shadow duration-500 bg-white shadow-md rounded-2xl hover:shadow-lg">
        {showCongrats ? (
          <div className="space-y-4 text-center animate-reveal">
            <h2 className="font-serif text-3xl font-medium text-gray-900">
              Subscription Confirmed
            </h2>
            <p className="leading-relaxed text-gray-600">
              You’re now part of our exclusive updates. Stay tuned!
            </p>
          </div>
        ) : isSubscribed ? (
          <div className="space-y-4 text-center animate-reveal">
            <h2 className="font-serif text-3xl font-medium text-gray-900">
              Already Subscribed
            </h2>
            <p className="leading-relaxed text-gray-600">
              You’re set to receive our latest news and insights.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="font-serif text-4xl font-medium tracking-wide text-gray-900">
                Join Our Newsletter
              </h1>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Get the latest updates delivered to your inbox.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                className="flex-1 px-5 py-3 text-gray-800 placeholder-gray-400 transition-all duration-300 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent disabled:bg-gray-50"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={handleChange}
                disabled={!!user || loading}
              />
              <button
                className={`px-6 py-3 font-medium text-white transition-all duration-300 rounded-lg focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed ${
                  user
                    ? "bg-gray-900 hover:bg-gray-800 focus:ring-gray-600"
                    : "bg-red-600 hover:bg-red-500 focus:ring-red-400"
                }`}
                onClick={handleSubscribe}
                disabled={loading}
              >
                {user ? (loading ? "Signing Up..." : "Sign Up") : "Login"}
              </button>
            </div>

            {!user && (
              <p className="text-sm text-center text-red-500 animate-fadeIn">
                Please login first
              </p>
            )}

            {message && (
              <p className="text-sm text-center text-red-500 animate-fadeIn">
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsletterUpdate;
