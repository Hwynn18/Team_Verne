"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Sidebar.module.css";

// Sidebar.module.css / globals.css 의 768px 브레이크포인트와 같은 값이어야 함
const DESKTOP_QUERY = "(min-width: 769px)";

export default function SidebarShell({ openLabel, closeLabel, children }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    function handleChange(event) {
      if (event.matches) setOpen(false);
    }
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  function handleSidebarClick(event) {
    if (event.target.closest("a")) setOpen(false);
  }

  return (
    <>
      <button type="button" ref={buttonRef} className={styles.menuButton} aria-label={open ? closeLabel : openLabel} aria-expanded={open} aria-controls="site-sidebar" onClick={() => setOpen((value) => !value)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <div className={styles.backdrop} data-open={open} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside id="site-sidebar" className={open ? `${styles.sidebar} ${styles.sidebarOpen}` : styles.sidebar} onClick={handleSidebarClick}>
        {children}
      </aside>
    </>
  );
}
