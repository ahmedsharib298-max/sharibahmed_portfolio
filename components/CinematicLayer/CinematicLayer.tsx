"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * CinematicLayer
 * ---------------------------------------------------------------------------
 * A transparent, full-bleed canvas of slow-drifting warm/cool bokeh points
 * rendered with additive blending. No textures are loaded — each point's
 * soft circular falloff is computed directly in the fragment shader, which
 * keeps the component dependency-free and cheap to dispose.
 *
 * Sits between the video layers and the text content (controlled by the
 * parent's z-index), and never intercepts pointer events.
 */

const VERTEX_SHADER = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;

  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // Perspective-scaled point size so particles further away read smaller.
    gl_PointSize = aSize * (320.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    // Soft gaussian-ish falloff for a dreamy, blurred bokeh disc.
    float alpha = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, alpha * 0.85);
  }
`;

interface Particle {
  baseX: number;
  baseY: number;
  baseZ: number;
  phaseX: number;
  phaseY: number;
  speed: number;
  ampX: number;
  ampY: number;
}

export default function CinematicLayer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isSmallScreen = window.innerWidth < 768;
    const PARTICLE_COUNT = reducedMotion ? 18 : isSmallScreen ? 36 : 72;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ---- Build particles -------------------------------------------------
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const particles: Particle[] = [];

    const warm = new THREE.Color("#ff9a5c");
    const warmDeep = new THREE.Color("#ff7a3c");
    const cool = new THREE.Color("#8fd0ff");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseX = (Math.random() - 0.5) * 80;
      const baseY = (Math.random() - 0.5) * 50;
      const baseZ = Math.random() * -90 + 10;

      particles.push({
        baseX,
        baseY,
        baseZ,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.25,
        ampX: 1.5 + Math.random() * 2.5,
        ampY: 1.5 + Math.random() * 2.5,
      });

      positions[i * 3] = baseX;
      positions[i * 3 + 1] = baseY;
      positions[i * 3 + 2] = baseZ;

      // ~75% warm embers, ~25% cool monitor-blue rim particles.
      const isCool = Math.random() > 0.75;
      const c = isCool ? cool : Math.random() > 0.5 ? warm : warmDeep;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = isCool ? 6 + Math.random() * 8 : 8 + Math.random() * 16;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ---- Mouse parallax ----------------------------------------------------
    const mouse = { x: 0, y: 0 };
    const cameraTarget = { x: 0, y: 0 };

    function handlePointerMove(e: PointerEvent) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    // ---- Resize -------------------------------------------------------------
    function handleResize() {
      if (!container) return;
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    }
    window.addEventListener("resize", handleResize);

    // ---- Visibility (pause rendering when tab is hidden) --------------------
    let isVisible = true;
    function handleVisibility() {
      isVisible = document.visibilityState === "visible";
    }
    document.addEventListener("visibilitychange", handleVisibility);

    // ---- Render loop ----------------------------------------------------
    let rafId = 0;
    const clock = new THREE.Clock();
    const posAttr = geometry.getAttribute(
      "position"
    ) as THREE.BufferAttribute;

    function renderFrame() {
      const t = clock.getElapsedTime();

      if (!reducedMotion) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const p = particles[i];
          const x = p.baseX + Math.sin(t * p.speed + p.phaseX) * p.ampX;
          const y = p.baseY + Math.cos(t * p.speed * 0.8 + p.phaseY) * p.ampY;
          posAttr.array[i * 3] = x;
          posAttr.array[i * 3 + 1] = y;
        }
        posAttr.needsUpdate = true;

        // Lerp camera toward mouse for a slow, dreamy parallax drift.
        cameraTarget.x += (mouse.x * 6 - cameraTarget.x) * 0.02;
        cameraTarget.y += (-mouse.y * 4 - cameraTarget.y) * 0.02;
        camera.position.x = cameraTarget.x;
        camera.position.y = cameraTarget.y;
        camera.lookAt(0, 0, -40);
      }

      renderer.render(scene, camera);
      if (isVisible && !reducedMotion) {
        rafId = requestAnimationFrame(renderFrame);
      } else if (isVisible && reducedMotion) {
        // Render once for a static frame, then stop the loop entirely.
        return;
      } else {
        rafId = requestAnimationFrame(renderFrame);
      }
    }
    renderFrame();

    // ---- Cleanup ----------------------------------------------------------
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
