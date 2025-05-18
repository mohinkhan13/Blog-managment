import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useScroll } from "../../context/ScrollContext";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = React.useRef(null);
  const { user, logout } = useContext(AuthContext);
  const { scrollToNewsletter } = useScroll();

  useEffect(() => {
    if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // Mobile menu close karo
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-30">
        <header
          ref={headerRef}
          className={`transition-all duration-300 border-b border-gray-100 ${
            isSticky
              ? "md:static fixed top-0 left-0 z-50 bg-white shadow-lg w-full"
              : "relative"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-5 mx-auto max-w-7xl sm:px-6 lg:px-30">
            <i className="text-xl cursor-pointer ri-search-line"></i>
            <div className="flex items-center space-x-2">
              <i className="ri-dashboard-line text-[24px] sm:text-[32px] text-blue-800"></i>
              <p className="text-[24px] sm:text-[28px] md:text-[32px] font-extrabold">
                BlogVerse
              </p>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-2xl cursor-pointer md:hidden"
            >
              {isMenuOpen ? "✖" : "☰"}
            </button>
            <div className="hidden md:block">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-xl cursor-pointer ri-logout-box-line"
                  title="Logout"
                ></button>
              ) : (
                <Link to="/login">
                  <i className="text-xl cursor-pointer ri-user-line"></i>
                </Link>
              )}
            </div>
          </div>
        </header>
        <div
          style={{ height: isSticky ? `${headerHeight}px` : "0" }}
          className="md:hidden"
        />
        <nav
          className={`w-full py-4 transition-all duration-300 hidden md:block ${
            isSticky
              ? "fixed top-0 left-0 z-40 shadow-lg bg-indigo-900 w-full"
              : "relative bg-white"
          }`}
        >
          <div
            className={`flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-30 ${
              isSticky ? "text-white" : "text-black"
            }`}
          >
            <div className="flex gap-4 [&>i]:text-[20px]">
              <i className="ri-facebook-circle-fill hover:text-blue-600"></i>
              <i className="ri-instagram-fill hover:text-red-600"></i>
              <i className="ri-twitter-x-line hover:text-blue-700"></i>
            </div>
            <div className="flex space-x-6">
              <Link to="/" className="font-semibold hover:text-blue-800">
                Home
              </Link>
              <Link to="/allpost" className="font-semibold hover:text-blue-800">
                Posts
              </Link>
              <Link to="/contact" className="font-semibold hover:text-blue-800">
                Contact
              </Link>
            </div>
            <button
              onClick={scrollToNewsletter}
              className={`px-4 py-2 rounded transition-all duration-300 ${
                isSticky ? "bg-white text-black" : "bg-blue-800 text-white"
              } hover:bg-opacity-90`}
            >
              Subscribe
            </button>
          </div>
        </nav>
        <div
          className={`${
            isMenuOpen
              ? `fixed top-[${headerHeight}px] left-0 w-full bg-white z-50 max-h-96 opacity-100`
              : "max-h-0 opacity-0"
          } overflow-hidden transition-all duration-300 md:hidden`}
        >
          <div className="flex flex-col items-center pb-4 mt-4 space-y-4 text-black">
            <Link
              to="/"
              className="font-semibold hover:text-blue-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/allpost"
              className="font-semibold hover:text-blue-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Posts
            </Link>
            <Link
              to="/contact"
              className="font-semibold hover:text-blue-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex gap-4 [&>i]:text-[20px]">
              <i className="ri-facebook-circle-fill hover:text-blue-600"></i>
              <i className="ri-instagram-fill hover:text-red-600"></i>
              <i className="ri-twitter-x-line hover:text-blue-700"></i>
            </div>
            <button
              onClick={() => {
                scrollToNewsletter();
                setIsMenuOpen(false);
              }}
              className="px-4 py-2 text-white bg-blue-800 rounded hover:bg-opacity-90"
            >
              Subscribe
            </button>
            {user ? (
              <button
                onClick={handleLogout}
                className="font-semibold hover:text-blue-800"
              >
                <i className="text-xl ri-logout-box-line"></i> Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="font-semibold hover:text-blue-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="text-xl ri-user-line"></i> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
