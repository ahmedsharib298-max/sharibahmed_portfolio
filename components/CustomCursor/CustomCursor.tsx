"use client";

import { useEffect, useState } from "react";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--cursor-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${e.clientY}px`);
      if (hidden) setHidden(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") || 
        target.closest("button") || 
        target.closest(`[class*="Card"]`) || 
        target.closest(`[class*="Item"]`) ||
        target.closest(`[class*="Btn"]`) ||
        target.closest(`[class*="Link"]`) ||
        target.classList.contains("clickable");

      setHovered(!!isInteractive);
    };

    const handleMouseLeave = () => {
      setHidden(true);
    };

    const handleMouseEnter = () => {
      setHidden(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <div className={`${styles.cursorWrapper} ${hovered ? styles.hovered : ""}`}>
      <div className={styles.cursorDot} />
      <div className={styles.cursorRing} />
    </div>
  );
}
