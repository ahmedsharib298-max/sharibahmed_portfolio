"use client";

import React, { useRef, useState, MouseEvent } from "react";

interface TiltProps {
  children: React.ReactNode;
  maxRotation?: number; // max tilt degrees (default 8)
  scale?: number;       // scale on hover (default 1.02)
  className?: string;
}

export default function Tilt({
  children,
  maxRotation = 8,
  scale = 1.02,
  className = "",
}: TiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transition: "all 0.5s ease",
  });
  const [sheenStyle, setSheenStyle] = useState<React.CSSProperties>({
    opacity: 0,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // mouse x relative to card
    const y = e.clientY - rect.top;  // mouse y relative to card

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-maxRotation to maxRotation)
    const rotateY = ((x - centerX) / centerX) * maxRotation;
    const rotateX = -((y - centerY) / centerY) * maxRotation;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)",
    });

    // Sheen follows mouse
    setSheenStyle({
      opacity: 1,
      background: `radial-gradient(circle 180px at ${x}px ${y}px, rgba(255, 255, 255, 0.08), transparent)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
    });
    setSheenStyle({
      opacity: 0,
      transition: "opacity 0.5s ease",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        position: "relative",
        transformStyle: "preserve-3d",
        ...tiltStyle,
      }}
    >
      {/* Sheen effect layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          zIndex: 10,
          willChange: "background, opacity",
          ...sheenStyle,
        }}
      />
      {children}
    </div>
  );
}
