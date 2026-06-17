# Portfolio Hero — Cinematic Video Intro

A fullscreen, sticky/pinned hero section built for Next.js App Router, using
your talking-head video as both a sharp foreground clip and a blurred ambient
background, with a Three.js bokeh layer and GSAP entrance choreography on top.

## What's inside

```
app/
  layout.tsx        Root layout, loads global tokens + fonts
  globals.css        Color/type/spacing tokens, font imports, resets
  page.tsx           Example page wiring up <VideoIntro /> + the
                      pin-and-reveal scroll pattern
  page.module.css     Styles for the example page only

components/
  VideoIntro/
    VideoIntro.tsx          The hero: video layers, frame, content, controls
    VideoIntro.module.css   All hero styling
  CinematicLayer/
    CinematicLayer.tsx       Three.js bokeh/particle ambient layer

public/videos/
  hero.mp4            Your uploaded video
  hero-poster.jpg     Extracted poster frame (shown before video loads)
```

## Setup

1. Drop this into a Next.js 14+ App Router project (or use this folder as
   the project root — `app/` and `public/` already follow that convention).
2. Install the two extra dependencies this hero needs:

   ```bash
   npm install three gsap
   npm install -D @types/three
   ```

3. `npm run dev` and open `/`.

This was built and verified against Next.js 14.2 with `next build` — it
compiles cleanly with TypeScript strict mode on.

## How the "sticky" hero works

`VideoIntro` itself is `position: fixed`, covering the full viewport. The
`<div className={styles.heroSpacer} />` in `app/page.tsx` reserves `100vh` of
scroll space in the document flow (since the fixed hero doesn't occupy any),
and the section after it (`#next-section`, given a solid background and a
higher `z-index`) scrolls up and visually covers the still-pinned video as
the user continues scrolling. Swap `#next-section`'s contents for your real
content — just keep a background color and `position: relative` so it
continues to cover the fixed hero behind it.

## Customization

`<VideoIntro />` accepts props so you don't need to touch the component
internals for basic changes:

```tsx
<VideoIntro
  videoSrc="/videos/hero.mp4"
  posterSrc="/videos/hero-poster.jpg"
  firstName="Sharib"
  lastName="Ahmed"
  eyebrow="Full-Stack Developer"
  subtitle="Your own description here."
  nextSectionId="next-section"
/>
```

**Colors / type** live as CSS variables at the top of `app/globals.css`
(`--ember`, `--monitor-blue`, `--bg-void`, `--font-display`, etc.) — change
them once there and every component picks it up.

**Particle density / speed** are set in `CinematicLayer.tsx` near the top of
the effect (`PARTICLE_COUNT`, `ampX`/`ampY`, `speed`). Counts are already
scaled down automatically on small screens and under
`prefers-reduced-motion`.

**Frame size**: the inset around the video is controlled by `--hero-inset`
in `globals.css` (and overridden for mobile in `VideoIntro.module.css`).

## Accessibility & performance notes

- All motion (particle drift, brackets, REC dot, scroll pulse) is disabled
  under `prefers-reduced-motion: reduce`; the Three.js layer renders a single
  static frame instead of looping.
- Both videos are `muted` by default (required for autoplay in every major
  browser) with an explicit unmute control — browsers will block audible
  autoplay regardless of the `muted` prop if you remove it.
- The Three.js layer disposes its geometry, material, and renderer on
  unmount, cancels its animation frame, and pauses rendering when the tab is
  hidden (`visibilitychange`).
- Pixel ratio is capped at 2 to avoid over-rendering on high-DPI displays.
- Since this is a talking-head video, consider adding a `<track kind="captions">`
  or an on-page transcript if the audio carries meaningful content — this
  keeps it usable with sound off (which, per the "tap for sound" pattern
  here, is the default first impression for most visitors).
