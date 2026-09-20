import ProjectDetailPage from "@/features/projects/ProjectDetailPage";
import { getProjectMetadata } from "@/features/projects/projectMetadata";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return getProjectMetadata(slug);
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <ProjectDetailPage slug={slug} />;
}
