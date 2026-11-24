import { MAIN_FONT_FAMILY } from "@/lib/config/fonts";
import { siteConfig } from "@/lib/config/site";
import { getDictionary } from "@/lib/i18n/server";
import Sidebar from "@/features/layout/Sidebar";
import "@/styles/theme.css";
import "@/styles/globals.css";

export const metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
};

export default async function RootLayout({ children }) {
  const { locale, t } = await getDictionary();

  return (
    <html lang={locale} style={{ "--font-main": MAIN_FONT_FAMILY }}>
      <body>
        <a href="#main-content" className="skip-link">{t.sidebar.skipToContent}</a>
        <Sidebar />
        <div id="main-content" className="app-content">{children}</div>
      </body>
    </html>
  );
}
