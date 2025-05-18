import React from 'react';

const Sidebar = ({ className }) => {
  return (
    <aside className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      {/* Search */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-semibold text-gray-900">Search Posts</h3>
        <div className="flex">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button className="p-2 text-white transition bg-indigo-600 rounded-r-lg hover:bg-indigo-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-gray-900">Categories</h3>
        <ul className="space-y-2">
          <li><a href="#" className="text-indigo-600 hover:underline">Technology</a></li>
          <li><a href="#" className="text-indigo-600 hover:underline">Lifestyle</a></li>
          <li><a href="#" className="text-indigo-600 hover:underline">Travel</a></li>
          <li><a href="#" className="text-indigo-600 hover:underline">Food</a></li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;