import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const [sideLinks] = useState([
    {
      index: 1,
      name: "Dashboard",
      icon: "ri-tv-2-line",
      color: "#48b4d5",
      goTo: "/admin",
    },
    {
      index: 2,
      name: "Post",
      icon: "ri-article-line",
      color: "#FFB200",
      goTo: "post",
    },
    {
      index: 3,
      name: "Category",
      icon: "ri-folder-line",
      color: "#FFB200",
      goTo: "category",
    },
    {
      index: 4,
      name: "User",
      icon: "ri-user-line",
      color: "#3A7D44",
      goTo: "users",
    },
    {
      index: 5,
      name: "Comment",
      icon: "ri-chat-3-line",
      color: "#2D336B",
      goTo: "comments",
    },
    {
      index: 6,
      name: "Post Stats",
      icon: "ri-eye-line",
      color: "#FF0000",
      goTo: "poststats",
    },
    {
      index: 7,
      name: "Contact",
      icon: "ri-mail-line",
      color: "#ZBC0D0",
      goTo: "adminContact",
    },
    {
      index: 8,
      name: "Newsletter",
      icon: "ri-mail-line",
      color: "#dFD010",
      goTo: "adminNewsletter",
    },
    // {
    //   index: 9,
    //   name: "Setting",
    //   icon: "ri-settings-2-line",
    //   color: "#FF0000",
    //   goTo: "/",
    // },
  ]);

  return (
    <div className="fixed top-0 left-0 w-64 h-full p-4 bg-white shadow-2xl md:w-48 lg:w-64">
      <div className="mb-6 text-2xl font-bold text-center text-[#48b4d5]">
        <i className="ri-dashboard-line"></i> <span>My Dash</span>
      </div>
      <ul className="pt-6 space-y-3">
        {sideLinks.map((sideLink) => (
          <li key={sideLink.index}>
            <Link
              to={`${sideLink.goTo}`}
              className={`flex items-center gap-4 p-2 rounded group hover:text-black ${
                location.pathname === `/${sideLink.goTo}`
                  ? "bg-gray-200"
                  : "text-gray-500"
              }`}
            >
              <i
                className={`${sideLink.icon} text-[18px]`}
                style={{ color: sideLink.color }}
              ></i>
              <span className="transition duration-200 group-hover:text-black">
                {sideLink.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
