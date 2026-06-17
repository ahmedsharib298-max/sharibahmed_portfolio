"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import styles from "./TerminalConsole.module.css";

interface TerminalLine {
  text: string;
  type: "command" | "output" | "error" | "system";
}

export default function TerminalConsole() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: "systemctl status sharib-portfolio.service", type: "command" },
    { text: "● Active: online (running)", type: "system" },
    { text: "Type 'help' or click the buttons below to explore.", type: "output" },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Play click sound using Web Audio API (no external file needed!)
  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // AudioContext blocks autoplay until user interaction, which is fine since they are interacting here
    }
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    playClickSound();

    const newHistory = [...history, { text: `$ ${cmd}`, type: "command" as const }];

    switch (trimmed) {
      case "help":
        newHistory.push(
          { text: "Available commands:", type: "output" },
          { text: "  about    - Print personal summary and credentials", type: "output" },
          { text: "  skills   - Display technical expertise as ASCII chart", type: "output" },
          { text: "  projects - List details of featured systems", type: "output" },
          { text: "  contact  - Display mail, phone, and links", type: "output" },
          { text: "  clear    - Clear terminal window logs", type: "output" }
        );
        break;
      case "about":
        newHistory.push(
          { text: "Sharib Ahmed K — MCA Analyst & Full-Stack Developer", type: "system" },
          { text: "Focusing on secure admin frameworks (Flask, MongoDB) and dynamic business intelligence dashboards (Power BI, DAX). Dedicated to clean code, responsive layouts, and data analytics.", type: "output" }
        );
        break;
      case "skills":
        newHistory.push(
          { text: "TECHNICAL EXPERTISE MAP:", type: "system" },
          { text: "Python      [██████████████████░] 90%", type: "output" },
          { text: "JavaScript  [████████████████░░░] 80%", type: "output" },
          { text: "SQL / MySQL [██████████████████░] 90%", type: "output" },
          { text: "MongoDB     [███████████████░░░░] 75%", type: "output" },
          { text: "Flask API   [██████████████████░] 90%", type: "output" },
          { text: "Power BI    [█████████████████░░] 85%", type: "output" }
        );
        break;
      case "projects":
        newHistory.push(
          { text: "FEATURED DEPLOYMENTS:", type: "system" },
          { text: "1. Student Registration & Profile Management System", type: "output" },
          { text: "   - Stack: Python (Flask), MongoDB, HTML/CSS/JS", type: "output" },
          { text: "   - Security: OTP verification, role-based controls", type: "output" },
          { text: "2. Student Academic Performance Dashboard", type: "output" },
          { text: "   - Stack: Excel, Power Query, DAX, Power BI", type: "output" },
          { text: "   - Metrics: Interactive averages, grade cohort success charts", type: "output" }
        );
        break;
      case "contact":
        newHistory.push(
          { text: "CONTACT GATEWAY ONLINE:", type: "system" },
          { text: "   - Email:    ahmedsharib298@gmail.com", type: "output" },
          { text: "   - Phone:    +91-6374525580", type: "output" },
          { text: "   - LinkedIn: Sharib Ahmed K", type: "output" },
          { text: "   - Location: Pernambut, Vellore, Tamil Nadu", type: "output" }
        );
        break;
      case "clear":
        setHistory([]);
        setInputVal("");
        return;
      default:
        newHistory.push({
          text: `Command not found: '${trimmed}'. Type 'help' for options.`,
          type: "error",
        });
    }

    setHistory(newHistory);
    setInputVal("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputVal);
    } else {
      // Play a quick keypress tick sound
      playClickSound();
    }
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  return (
    <div className={styles.terminalContainer} onClick={() => inputRef.current?.focus()}>
      <div className={styles.terminalHeader}>
        <div className={styles.terminalDots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <div className={styles.terminalTitle}>sharib@terminal:~</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSoundEnabled(!soundEnabled);
          }}
          className={styles.soundToggle}
          title={soundEnabled ? "Mute typing sound" : "Unmute typing sound"}
        >
          {soundEnabled ? "🔊" : "🔇"}
        </button>
      </div>

      <div className={styles.terminalBody}>
        {history.map((line, idx) => (
          <div
            key={idx}
            className={`${styles.line} ${
              line.type === "command"
                ? styles.commandLine
                : line.type === "system"
                ? styles.systemLine
                : line.type === "error"
                ? styles.errorLine
                : styles.outputLine
            }`}
          >
            {line.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      <div className={styles.inputArea}>
        <span className={styles.prompt}>$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.input}
          placeholder="type help..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <span className={styles.cursor} />
      </div>

      {/* Quick Access Buttons for mobile/fast use */}
      <div className={styles.quickAccess}>
        {(["help", "about", "skills", "projects", "contact", "clear"] as const).map((cmd) => (
          <button
            key={cmd}
            onClick={(e) => {
              e.stopPropagation();
              handleCommand(cmd);
            }}
            className={styles.quickBtn}
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
