"use client";

import { useEffect, useRef } from "react";

/** Fades `.rise` children of its parent in as they enter view. Inert under reduced motion. */
export function RiseObserver() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = ref.current?.parentElement;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = root.querySelectorAll(".rise");
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    root.classList.add("rise-on");
    items.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      root.classList.remove("rise-on");
    };
  }, []);
  return <span ref={ref} hidden />;
}
