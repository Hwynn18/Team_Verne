"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_COOKIE, LOCALE_MAX_AGE, isLocale } from "@/lib/i18n/config";
import styles from "./Sidebar.module.css";

function saveLocaleCookie(locale) {
  if (!isLocale(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${LOCALE_MAX_AGE}; SameSite=Lax${secure}`;
  if (!document.cookie.split("; ").includes(`${LOCALE_COOKIE}=${locale}`)) {
    throw new Error("Locale cookie was not saved");
  }
}

export default function LanguageToggle({ current, label, errorMessage }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [hasError, setHasError] = useState(false);

  function handleSelect(locale) {
    if (locale === current || isPending) return;
    try {
      saveLocaleCookie(locale);
      setHasError(false);
      startTransition(() => router.refresh());
    } catch (error) {
      console.error("[LanguageToggle]", error);
      setHasError(true);
    }
  }

  return (
    <div className={styles.langWrap}>
      <div className={styles.langToggle} role="group" aria-label={label}>
        {LOCALES.map((locale) => (
          <button
            key={locale}
            type="button"
            className={styles.langButton}
            aria-pressed={locale === current}
            disabled={isPending}
            onClick={() => handleSelect(locale)}
          >
            {locale.toUpperCase()}
          </button>
        ))}
      </div>
      {hasError && (
        <p role="alert" className={styles.langError}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
