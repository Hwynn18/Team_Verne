import IntroPage from "@/features/about/IntroPage";
import { getAboutMetadata } from "@/features/about/aboutMetadata";

export function generateMetadata() {
  return getAboutMetadata("aboutIntro");
}

export default function Page() {
  return <IntroPage />;
}
