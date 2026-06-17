"use client";

import React, { useState, useRef } from "react";
import styles from "./ProjectWidget.module.css";

// ============================================================================
// 1. PROJECT 1 WIDGET: Student Registration & Profile Management System
// ============================================================================
export function StudentRegistrationWidget() {
  const [step, setStep] = useState<"register" | "otp" | "dashboard">("register");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [students, setStudents] = useState([
    { id: "S101", name: "Amit Kumar", role: "Student", status: "Active" },
    { id: "S102", name: "Aria Chen", role: "Student", status: "Active" },
    { id: "S103", name: "Ryan Dev", role: "Student", status: "Pending" },
  ]);
  const [newStudent, setNewStudent] = useState("");
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setFeedback("OTP Sent! (Use code '1234' to test)");
    setStep("otp");
  };

  const handleOtpChange = (index: number, val: string) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const fullOtp = otp.join("");
    if (fullOtp === "1234") {
      setError("");
      setFeedback("");
      setStep("dashboard");
    } else {
      setError("Invalid security code. Hint: Use 1234");
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.trim()) return;
    const id = "S" + (100 + students.length + 1);
    setStudents([...students, { id, name: newStudent.trim(), role: "Student", status: "Active" }]);
    setNewStudent("");
  };

  return (
    <div className={styles.widgetContainer}>
      <div className={`${styles.widgetTitle} ${styles.emberTheme}`}>
        SECURE GATEWAY & ADMIN CONSOLE
      </div>

      {step === "register" && (
        <form onSubmit={handleSendOtp} className={styles.dashboardPanel}>
          <div className={styles.formGroup}>
            <label className={styles.label}>ADMIN / STAFF EMAIL</label>
            <input
              type="email"
              className={styles.input}
              placeholder="admin@academy.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            Request Access Code
          </button>
          {error && <p className={`${styles.feedbackText} ${styles.errorText}`}>{error}</p>}
        </form>
      )}

      {step === "otp" && (
        <div className={styles.dashboardPanel}>
          <div className={styles.formGroup}>
            <label className={styles.label}>ENTER 4-DIGIT SECURITY CODE</label>
            <div className={styles.otpInputContainer}>
              {otp.map((char, index) => (
                <input
                  key={index}
                  ref={otpRefs[index]}
                  type="text"
                  maxLength={1}
                  className={`${styles.input} ${styles.otpCharInput}`}
                  value={char}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>
            <p className={`${styles.feedbackText} ${styles.successText}`}>{feedback}</p>
          </div>
          <button onClick={handleVerifyOtp} className={styles.button}>
            Verify Authenticity
          </button>
          {error && <p className={`${styles.feedbackText} ${styles.errorText}`}>{error}</p>}
        </div>
      )}

      {step === "dashboard" && (
        <div className={styles.dashboardPanel}>
          <div className={styles.dashHeader}>
            <span className={styles.dashTitle}>REGISTRATION DASHBOARD</span>
            <span className={styles.badge}>Live System</span>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statVal}>{students.length}</div>
              <div className={styles.statLabel}>Total</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statVal}>98.4%</div>
              <div className={styles.statLabel}>Attendance</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statVal}>Active</div>
              <div className={styles.statLabel}>DB Connection</div>
            </div>
          </div>

          <label className={styles.label}>ACTIVE STUDENT REGISTRY (MONGODB)</label>
          <table className={styles.studentTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.role}</td>
                  <td style={{ color: student.status === "Active" ? "#5cf5a4" : "#ffb85c" }}>
                    {student.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <form onSubmit={handleAddStudent} className={styles.addStudentRow}>
            <input
              type="text"
              placeholder="Register new student..."
              className={styles.addStudentInput}
              value={newStudent}
              onChange={(e) => setNewStudent(e.target.value)}
            />
            <button type="submit" className={styles.addStudentBtn}>
              + ADD
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. PROJECT 2 WIDGET: Student Academic Performance Dashboard
// ============================================================================
type ClassFilter = "All" | "Class-A" | "Class-B";

interface SubjectData {
  name: string;
  score: number;
}

export function AcademicPerformanceWidget() {
  const [filter, setFilter] = useState<ClassFilter>("All");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dataMap: Record<ClassFilter, { avg: number; passRate: number; total: number; subjects: SubjectData[] }> = {
    All: {
      avg: 84.5,
      passRate: 92,
      total: 150,
      subjects: [
        { name: "Math", score: 78 },
        { name: "Science", score: 82 },
        { name: "Python", score: 91 },
        { name: "Design", score: 86 },
      ],
    },
    "Class-A": {
      avg: 89.2,
      passRate: 98,
      total: 70,
      subjects: [
        { name: "Math", score: 85 },
        { name: "Science", score: 88 },
        { name: "Python", score: 95 },
        { name: "Design", score: 90 },
      ],
    },
    "Class-B": {
      avg: 79.8,
      passRate: 86,
      total: 80,
      subjects: [
        { name: "Math", score: 71 },
        { name: "Science", score: 76 },
        { name: "Python", score: 87 },
        { name: "Design", score: 82 },
      ],
    },
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const currentData = dataMap[filter];

  return (
    <div className={styles.widgetContainer}>
      <div className={styles.widgetTitle}>
        ANALYTICS INTERACTION PANEL
      </div>

      <div className={styles.analyticsFilter}>
        {(["All", "Class-A", "Class-B"] as ClassFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""}`}
          >
            {f === "All" ? "Cohort (All)" : f.replace("-", " ")}
          </button>
        ))}
      </div>

      <div className={styles.statsGrid} style={{ opacity: isRefreshing ? 0.5 : 1, transition: "opacity 0.2s" }}>
        <div className={styles.statCard}>
          <div className={`${styles.statVal} ${styles.statValBlue}`}>{currentData.avg}%</div>
          <div className={styles.statLabel}>Avg Grade</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statVal} ${styles.statValBlue}`}>{currentData.passRate}%</div>
          <div className={styles.statLabel}>Pass Rate</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statVal} ${styles.statValBlue}`}>{currentData.total}</div>
          <div className={styles.statLabel}>Students</div>
        </div>
      </div>

      <div className={styles.chartSection} style={{ opacity: isRefreshing ? 0.3 : 1, transition: "opacity 0.2s" }}>
        <label className={styles.label} style={{ marginBottom: "0.75rem", display: "block" }}>
          SUBJECT PERFORMANCE METRICS
        </label>
        <div className={styles.chartContainer}>
          <svg viewBox="0 0 340 180" width="100%" height="100%">
            {/* Grid Lines */}
            <line x1="40" y1="30" x2="320" y2="30" stroke="rgba(243, 239, 230, 0.07)" strokeDasharray="3 3" />
            <line x1="40" y1="70" x2="320" y2="70" stroke="rgba(243, 239, 230, 0.07)" strokeDasharray="3 3" />
            <line x1="40" y1="110" x2="320" y2="110" stroke="rgba(243, 239, 230, 0.07)" strokeDasharray="3 3" />
            <line x1="40" y1="150" x2="320" y2="150" stroke="rgba(243, 239, 230, 0.2)" />

            {/* Y Axis Labels */}
            <text x="10" y="34" className={styles.svgText}>100%</text>
            <text x="15" y="74" className={styles.svgText}>60%</text>
            <text x="15" y="114" className={styles.svgText}>30%</text>
            <text x="20" y="154" className={styles.svgText}>0%</text>

            {/* Bar Charts rendering */}
            {currentData.subjects.map((sub, idx) => {
              const startX = 65 + idx * 65;
              const barHeight = (sub.score / 100) * 120; // max 120 pixels
              const barY = 150 - barHeight;

              return (
                <g key={sub.name}>
                  {/* Background Bar track */}
                  <rect
                    x={startX}
                    y="30"
                    width="30"
                    height="120"
                    rx="3"
                    fill="rgba(243, 239, 230, 0.03)"
                  />
                  {/* Value Bar */}
                  <rect
                    x={startX}
                    y={barY}
                    width="30"
                    height={barHeight}
                    rx="3"
                    className={styles.svgBar}
                    fill={filter === "Class-A" ? "url(#glowBlueStrong)" : "url(#glowBlue)"}
                  />
                  {/* Label */}
                  <text
                    x={startX + 15}
                    y="166"
                    textAnchor="middle"
                    className={styles.svgText}
                    style={{ fill: "var(--paper)" }}
                  >
                    {sub.name}
                  </text>
                  {/* Score Text above bar */}
                  <text
                    x={startX + 15}
                    y={barY - 6}
                    textAnchor="middle"
                    className={styles.svgText}
                    style={{ fill: "var(--monitor-blue)", fontWeight: "bold" }}
                  >
                    {sub.score}%
                  </text>
                </g>
              );
            })}

            {/* SVG Gradients definitions */}
            <defs>
              <linearGradient id="glowBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--monitor-blue)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#224e75" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="glowBlueStrong" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8fd0ff" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--monitor-blue)" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className={styles.dashboardFooter}>
        <span>SOURCE: EXCEL & POWER BI DATA MODEL</span>
        <button className={styles.refreshBtn} onClick={handleRefresh} disabled={isRefreshing}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.6s ease", transform: isRefreshing ? "rotate(360deg)" : "rotate(0deg)" }}>
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
          </svg>
          {isRefreshing ? "CALCULATING..." : "REFRESH DAX"}
        </button>
      </div>


    </div>
  );
}
