"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="!rounded-full !w-8 !h-8">
        <div className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="!rounded-full !w-7 !h-7 flex items-center justify-center"
    >
      {theme === "dark" ? (
        <FaMoon className="h-4 w-4" />
      ) : (
        <FaSun className="h-4 w-4" />
      )}
    </Button>
  );
}
