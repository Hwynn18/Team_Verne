"use client";

import { motion } from "motion/react";
import { pickLocalized } from "@/lib/i18n/localize";
import { formatEventDate } from "./formatEventDate";
import { useScrollReveal } from "./useScrollReveal";
import styles from "./Teams.module.css";

function TimelineItem({ event, locale }) {
  const { ref, visible, reduceMotion } = useScrollReveal();
  const title = pickLocalized(event, "title", locale);
  const description = pickLocalized(event, "description", locale);

  return (
    <li ref={ref} className={styles.timelineItem}>
      <motion.div
        className={styles.timelineContent}
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <span className={styles.timelineDate}>{formatEventDate(event.event_date)}</span>
        <h3 className={styles.timelineTitle}>{title}</h3>
        {description && <p className={styles.timelineDescription}>{description}</p>}
      </motion.div>
    </li>
  );
}

export default function HistoryTimeline({ events, locale }) {
  return (
    <ol className={styles.timeline}>
      {events.map((event) => (
        <TimelineItem key={event.id} event={event} locale={locale} />
      ))}
    </ol>
  );
}
