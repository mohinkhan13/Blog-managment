import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logout } = useContext(AuthContext);
  console.log("Navbar user:", user); // Add this

  // ✅ Close Dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Move handleLogout outside of useEffect
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <nav className="flex items-center justify-between h-16 px-4 bg-white shadow-md">
      {/* Menu Icon */}
      <div>
        <i className="text-2xl text-blue-700 cursor-pointer ri-menu-line"></i>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          className="w-64 h-10 px-4 text-black border-2 border-blue-300 outline-none rounded-xl focus:border-blue-500"
          placeholder="Search..."
        />

        {/* User Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2U747Wh3TKa6TTyZOittQbDSQWwVJXU3_vA&s"
              alt="User"
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 bg-white border border-gray-200 rounded-lg shadow-lg w-44">
              <div className="px-4 py-3 text-sm text-gray-900">
                <div>{user?.fname || "User Name"}</div>
                <div className="font-medium text-gray-600 truncate">
                  {user?.email || "user@example.com"}
                </div>
              </div>
              <ul className="py-2 text-sm text-gray-700">
                <li>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Settings
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Earnings
                  </a>
                </li>
              </ul>
              <div className="py-2 border-t">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50"
                  >
                    <i className="text-xl ri-logout-box-line"></i> Logout
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </div>
        {/* End User Avatar Dropdown */}
      </div>
    </nav>
  );
}
