"use client";

import { useTheme } from "@/context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full p-2 transition-colors hover:bg-gray-200 focus:outline-none dark:hover:bg-gray-700"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <FaSun className="h-5 w-5 text-yellow-400" />
      ) : (
        <FaMoon className="h-5 w-5 text-slate-700" />
      )}
    </button>
  );
};
