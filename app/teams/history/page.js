import { getDictionary } from "@/lib/i18n/server";
import { getHistoryEvents } from "@/features/teams/teamsQueries";
import HistoryTimeline from "@/features/teams/HistoryTimeline";
import TeamsMessage from "@/features/teams/TeamsMessage";
import styles from "@/features/teams/Teams.module.css";

export const metadata = { title: "History" };

export default async function Page() {
  const [{ locale, t }, result] = await Promise.all([getDictionary(), getHistoryEvents()]);
  const labels = t.teams.history;

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{t.nav.teamsHistory}</h1>
      {result.failed ? (
        <TeamsMessage tone="error">{labels.loadError}</TeamsMessage>
      ) : result.data.length === 0 ? (
        <TeamsMessage>{labels.empty}</TeamsMessage>
      ) : (
        <HistoryTimeline events={result.data} locale={locale} />
      )}
    </main>
  );
}
