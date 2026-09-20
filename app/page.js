import Image from "next/image";
import { siteConfig } from "@/lib/config/site";

export default function HomePage() {
  const { name, logo } = siteConfig;
  return (
    <main className="placeholder">
      <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} priority />
      <h1>{name}</h1>
    </main>
  );
}
