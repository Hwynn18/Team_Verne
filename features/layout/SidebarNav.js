import NavLink from "./NavLink";
import NavGroup from "./NavGroup";
import styles from "./Sidebar.module.css";

function getLabel(labels, key) {
  const label = labels[key];
  if (!label) {
    throw new Error(`Missing nav label: ${key}`);
  }
  return label;
}

export default function SidebarNav({ items, labels, ariaLabel }) {
  return (
    <nav aria-label={ariaLabel} className={styles.nav}>
      <ul className={styles.navList}>
        {items.map((item) =>
          item.children ? (
            <NavGroup key={item.key} label={getLabel(labels, item.key)} hrefs={item.children.map((child) => child.href)}>
              <ul className={styles.flyout}>
                {item.children.map((child) => (
                  <li key={child.key}>
                    <NavLink href={child.href} variant="flyout">{getLabel(labels, child.key)}</NavLink>
                  </li>
                ))}
              </ul>
            </NavGroup>
          ) : (
            <li key={item.key} className={styles.navItem}>
              <NavLink href={item.href} variant="entry">{getLabel(labels, item.key)}</NavLink>
            </li>
          )
        )}
      </ul>
    </nav>
  );
}
