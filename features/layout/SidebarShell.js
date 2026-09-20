"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Sidebar.module.css";

// Sidebar.module.css / globals.css 의 768px 브레이크포인트와 같은 값이어야 함
const DESKTOP_QUERY = "(min-width: 769px)";
const FOCUSABLE = "a[href], button:not([disabled])";

// 사이드바 안의 보이는 포커스 대상 + 햄버거(X) 버튼. 순서: 사이드바 위→아래, 마지막이 버튼
function getFocusableItems(sidebar, menuButton) {
  const inside = Array.from(sidebar.querySelectorAll(FOCUSABLE)).filter((element) => element.getClientRects().length > 0);
  return [...inside, menuButton];
}

export default function SidebarShell({ openLabel, closeLabel, children }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const sidebar = sidebarRef.current;
    const menuButton = buttonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getFocusableItems(sidebar, menuButton)[0].focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      // 아코디언이 열리고 닫히면 목록이 바뀌니까 Tab 누를 때마다 다시 계산
      const items = getFocusableItems(sidebar, menuButton);
      const index = items.indexOf(document.activeElement);
      const step = event.shiftKey ? -1 : 1;
      const fallback = event.shiftKey ? items.length - 1 : 0;
      const next = index === -1 ? fallback : (index + step + items.length) % items.length;
      event.preventDefault();
      items[next].focus();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      menuButton.focus();
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
      <aside id="site-sidebar" ref={sidebarRef} className={open ? `${styles.sidebar} ${styles.sidebarOpen}` : styles.sidebar} onClick={handleSidebarClick}>
        {children}
      </aside>
    </>
  );
}
