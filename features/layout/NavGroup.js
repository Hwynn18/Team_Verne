"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { isActivePath } from "./isActivePath";
import styles from "./Sidebar.module.css";

export default function NavGroup({ label, hrefs, children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const active = hrefs.some((href) => isActivePath(pathname, href));
  const className = `${styles.navEntry} ${styles.hasFlyout}${active ? ` ${styles.active}` : ""}`;

  // 마우스로 클릭해서 남은 포커스가 있으면 마우스가 벗어날 때 놓아준다.
  // 키보드(Tab)로 들어온 포커스는 그대로 둬서 하위 메뉴가 계속 보이게 한다.
  function handleMouseLeave() {
    if (document.activeElement === buttonRef.current) {
      buttonRef.current.blur();
    }
  }

  return (
    <li className={styles.navItem} data-open={open} onMouseLeave={handleMouseLeave}>
      <button type="button" ref={buttonRef} className={className} aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {label}
      </button>
      {children}
    </li>
  );
}
