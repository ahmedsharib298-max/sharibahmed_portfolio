"use client";

import { useState, useEffect, useRef } from "react";
import VideoIntro from "../components/VideoIntro/VideoIntro";
import ScrollReveal from "../components/ScrollReveal/ScrollReveal";
import { StudentRegistrationWidget, AcademicPerformanceWidget } from "../components/ProjectWidget/ProjectWidget";
import Tilt from "../components/Tilt/Tilt";
type ThemeType = "ember" | "cyber" | "plasma" | "void";
import TerminalConsole from "../components/TerminalConsole/TerminalConsole";
import styles from "./page.module.css";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<ThemeType>("ember");
  const [timelineProgress, setTimelineProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => setMenuOpen(false);

  const themeValues = {
    ember: { "--ember": "#ff7a3c", "--ember-deep": "#b8431d", "--monitor-blue": "#4fa8e0" },
    cyber: { "--ember": "#39ff14", "--ember-deep": "#097969", "--monitor-blue": "#00e5ff" },
    plasma: { "--ember": "#ff007f", "--ember-deep": "#7b2cbf", "--monitor-blue": "#ffcc00" },
    void: { "--ember": "#00f2fe", "--ember-deep": "#1d2786", "--monitor-blue": "#ff0055" },
  };

  const handleThemeChange = (theme: ThemeType) => {
    setActiveTheme(theme);
    const vals = themeValues[theme];
    Object.entries(vals).forEach(([key, val]) => {
      document.documentElement.style.setProperty(key, val);
    });
  };

  useEffect(() => {
    // Force scroll to top on page load/refresh
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    // Set default theme variables on mount
    const vals = themeValues["ember"];
    Object.entries(vals).forEach(([key, val]) => {
      document.documentElement.style.setProperty(key, val);
    });

    const handleScroll = () => {
      const el = timelineRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const startY = windowHeight * 0.75;
      const endY = windowHeight * 0.25;
      const totalHeight = rect.height;
      const progressDist = startY - rect.top;
      
      let pct = (progressDist / (totalHeight + (startY - endY))) * 100;
      pct = Math.max(0, Math.min(100, pct));
      setTimelineProgress(pct);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main style={{ position: "relative" }}>
      {/* Premium Glassmorphic Header */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <span className={styles.navLogoDot} />
          SHARIB AHMED
        </div>
        <ul className={styles.navLinks}>
          <li>
            <a href="#about" className={styles.navLink}>About</a>
          </li>
          <li>
            <a href="#skills" className={styles.navLink}>Skills</a>
          </li>
          <li>
            <a href="#experience" className={styles.navLink}>Experience</a>
          </li>
          <li>
            <a href="#projects" className={styles.navLink}>Projects</a>
          </li>
          <li>
            <a href="#education" className={styles.navLink}>Education</a>
          </li>
          <li>
            <a href="#contact" className={styles.navLink}>Contact</a>
          </li>
        </ul>

        {/* Mobile hamburger button */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile Navigation Overlay */}
      <div className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ""}`}>
        <a href="#about" className={styles.mobileNavLink} onClick={closeMenu}>About</a>
        <a href="#skills" className={styles.mobileNavLink} onClick={closeMenu}>Skills</a>
        <a href="#experience" className={styles.mobileNavLink} onClick={closeMenu}>Experience</a>
        <a href="#projects" className={styles.mobileNavLink} onClick={closeMenu}>Projects</a>
        <a href="#education" className={styles.mobileNavLink} onClick={closeMenu}>Education</a>
        <a href="#contact" className={styles.mobileNavLink} onClick={closeMenu}>Contact</a>
      </div>

      {/* Cinematic Hero Section */}
      <VideoIntro
        firstName="Sharib"
        lastName="Ahmed K"
        eyebrow="Computer Applications Graduate & Analyst"
        subtitle="Turning complex databases and full-stack logic into premium, data-driven web solutions."
        nextSectionId="about"
        activeTheme={activeTheme}
      />

      {/* Reserves the viewport height the fixed hero occupies */}
      <div className={styles.heroSpacer} />

      {/* Main Content Area (Scrolls Up over Hero) */}
      <section id="about" className={styles.nextSection}>

        {/* ── About Console ── */}
        <div className={styles.sectionContainer}>
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>01 // INTRODUCTION</span>
              <h2 className={styles.sectionTitle}>About Me</h2>
            </div>
            <hr className={styles.sectionDivider} />
          </ScrollReveal>
          <ScrollReveal delay={150} direction="zoom">
            <div className={styles.aboutConsole}>
              <div className={styles.consoleHeader}>
                <span className={styles.consoleDot} />
                <span className={styles.consoleDot} />
                <span className={styles.consoleDot} />
              </div>
              <div className={styles.consoleBody}>
                <p>
                  Hello, I&apos;m <span className={styles.consoleHighlight}>Sharib Ahmed K</span>, a motivated Computer Applications graduate currently pursuing my Master of Computer Applications (MCA). I have a strong foundation in programming, modern web technologies, and database systems.
                </p>
                <p>
                  My focus lies at the intersection of <span className={styles.consoleHighlight}>full-stack web development</span> and <span className={styles.consoleHighlightBlue}>data analytics</span>. I am dedicated to solving real-world problems and engineered systems that leverage secure authentication, efficient backend APIs, and rich analytics dashboards.
                </p>
                <p>
                  Whether building responsive admin modules using <span className={styles.consoleHighlight}>Python (Flask) &amp; MongoDB</span> or transforming raw business datasets with <span className={styles.consoleHighlightBlue}>Power BI &amp; Excel</span>, I strive to write readable, performant code that delivers measurable impact.
                </p>
              </div>
            </div>
            
            <TerminalConsole />
          </ScrollReveal>
        </div>

        {/* ── Technical Skills Grid ── */}
        <div id="skills" className={styles.sectionContainer}>
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={`${styles.sectionTag} ${styles.sectionTagBlue}`}>02 // EXPERTISE</span>
              <h2 className={styles.sectionTitle}>Technical Skills</h2>
            </div>
            <hr className={styles.sectionDivider} />
          </ScrollReveal>
          <div className={styles.skillsGrid}>
            <ScrollReveal delay={0} direction="zoom">
              <Tilt className={`${styles.skillCard} ${styles.skillCardEmber}`} scale={1.03} maxRotation={6}>
                <div className={styles.skillCardHeader}>
                  <span className={styles.skillIcon}>⚡</span> Languages &amp; Markup
                </div>
                <div className={styles.skillList}>
                  <span className={styles.skillBadge}>Python</span>
                  <span className={styles.skillBadge}>JavaScript</span>
                  <span className={styles.skillBadge}>HTML5</span>
                  <span className={styles.skillBadge}>CSS3</span>
                  <span className={styles.skillBadge}>Java</span>
                </div>
              </Tilt>
            </ScrollReveal>

            <ScrollReveal delay={120} direction="zoom">
              <Tilt className={`${styles.skillCard} ${styles.skillCardEmber}`} scale={1.03} maxRotation={6}>
                <div className={styles.skillCardHeader}>
                  <span className={styles.skillIcon}>🛠️</span> Frameworks &amp; Libraries
                </div>
                <div className={styles.skillList}>
                  <span className={styles.skillBadge}>Flask</span>
                  <span className={styles.skillBadge}>Jinja2 Templates</span>
                  <span className={styles.skillBadge}>React (Next.js)</span>
                  <span className={styles.skillBadge}>Three.js</span>
                  <span className={styles.skillBadge}>GSAP</span>
                </div>
              </Tilt>
            </ScrollReveal>

            <ScrollReveal delay={240} direction="zoom">
              <Tilt className={`${styles.skillCard} ${styles.skillCardBlue}`} scale={1.03} maxRotation={6}>
                <div className={styles.skillCardHeader}>
                  <span className={styles.skillIcon}>📊</span> Databases &amp; Analytics
                </div>
                <div className={styles.skillList}>
                  <span className={styles.skillBadge}>MySQL</span>
                  <span className={styles.skillBadge}>SQL</span>
                  <span className={styles.skillBadge}>MongoDB</span>
                  <span className={styles.skillBadge}>Power BI</span>
                  <span className={styles.skillBadge}>Microsoft Excel</span>
                  <span className={styles.skillBadge}>DAX</span>
                </div>
              </Tilt>
            </ScrollReveal>
          </div>
        </div>

        {/* ── Internship Timeline ── */}
        <div id="experience" className={styles.sectionContainer}>
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>03 // INDUSTRY TRAINING</span>
              <h2 className={styles.sectionTitle}>Internship Experience</h2>
            </div>
            <hr className={styles.sectionDivider} />
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div
              ref={timelineRef}
              className={styles.timeline}
              style={{ "--timeline-progress": `${timelineProgress}%` } as React.CSSProperties}
            >
              <div className={styles.timelineItem}>
                <div className={styles.timelineNode} />
                <div className={styles.timelineMeta}>
                  <h3 className={styles.timelineCompany}>ANUDIP Foundation</h3>
                  <span className={styles.timelineRole}>Business Analytics Intern</span>
                  <span className={styles.timelineDuration}>Jan 2026 – Apr 2026</span>
                </div>
                <div className={styles.timelineContent}>
                  <ul>
                    <li>Completed intensive hands-on training using Excel, SQL, Power BI, and Python to address business analytics questions.</li>
                    <li>Executed raw data extraction, cleaning, processing, dashboard modeling, and report analysis workflows.</li>
                    <li>Analyzed real-time datasets to identify industry trends, extract key insights, and support decision-making frameworks.</li>
                    <li>Strengthened professional communication skills through technical presentations and problem-solving seminars.</li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ── Projects Showcase ── */}
        <div id="projects" className={styles.sectionContainer}>
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={`${styles.sectionTag} ${styles.sectionTagBlue}`}>04 // PORTFOLIO</span>
              <h2 className={styles.sectionTitle}>Featured Projects</h2>
            </div>
            <hr className={styles.sectionDivider} />
          </ScrollReveal>

          {/* Project 1 */}
          <div className={`${styles.projectRow} ${styles.projectRowEmber}`}>
            <ScrollReveal delay={100} direction="left">
              <div className={styles.projectInfo}>
                <div className={styles.projectMeta}>
                  <span className={styles.projectTech}>Python</span>
                  <span className={styles.projectTech}>Flask</span>
                  <span className={styles.projectTech}>MongoDB</span>
                  <span className={styles.projectTech}>HTML/CSS/JS</span>
                </div>
                <h3 className={styles.projectTitle}>Student Registration &amp; Profile Management System</h3>
                <p className={styles.projectDesc}>
                  A complete, responsive web application designed for academic departments to handle administration, staff workflows, and student records securely.
                </p>
                <ul className={styles.projectBullets}>
                  <li>Implemented OTP-based verification for administrators and role-based access control.</li>
                  <li>Built endpoints for profile registration, attendance monitoring, and marks distribution.</li>
                  <li>Engineered robust backend API controllers in Flask and linked directly with MongoDB database storage.</li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200} direction="right">
              <Tilt className={styles.projectVisual} scale={1.01} maxRotation={4}>
                <StudentRegistrationWidget />
              </Tilt>
            </ScrollReveal>
          </div>

          {/* Project 2 */}
          <div className={`${styles.projectRow} ${styles.projectRowBlue}`}>
            <ScrollReveal delay={100} direction="right">
              <div className={styles.projectInfo}>
                <div className={styles.projectMeta}>
                  <span className={styles.projectTech}>Excel</span>
                  <span className={styles.projectTech}>Power BI</span>
                  <span className={styles.projectTech}>DAX</span>
                  <span className={styles.projectTech}>Power Query</span>
                </div>
                <h3 className={styles.projectTitle}>Student Academic Performance Dashboard</h3>
                <p className={styles.projectDesc}>
                  An interactive reporting dashboard modeled to transform complex educational variables into actionable student metrics.
                </p>
                <ul className={styles.projectBullets}>
                  <li>Structured data ingestion and cleansing using advanced Excel, Power Query, and Pivot tables.</li>
                  <li>Developed complex calculated columns and metrics using DAX formulas.</li>
                  <li>Designed beautiful, intuitive KPI cards and bar visual layouts to track cohort distributions and success rates.</li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200} direction="left">
              <Tilt className={styles.projectVisual} scale={1.01} maxRotation={4}>
                <AcademicPerformanceWidget />
              </Tilt>
            </ScrollReveal>
          </div>
        </div>

        {/* ── Education & Certifications ── */}
        <div id="education" className={styles.sectionContainer}>
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>05 // CREDENTIALS</span>
              <h2 className={styles.sectionTitle}>Education &amp; Certifications</h2>
            </div>
            <hr className={styles.sectionDivider} />
          </ScrollReveal>

          <div className={styles.educationGrid}>
            <ScrollReveal delay={0} direction="zoom">
              <Tilt className={styles.eduCard} scale={1.03} maxRotation={6}>
                <span className={styles.eduYear}>2024 – 2026</span>
                <h3 className={styles.eduDegree}>Master of Computer Applications (MCA)</h3>
                <p className={styles.eduSchool}>MEASI Institute of Information Technology</p>
              </Tilt>
            </ScrollReveal>
            <ScrollReveal delay={150} direction="zoom">
              <Tilt className={styles.eduCard} scale={1.03} maxRotation={6}>
                <span className={styles.eduYear}>2021 – 2024</span>
                <h3 className={styles.eduDegree}>Bachelor of Computer Applications (BCA)</h3>
                <p className={styles.eduSchool}>Merit Haji Ismail Saheb Arts and Science College</p>
              </Tilt>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={100} direction="up">
            <label className={styles.label} style={{ marginBottom: "1.25rem", display: "block" }}>
              COURSES &amp; VERIFICATIONS
            </label>
          </ScrollReveal>

          <div className={styles.certsGrid}>
            <ScrollReveal delay={150} direction="zoom">
              <Tilt className={styles.certCard} scale={1.04} maxRotation={8}>
                <div className={styles.certBadge}>UI</div>
                <div className={styles.certInfo}>
                  <h4 className={styles.certTitle}>UI/UX Design</h4>
                  <p className={styles.certOrg}>Futuro Focus</p>
                </div>
              </Tilt>
            </ScrollReveal>
            <ScrollReveal delay={250} direction="zoom">
              <Tilt className={styles.certCard} scale={1.04} maxRotation={8}>
                <div className={styles.certBadge}>DA</div>
                <div className={styles.certInfo}>
                  <h4 className={styles.certTitle}>Data Processing &amp; Business Analysis</h4>
                  <p className={styles.certOrg}>Anudip Foundation</p>
                </div>
              </Tilt>
            </ScrollReveal>
          </div>
        </div>

        {/* ── Contact Section ── */}
        <div id="contact" className={styles.sectionContainer} style={{ marginBottom: "2rem" }}>
          <ScrollReveal>
            <div className={styles.sectionHeader} style={{ textAlign: "center" }}>
              <span className={`${styles.sectionTag} ${styles.sectionTagBlue}`}>06 // ACCESS</span>
              <h2 className={styles.sectionTitle}>Get In Touch</h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className={styles.contactCard}>
              <p className={styles.contactIntro}>
                I am open to discuss business analytics projects, software engineering roles, or collaboration opportunities. Reach out via any channel below!
              </p>
              <div className={styles.contactGrid}>
                <a href="mailto:ahmedsharib298@gmail.com" className={styles.contactItem}>
                  <div className={styles.contactIcon}>✉</div>
                  <span className={styles.contactLabel}>Email</span>
                  <span className={styles.contactValue}>ahmedsharib298@gmail.com</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/sharib-ahmed-k-736398300"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactItem}
                >
                  <div className={styles.contactIcon}>in</div>
                  <span className={styles.contactLabel}>LinkedIn</span>
                  <span className={styles.contactValue}>Sharib Ahmed K</span>
                </a>

                <a href="tel:+916374525580" className={styles.contactItem}>
                  <div className={styles.contactIcon}>📞</div>
                  <span className={styles.contactLabel}>Phone</span>
                  <span className={styles.contactValue}>+91-6374525580</span>
                </a>

                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>📍</div>
                  <span className={styles.contactLabel}>Location</span>
                  <span className={styles.contactValue}>Pernambut, Vellore, Tamil Nadu</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} Sharib Ahmed K. Developed using <span>Next.js</span>, <span>Three.js</span> &amp; <span>GSAP</span>.
      </footer>

      {/* Theme Customizer is deprecated to keep layout clean */}
    </main>
  );
}
