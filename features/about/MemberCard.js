import { pickLocalized } from "@/lib/i18n/localize";
import { getPhotoUrl } from "./photoUrl";
import MemberAvatar from "./MemberAvatar";
import styles from "./About.module.css";

export default function MemberCard({ member, locale }) {
  const name = pickLocalized(member, "name", locale);
  const role = pickLocalized(member, "role", locale);
  const bio = pickLocalized(member, "bio", locale);
  // 사진이 없거나 불러오지 못하면 이름의 첫 글자를 아바타로 쓴다 (한글/이모지도 깨지지 않게 Array.from)
  const initial = Array.from(name)[0] ?? "";

  return (
    <article className={styles.memberCard}>
      <MemberAvatar src={getPhotoUrl(member.photo_path)} initial={initial} />
      <h3 className={styles.memberName}>{name}</h3>
      <p className={styles.memberRole}>{role}</p>
      {bio && <p className={styles.memberBio}>{bio}</p>}
    </article>
  );
}
