"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <FaSun className="text-yellow-400 w-5 h-5" />
      ) : (
        <FaMoon className="text-slate-700 w-5 h-5" />
      )}
    </button>
  );
};
