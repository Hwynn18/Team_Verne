import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { isAllowedBodyImageUrl } from "@/lib/storage/publicImage";
import styles from "./About.module.css";

// react-markdown은 기본적으로 원본 HTML을 렌더링하지 않는다(rehype-raw를 안 붙였으니까). 여기서는 그 위에 링크/이미지만 추가로 검증한다.
function SafeLink({ href, children, ...props }) {
  if (typeof href !== "string" || !href.startsWith("https://")) {
    return <>{children}</>;
  }
  return (
    <a {...props} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function SafeImage({ src, alt }) {
  if (typeof src !== "string" || !isAllowedBodyImageUrl(src)) {
    console.error("[NewsBody] blocked image src:", src);
    return null;
  }
  return <img src={src} alt={alt ?? ""} className={styles.bodyImage} loading="lazy" />;
}

export default function NewsBody({ markdown }) {
  return (
    <div className={styles.detailBody}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={{ a: SafeLink, img: SafeImage }}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
