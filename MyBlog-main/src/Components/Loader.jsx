import React from "react";

function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-blue-700 rounded-full border-t-transparent animate-spin"></div>
    </div>
  );
}

export default Loader;
