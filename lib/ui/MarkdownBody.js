import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { isAllowedBodyImageUrl } from "@/lib/storage/publicImage";
import styles from "./MarkdownBody.module.css";

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
    console.error("[MarkdownBody] blocked image src:", src);
    return null;
  }
  // 마크다운이라 원본 크기를 모른다. 16:9로 자리만 잡고, CSS height:auto가 로드 후 실제 비율로 맞춘다.
  return <Image src={src} alt={alt ?? ""} width={1600} height={900} sizes="(max-width: 768px) 100vw, 780px" className={styles.image} />;
}

export default function MarkdownBody({ markdown }) {
  return (
    <div className={styles.body}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={{ a: SafeLink, img: SafeImage }}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
