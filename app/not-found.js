import { getDictionary } from "@/lib/i18n/server";
import NotFoundPage from "@/features/notFound/NotFoundPage";

export async function generateMetadata() {
  const { t } = await getDictionary();
  return { title: t.notFound.title };
}

export default function NotFound() {
  return <NotFoundPage />;
}
