"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath } from "./isActivePath";
import styles from "./Sidebar.module.css";

const VARIANT_CLASS = { entry: styles.navEntry, flyout: styles.flyoutLink };

export default function NavLink({ href, variant, children }) {
  const pathname = usePathname();
  const baseClass = VARIANT_CLASS[variant];
  if (!baseClass) {
    throw new Error(`Unknown NavLink variant: ${variant}`);
  }
  const active = isActivePath(pathname, href);
  const className = active ? `${baseClass} ${styles.active}` : baseClass;

  return (
    <Link href={href} className={className} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}
