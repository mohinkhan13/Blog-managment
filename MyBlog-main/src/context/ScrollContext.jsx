// context/ScrollContext.jsx
import { createContext, useContext, useRef } from "react";

const ScrollContext = createContext();

export function ScrollProvider({ children }) {
  const newsletterRef = useRef(null);

  const scrollToNewsletter = () => {
    if (newsletterRef.current) {
      newsletterRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <ScrollContext.Provider value={{ newsletterRef, scrollToNewsletter }}>
      {children}
    </ScrollContext.Provider>
  );
}

export const useScroll = () => useContext(ScrollContext);
