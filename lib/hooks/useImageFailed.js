import { useEffect, useRef, useState } from "react";

// 이미지 로딩 실패를 추적한다. 하이드레이션 전에 이미 실패한 경우는 onError를 놓치므로 마운트 뒤 한 번 더 확인한다.
export function useImageFailed(src) {
  const [failed, setFailed] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const image = imageRef.current;
    if (image && image.complete && image.naturalWidth === 0) setFailed(true);
  }, [src]);

  return { failed, imageRef, handleError: () => setFailed(true) };
}
