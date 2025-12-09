"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-12 h-12 rounded-xl bg-linear-to-br from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-border hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
      aria-label="Toggle theme"
    >
      {/* Sun icon (light mode) - fades in */}
      <Sun 
        className={`absolute inset-0 m-auto h-5 w-5 text-accent transition-all duration-500 ${
          !isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-0'
        }`}
      />
      
      {/* Moon icon (dark mode) - fades in */}
      <Moon 
        className={`absolute inset-0 m-auto h-5 w-5 text-primary transition-all duration-500 ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'
        }`}
      />
    </button>
  );
}

export default ThemeToggle;