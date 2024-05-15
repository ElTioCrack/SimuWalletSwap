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
      <button className="focus:outline-none" onClick={toggleTheme}>
        <div className="relative w-10 h-5 bg-gray-300 dark:bg-gray-800 rounded-full">
          <div
            className={`absolute left-0 top-0 w-5 h-5 bg-white dark:bg-gray-500 rounded-full transform transition-transform ${
              theme === "dark" ? "translate-x-full" : "translate-x-0"
            }`}
          ></div>
        </div>
      </button>
    </div>
  );
}

export default ThemeToggle;
