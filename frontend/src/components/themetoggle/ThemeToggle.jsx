import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const [isLight, setIsLight] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("theme") !== "dark";
  });

  useEffect(() => {
    const theme = isLight ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isLight]);

  return (
    <button
      onClick={() => setIsLight((prev) => !prev)}
      aria-label="تغییر تم روشن و تاریک"
      className="glass relative w-16 h-9 rounded-full border border-[var(--glass-border)] shrink-0 cursor-pointer overflow-hidden"
    >
      {/* Track glow */}
      <span
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: isLight
            ? "var(--color-gold-light)"
            : "rgba(31,27,22,0.6)",
        }}
      />
      {/* Sliding knob */}
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="absolute top-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md"
        style={{
          left: isLight ? "calc(100% - 2rem)" : "0.25rem",
          background: isLight ? "var(--color-gold)" : "#d4a84a",
        }}
      >
        <i
          className={
            "text-sm text-white transition-transform duration-500 " +
            (isLight
              ? "fa-solid fa-sun rotate-0"
              : "fa-solid fa-moon rotate-[360deg]")
          }
        ></i>
      </motion.span>
    </button>
  );
};
export default ThemeToggle;
