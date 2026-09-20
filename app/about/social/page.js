import SocialPage from "@/features/about/SocialPage";
import { getAboutMetadata } from "@/features/about/aboutMetadata";

export function generateMetadata() {
  return getAboutMetadata("aboutSocial");
}

export default function Page() {
  return <SocialPage />;
}
