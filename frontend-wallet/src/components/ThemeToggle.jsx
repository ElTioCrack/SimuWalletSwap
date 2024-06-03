import React, { useState, useEffect } from "react";

function ThemeToggle() {
  const [theme, setTheme] = useState(
    localStorage.theme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.theme = newTheme;
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="lg:flex lg:justify-center">
      <button
        className="relative w-16 h-8 focus:outline-none bg-gray-300 dark:bg-gray-800 rounded-full transition-colors duration-300"
        onClick={toggleTheme}
      >
        <div
          className={`absolute top-1 left-1 w-6 h-6 bg-white dark:bg-gray-500 rounded-full shadow-md transform transition-transform duration-300 ${
            theme === "dark" ? "translate-x-8" : "translate-x-0"
          }`}
        ></div>
        <div
          className={`absolute top-0 left-0 w-full h-full flex items-center justify-between px-2 text-sm font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <span>☀️</span>
          <span>🌙</span>
        </div>
      </button>
    </div>
  );
}

export default ThemeToggle;
