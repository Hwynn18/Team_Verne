import { getDictionary } from "@/lib/i18n/server";
import GuestbookPage from "@/features/guestbook/GuestbookPage";

export async function generateMetadata() {
  const { t } = await getDictionary();
  return { title: t.nav.guestbook };
}

export default function Page() {
  return <GuestbookPage />;
}
