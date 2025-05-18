import React from "react";

const HomeAbout = () => {
  // Social links ko reusable aur manageable banane ke liye array mein define kiya
  const socialLinks = [
    {
      href: "https://twitter.com/yourusername",
      icon: "ri-twitter-line",
      hoverColor: "hover:text-blue-500",
    },
    {
      href: "https://github.com/yourusername",
      icon: "ri-github-line",
      hoverColor: "hover:text-black",
    },
    {
      href: "https://linkedin.com/in/yourusername",
      icon: "ri-linkedin-line",
      hoverColor: "hover:text-blue-700",
    },
    {
      href: "https://instagram.com/yourusername",
      icon: "ri-instagram-line",
      hoverColor: "hover:text-pink-500",
    },
  ];

  return (
    <section className="px-4 py-32 ">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-18 md:text-4xl">
        About Me
      </h2>
      <div className="flex flex-col items-center max-w-4xl mx-auto gap-18 md:flex-row">
        {/* Image Section */}
        <div className="flex-shrink-0 w-48 h-48 overflow-hidden rounded-full shadow-lg">
          <img
            src="https://placehold.co/400x400" // Aapki image ka URL yahan dalen
            alt="Profile picture of [Your Name]" // Accessibility ke liye specific alt text
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Content Section */}
        <div className="text-center md:text-left">
          <p className=" mb-6 leading-relaxed text-gray-600 max-w-prose text-[20px]">
            Hello! Main ek passionate blogger hoon jo technology, coding aur
            digital trends ke bare mein likhta hai. Mujhe naye ideas explore
            karna aur apne readers ke saath knowledge share karna pasand hai.
          </p>

          {/* Social Icons */}
          <div className="flex justify-center gap-6 md:justify-start">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-600 ${link.hoverColor} transition-colors duration-200`}
                aria-label={link.href.split("/")[2]} // Accessibility ke liye aria-label
              >
                <i className={`text-2xl ${link.icon}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;
