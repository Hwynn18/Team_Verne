import NewsDetailPage from "@/features/about/NewsDetailPage";
import { getNewsMetadata } from "@/features/about/newsMetadata";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return getNewsMetadata(slug);
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <NewsDetailPage slug={slug} />;
}
