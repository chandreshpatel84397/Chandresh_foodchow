"use client";

import { useState, useEffect } from "react";
import styles from "./login.module.css";

const slides = [
  { image: "/slide1.jpeg" },
  { image: "/slide2.jpeg" },
  { image: "/slide3.jpeg" },
];

const VALID_EMAIL = "admin@foodchow1234";
const VALID_PASSWORD = "admin1234";

export default function LoginPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = () => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      window.location.href = "/dashboard";
    } else {
      const showSwal = (w: any) => {
        w.Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Invalid email or password. Please try again.",
          confirmButtonColor: "#19b89e",
          confirmButtonText: "OK",
        });
      };

      if ((window as any).Swal) {
        showSwal(window);
      } else {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js";
        script.onload = () => showSwal(window);
        document.head.appendChild(script);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className={styles.container}>
      {/* LEFT PANEL */}
      <div className={styles.leftPanel}>
        <div className={styles.sliderLogo}>
          <span className={styles.sliderLogoText}>F🍴OD CHOW</span>
        </div>

        <div className={styles.sliderWrapper}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`${styles.slide} ${index === currentSlide ? styles.slideActive : ""}`}
            >
              <img src={slide.image} alt={`slide-${index}`} className={styles.slideImage} />
            </div>
          ))}
        </div>

        <div className={styles.dots}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          <div className={styles.logoWrapper}>
            <div className={styles.logoCircle}>
              <span>🍴</span>
            </div>
            <div className={styles.logoTextGroup}>
              <span className={styles.logoFood}>F<span className={styles.logoO}>O</span>OD</span>
              <span className={styles.logoChow}>CHOW</span>
            </div>
          </div>

          <h1 className={styles.welcomeTitle}>Welcome To FoodChow</h1>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="text"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            <div className={styles.forgotRow}>
              <a href="#" className={styles.forgotLink}>Forgot Password?</a>
            </div>
          </div>

          <div className={styles.rememberRow}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className={styles.checkbox}
            />
            <label htmlFor="rememberMe" className={styles.rememberLabel}>Remember Me</label>
          </div>

          <button className={styles.loginBtn} onClick={handleLogin}>LOGIN</button>

          <p className={styles.signupText}>
            Don't have an account? <a href="#" className={styles.signupLink}>Signup</a>
          </p>
        </div>
      </div>
    </div>
  );
}