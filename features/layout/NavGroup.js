"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { isActivePath } from "./isActivePath";
import styles from "./Sidebar.module.css";

export default function NavGroup({ label, hrefs, children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = hrefs.some((href) => isActivePath(pathname, href));
  const className = `${styles.navEntry} ${styles.hasFlyout}${active ? ` ${styles.active}` : ""}`;

  return (
    <li className={styles.navItem} data-open={open}>
      <button type="button" className={className} aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {label}
      </button>
      {children}
    </li>
  );
}
