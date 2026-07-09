import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isLight, setIsLight] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isLight ? "light" : "dark"
    );
    localStorage.setItem("theme", isLight ? "light" : "dark");
  }, [isLight]);

  return (
    <button
      onClick={() => setIsLight((prev) => !prev)}
      aria-label="تغییر تم روشن و تاریک"
      className={
        "relative w-16 h-9 rounded-full border border-[var(--border-color)] shrink-0 transition-colors duration-500 " +
        (isLight
          ? "bg-[var(--bf-lighter-green)]"
          : "bg-[var(--color-productcolor)]")
      }
    >
      <span
        className={
          "absolute top-1 left-1 w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-500 ease-in-out " +
          (isLight
            ? "translate-x-7 bg-[var(--color-yellow)]"
            : "translate-x-0 bg-[var(--bf-green)]")
        }
      >
        <i
          className={
            "text-sm transition-all duration-500 " +
            (isLight
              ? "fa-solid fa-sun rotate-0 text-[var(--tp-b-color)]"
              : "fa-solid fa-moon rotate-[360deg] text-white")
          }
        ></i>
      </span>
    </button>
  );
};
export default ThemeToggle;