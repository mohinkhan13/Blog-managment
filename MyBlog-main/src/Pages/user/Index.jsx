import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../Components/user/Sidebar";
import PostOfTheDay from "../../Components/user/PostOfTheDay";
import CategorySection from "../../Components/user/CategorySection";
import PopularPost from "../../Components/user/PopularPost";
import HomeAbout from "../../Components/user/HomeAbout";
import UserStats from "../../Components/user/UserStats";
import NewsletterUpdate from "../../Components/user/NewsletterUpdate";
import { useScroll } from "../../context/ScrollContext";
import { AuthContext } from "../../context/AuthContext";

function Index() {
  const { newsletterRef } = useScroll();
  const { loading } = useContext(AuthContext); // Add user for logging

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <PostOfTheDay />
        <CategorySection />
        <PopularPost />
        <HomeAbout />
        <UserStats />
        <section ref={newsletterRef}>
          <NewsletterUpdate />
        </section>
      </div>
    </>
  );
}

export default Index;
