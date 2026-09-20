import ProjectsPage from "@/features/projects/ProjectsPage";

export const metadata = { title: "Projects" };

export default function Page({ searchParams }) {
  return <ProjectsPage searchParams={searchParams} />;
}
