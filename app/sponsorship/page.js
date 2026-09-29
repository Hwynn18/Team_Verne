import { getDictionary } from "@/lib/i18n/server";
import SponsorshipPage from "@/features/sponsorship/SponsorshipPage";

export async function generateMetadata() {
  const { t } = await getDictionary();
  return { title: t.nav.sponsorship };
}

export default function Page() {
  return <SponsorshipPage />;
}
