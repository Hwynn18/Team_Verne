"use client";

import { motion } from "motion/react";
import { pickLocalized } from "@/lib/i18n/localize";
import { useScrollReveal } from "./useScrollReveal";
import styles from "./Teams.module.css";

export default function DepartmentSection({ department, members, index, labels, locale }) {
  const { ref, visible, reduceMotion } = useScrollReveal();
  // 짝수/홀수 인덱스로 좌우를 교차시킨다 (지그재그)
  const align = index % 2 === 0 ? styles.sectionLeft : styles.sectionRight;
  const fromX = index % 2 === 0 ? -32 : 32;

  return (
    <section ref={ref} className={`${styles.departmentSection} ${align}`} aria-labelledby={`dept-${department.slug}`}>
      <motion.div
        className={styles.departmentInner}
        initial={reduceMotion ? false : { opacity: 0, x: fromX }}
        animate={visible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 id={`dept-${department.slug}`} className={styles.departmentName}>{pickLocalized(department, "name", locale)}</h2>
        {members.length === 0 ? (
          <p className={styles.departmentEmpty}>{labels.emptyMembers}</p>
        ) : (
          <ul className={styles.departmentMemberList}>
            {members.map((member) => (
              <li key={member.id} className={styles.departmentMember}>
                <span className={styles.departmentMemberName}>{pickLocalized(member, "name", locale)}</span>
                <span className={styles.departmentMemberRole}>{pickLocalized(member, "role", locale)}</span>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </section>
  );
}
