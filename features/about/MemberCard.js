import { pickLocalized } from "@/lib/i18n/localize";
import styles from "./About.module.css";

export default function MemberCard({ member, locale }) {
  const name = pickLocalized(member, "name", locale);
  const role = pickLocalized(member, "role", locale);
  const bio = pickLocalized(member, "bio", locale);
  // 사진이 없는 동안 이름의 첫 글자를 아바타로 쓴다 (한글/이모지도 깨지지 않게 Array.from)
  const initial = Array.from(name)[0] ?? "";

  return (
    <article className={styles.memberCard}>
      <div className={styles.avatar} aria-hidden="true">{initial}</div>
      <h3 className={styles.memberName}>{name}</h3>
      <p className={styles.memberRole}>{role}</p>
      {bio && <p className={styles.memberBio}>{bio}</p>}
    </article>
  );
}
