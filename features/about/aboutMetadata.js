import { getDictionary } from "@/lib/i18n/server";

export async function getAboutMetadata(navKey) {
  const { t } = await getDictionary();
  const title = t.nav[navKey];
  if (!title) {
    throw new Error(`Missing nav label: ${navKey}`);
  }
  return { title };
}
