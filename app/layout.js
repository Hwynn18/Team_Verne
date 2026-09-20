import { mainFont } from "@/lib/config/fonts";
import { siteConfig } from "@/lib/config/site";
import { getLocale } from "@/lib/i18n/server";
import Sidebar from "@/features/layout/Sidebar";
import "@/styles/theme.css";
import "@/styles/globals.css";

export const metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={mainFont.variable}>
      <body>
        <Sidebar />
        <div className="app-content">{children}</div>
      </body>
    </html>
  );
}
