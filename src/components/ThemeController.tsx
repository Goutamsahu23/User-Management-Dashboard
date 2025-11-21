"use client";

import { useEffect } from "react";
import useStore from "@/stores/useStore";


export default function ThemeController() {
  const darkMode = useStore((s) => s.darkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return null;
}
