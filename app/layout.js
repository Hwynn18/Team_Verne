import { mainFont } from "@/lib/config/fonts";
import { siteConfig } from "@/lib/config/site";
import "@/styles/theme.css";
import "@/styles/globals.css";

export const metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={mainFont.variable}>
      <body>{children}</body>
    </html>
  );
}
