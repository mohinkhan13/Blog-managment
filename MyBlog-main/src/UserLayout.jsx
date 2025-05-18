import React from "react";
import Navbar from "./Components/user/Navbar";
import Footer from "./Components/user/Footer";
import Sidebar from "./Components/user/Sidebar";
import { Outlet } from "react-router-dom";
import { ScrollProvider } from "./context/ScrollContext";

function UserLayout() {
  return (
    <ScrollProvider>
      <div className="flex flex-col min-h-screen font-sans bg-white ">
        {/* Sticky Navbar */}
        <Navbar />

        {/* Main Content with Sidebar */}
        <div className="flex flex-col flex-grow gap-6 md:flex-row border-t-2 border-[#fff8f5] container mx-auto px-4">
          <main className="w-full" role="main">
            <Outlet />
          </main>
          {/* Uncomment if you want to use Sidebar */}
          {/* <Sidebar className="w-full md:w-1/3" /> */}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </ScrollProvider>
  );
}

export default UserLayout;
