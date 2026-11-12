import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { getDictionary } from "@/lib/i18n/server";
import { NAV_ITEMS } from "./navConfig";
import SidebarShell from "./SidebarShell";
import SidebarNav from "./SidebarNav";
import LanguageToggle from "./LanguageToggle";
import InstagramLink from "./InstagramLink";
import styles from "./Sidebar.module.css";

export default async function Sidebar() {
  const { locale, t } = await getDictionary();
  const { name, logo } = siteConfig;

  return (
    <>
      {/* 모바일에서 사이드바가 닫혀 있을 때 보이는 상단 로고 */}
      <Link href="/" className={styles.mobileLogo} aria-label={name}>
        <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} />
      </Link>
      <SidebarShell openLabel={t.sidebar.menuOpen} closeLabel={t.sidebar.menuClose}>
        <div className={styles.top}>
          <Link href="/" className={styles.logo} aria-label={name}>
            <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} priority />
          </Link>
          <LanguageToggle current={locale} label={t.sidebar.languageLabel} errorMessage={t.sidebar.languageError} />
        </div>
        <SidebarNav items={NAV_ITEMS} labels={t.nav} ariaLabel={t.sidebar.navLabel} />
        <div className={styles.footer}>
          <InstagramLink label={t.sidebar.instagramLabel} />
        </div>
      </SidebarShell>
    </>
  );
}
