import React, { useRef, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

function CategorySection() {
  const scrollRef = useRef(null);
  const { categories, loading, error } = useSelector((state) => state.data);

  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  const scrollLeft = useCallback(() => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }, []);

  const debouncedScrollLeft = debounce(scrollLeft, 100);
  const debouncedScrollRight = debounce(scrollRight, 100);

  useEffect(() => {
    const handleWheel = (e) => {
      if (scrollRef.current) {
        // 🛑 Sirf horizontal scroll ke liye default behavior disable kare
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
          return; // Agar user vertical scroll kar raha hai to kuch mat karo
        }
        e.preventDefault(); // Horizontal scroll ko smooth banane ke liye
        scrollRef.current.scrollBy({ left: e.deltaY * 2, behavior: "smooth" });
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  const categoryList = useMemo(() => {
    if (categories.length === 0) return null;
    return categories.map((cat, index) => (
      <motion.div
        key={cat.id || index}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex flex-col items-center gap-3 cursor-pointer snap-center"
      >
        <img
          src={cat.image || "https://placehold.co/600x400"}
          // srcSet={`${cat.image} 1x, ${cat.imageHighRes || cat.image} 2x`}
          sizes="(max-width: 768px) 140px, 180px"
          className="w-[140px] md:w-[180px] h-[140px] md:h-[180px] rounded-full object-cover shadow-md hover:shadow-xl transition-shadow duration-300"
          alt={cat.name || `Category ${index + 1}`}
          onError={(e) => (e.target.src = "https://placehold.co/600x400")}
          loading="lazy"
        />
        <p className="text-sm md:text-[15px] font-semibold text-gray-800 hover:text-blue-700 transition-colors duration-200">
          {cat.name}
        </p>
      </motion.div>
    ));
  }, [categories]);

  return (
    <div className="flex flex-col gap-8 p-4 md:gap-10 md:p-10 bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-blue-700 md:text-3xl">
          Explore Categories
        </h1>
        <p className="mt-2 text-sm text-gray-600 md:text-base">
          Discover our diverse range of topics
        </p>
      </div>

      <div className="relative px-6 md:px-12">
        <button
          onClick={debouncedScrollLeft}
          onKeyDown={(e) => e.key === "Enter" && debouncedScrollLeft()}
          tabIndex={0}
          className="absolute z-10 p-3 text-white transition-all duration-300 -translate-y-1/2 bg-blue-700 rounded-full shadow-lg -left-2 md:-left-4 top-1/2 md:p-4 hover:bg-blue-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          aria-label="Scroll Left"
          disabled={loading || categories.length === 0}
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="snap-x snap-mandatory scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-12 h-12 border-4 border-blue-700 rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : error ? (
            <p className="py-10 text-center text-red-600">{error}</p>
          ) : categories.length === 0 ? (
            <p className="py-10 text-center text-gray-600">
              No categories available
            </p>
          ) : (
            <div className="flex gap-8 py-6 md:gap-12 md:py-10 min-w-max">
              {categoryList}
            </div>
          )}
        </div>

        <button
          onClick={debouncedScrollRight}
          onKeyDown={(e) => e.key === "Enter" && debouncedScrollRight()}
          tabIndex={0}
          className="absolute z-10 p-3 text-white transition-all duration-300 -translate-y-1/2 bg-blue-700 rounded-full shadow-lg -right-2 md:-right-4 top-1/2 md:p-4 hover:bg-blue-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          aria-label="Scroll Right"
          disabled={loading || categories.length === 0}
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CategorySection;
