import MembersPage from "@/features/about/MembersPage";
import { getAboutMetadata } from "@/features/about/aboutMetadata";

export function generateMetadata() {
  return getAboutMetadata("aboutMembers");
}

export default function Page() {
  return <MembersPage />;
}
