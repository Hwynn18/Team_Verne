import NewsListPage from "@/features/about/NewsListPage";
import { getAboutMetadata } from "@/features/about/aboutMetadata";

export function generateMetadata() {
  return getAboutMetadata("aboutNews");
}

export default function Page() {
  return <NewsListPage />;
}
