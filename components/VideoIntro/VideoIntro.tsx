"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import CinematicLayer from "../CinematicLayer/CinematicLayer";
import styles from "./VideoIntro.module.css";

export interface VideoIntroProps {
  videoSrc?: string;
  posterSrc?: string;
  firstName?: string;
  lastName?: string;
  eyebrow?: string;
  subtitle?: string;
  /** id of the section to scroll to when the scroll indicator is clicked */
  nextSectionId?: string;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 5v14l12-7L7 5z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
    </svg>
  );
}


function formatTimecode(seconds: number) {
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  const ff = Math.floor((seconds % 1) * 24)
    .toString()
    .padStart(2, "0");
  return `00:${mm}:${ss}:${ff}`;
}

export default function VideoIntro({
  videoSrc = "/videos/hero.mp4",
  posterSrc = "/videos/hero-poster.jpg",
  firstName = "Sharib",
  lastName = "Ahmed",
  eyebrow = "Full-Stack Developer",
  subtitle = "Building full-stack web apps and data-driven dashboards — turning code and analytics into real-world impact.",
  nextSectionId = "next-section",
}: VideoIntroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const fgVideoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLButtonElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLDivElement>(null);

  const [hasEntered, setHasEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timecode, setTimecode] = useState("00:00:00:00");

  /** Keep the blurred background video locked to the foreground video. */
  const syncVideos = useCallback((action: "play" | "pause") => {
    const fg = fgVideoRef.current;
    const bg = bgVideoRef.current;
    if (!fg || !bg) return;
    if (action === "play") {
      fg.play().catch(() => {});
      bg.play().catch(() => {});
    } else {
      fg.pause();
      bg.pause();
    }
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      syncVideos(prev ? "pause" : "play");
      return !prev;
    });
  }, [syncVideos]);



  const scrollToNext = useCallback(() => {
    const target = document.getElementById(nextSectionId);
    target?.scrollIntoView({ behavior: "smooth" });
  }, [nextSectionId]);

  /* ---- "Click to Enter" handler ---------------------------------------- */
  const handleEnter = useCallback(() => {
    if (hasEntered) return;
    setHasEntered(true);

    // Start video playback
    const fg = fgVideoRef.current;
    const bg = bgVideoRef.current;
    if (fg) {
      fg.currentTime = 0;
      fg.play().catch(() => {});
    }
    if (bg) {
      bg.currentTime = 0;
      bg.play().catch(() => {});
    }
    setIsPlaying(true);

    // Animate: fade out the enter screen, then run GSAP entrance
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Fade out the enter overlay
      tl.to(enterRef.current, {
        opacity: 0,
        scale: 1.05,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          if (enterRef.current) enterRef.current.style.display = "none";
        },
      })
        // Fade out the curtain
        .to(
          curtainRef.current,
          {
            opacity: 0,
            duration: 1.1,
            ease: "power2.inOut",
          },
          0.3
        )
        .from(
          ".js-eyebrow",
          { y: 24, opacity: 0, duration: 0.7 },
          0.6
        )
        .from(
          ".js-name-line",
          { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.12 },
          0.72
        )
        .from(
          ".js-subtitle",
          { y: 20, opacity: 0, duration: 0.7 },
          1.05
        )
        .from(
          [hudRef.current, controlsRef.current],
          { opacity: 0, duration: 0.6 },
          1.2
        )
        .from(scrollRef.current, { opacity: 0, duration: 0.6 }, 1.4);
    }, heroRef);

    return () => ctx.revert();
  }, [hasEntered]);



  /* ---- cinematic HUD timecode ------------------------------------------- */
  useEffect(() => {
    if (!hasEntered) return;
    let rafId = 0;
    const tick = () => {
      const fg = fgVideoRef.current;
      if (fg) setTimecode(formatTimecode(fg.currentTime));
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [hasEntered]);

  /* ---- When video ends, mark as not playing ------------------------------ */
  useEffect(() => {
    const fg = fgVideoRef.current;
    const bg = bgVideoRef.current;
    if (!fg) return;
    const handleEnded = () => {
      setIsPlaying(false);
      // Also pause bg
      if (bg) bg.pause();
    };
    fg.addEventListener("ended", handleEnded);
    return () => fg.removeEventListener("ended", handleEnded);
  }, []);

  return (
    <section className={styles.hero} ref={heroRef} aria-label="Intro">
      {/* ── "Click to Enter" Splash ── */}
      {!hasEntered && (
        <div className={styles.enterOverlay} ref={enterRef} onClick={handleEnter}>
          <div className={styles.enterContent}>
            <div className={styles.enterPulseRing} />
            <div className={styles.enterButton}>
              <svg viewBox="0 0 24 24" fill="none" className={styles.enterPlayIcon}>
                <path d="M7 5v14l12-7L7 5z" fill="currentColor" />
              </svg>
            </div>
            <p className={styles.enterLabel}>Click to Enter</p>
            <p className={styles.enterSubLabel}>{firstName} {lastName}&apos;s Portfolio</p>
          </div>
        </div>
      )}

      <div className={styles.curtain} ref={curtainRef} />

      <div className={styles.bgVideoWrap}>
        <video
          ref={bgVideoRef}
          className={styles.bgVideo}
          src={videoSrc}
          muted
          playsInline
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      <div className={styles.frame}>
        <video
          ref={fgVideoRef}
          className={styles.fgVideo}
          src={videoSrc}
          poster={posterSrc}
          playsInline
          aria-label="Introduction video"
        />
        <div className={styles.frameGradient} />
        <span className={`${styles.bracket} ${styles.bracketTL}`} />
        <span className={`${styles.bracket} ${styles.bracketTR}`} />
        <span className={`${styles.bracket} ${styles.bracketBL}`} />
        <span className={`${styles.bracket} ${styles.bracketBR}`} />
      </div>

      <div className={styles.ambientOverlay} />

      <CinematicLayer />

      <div className={styles.hud} ref={hudRef} style={{ opacity: hasEntered ? undefined : 0 }}>
        <span className={styles.recDot} />
        <span>REC&nbsp;&nbsp;{timecode}</span>
      </div>

      <div className={styles.content} ref={contentRef} style={{ opacity: hasEntered ? undefined : 0 }}>
        <p className={`${styles.eyebrow} js-eyebrow`}>{eyebrow}</p>
        <h1 className={styles.name}>
          <span className={styles.nameLine}>
            <span className="js-name-line" style={{ display: "block" }}>
              {firstName}
            </span>
          </span>
          <span className={styles.nameLine}>
            <span className="js-name-line" style={{ display: "block" }}>
              {lastName}
            </span>
          </span>
        </h1>
        <p className={`${styles.subtitle} js-subtitle`}>{subtitle}</p>
      </div>

      <div className={styles.controls} ref={controlsRef} style={{ opacity: hasEntered ? undefined : 0 }}>
        <button
          type="button"
          className={styles.controlBtn}
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      <button
        type="button"
        className={styles.scrollIndicator}
        ref={scrollRef}
        onClick={scrollToNext}
        aria-label="Scroll to next section"
        style={{ opacity: hasEntered ? undefined : 0 }}
      >
        <span className={styles.scrollLine} />
        <span className={styles.scrollLabel}>Scroll</span>
      </button>
    </section>
  );
}
