"use client";

import React, { useState } from "react";
import styles from "./ThemeSwitcher.module.css";

export type ThemeType = "ember" | "cyber" | "plasma" | "void";

interface ThemeSwitcherProps {
  activeTheme: ThemeType;
  onChangeTheme: (theme: ThemeType) => void;
}

export default function ThemeSwitcher({ activeTheme, onChangeTheme }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const themes: { id: ThemeType; name: string; color: string; desc: string }[] = [
    { id: "ember", name: "Ember Ignite", color: "#ff7a3c", desc: "Warm Orange" },
    { id: "cyber", name: "Cyber Neon", color: "#39ff14", desc: "Matrix Green" },
    { id: "plasma", name: "Plasma Rift", color: "#ff007f", desc: "Cyberpunk Pink" },
    { id: "void", name: "Void Pulse", color: "#00f2fe", desc: "Tron Cyan" },
  ];

  return (
    <div className={`${styles.switcherContainer} ${isOpen ? styles.open : ""}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toggleBtn}
        aria-label="Customize page theme"
      >
        <span className={styles.icon}>🎨</span>
        <span className={styles.label}>Customizer</span>
      </button>

      <div className={styles.menu}>
        <div className={styles.menuHeader}>THEME SELECTOR</div>
        <div className={styles.themeList}>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                onChangeTheme(t.id);
                setIsOpen(false);
              }}
              className={`${styles.themeOption} ${activeTheme === t.id ? styles.active : ""}`}
            >
              <span className={styles.colorDot} style={{ backgroundColor: t.color, color: t.color }} />
              <div className={styles.themeInfo}>
                <span className={styles.themeName}>{t.name}</span>
                <span className={styles.themeDesc}>{t.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
