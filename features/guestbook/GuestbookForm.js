"use client";

import { useActionState } from "react";
import HoneypotField from "@/lib/forms/HoneypotField";
import PrivacyConsent from "@/lib/forms/PrivacyConsent";
import formStyles from "@/lib/forms/Forms.module.css";
import { createEntry } from "./actions";
import { getErrorMessage } from "./errorMessage";
import { NICKNAME_MAX, PASSWORD_MIN, PASSWORD_MAX, MESSAGE_MAX } from "./validation";

const INITIAL_STATE = { status: "idle" };

export default function GuestbookForm({ labels }) {
  const [state, formAction, pending] = useActionState(createEntry, INITIAL_STATE);
  // 에러가 나면 서버가 돌려준 값으로 다시 채워서 입력한 내용이 사라지지 않게 한다 (비밀번호는 제외)
  const values = state.values ?? {};

  return (
    <form action={formAction} className={formStyles.form}>
      <h2 className={formStyles.formTitle}>{labels.formTitle}</h2>
      <div className={formStyles.row}>
        <label className={formStyles.field}>
          <span className={formStyles.label}>{labels.nicknameLabel}</span>
          <input className={formStyles.input} type="text" name="nickname" required maxLength={NICKNAME_MAX} autoComplete="nickname" defaultValue={values.nickname ?? ""} />
        </label>
        <label className={formStyles.field}>
          <span className={formStyles.label}>{labels.passwordLabel}</span>
          <input className={formStyles.input} type="password" name="password" required minLength={PASSWORD_MIN} maxLength={PASSWORD_MAX} autoComplete="new-password" />
          <span className={formStyles.hint}>{labels.passwordHint}</span>
        </label>
      </div>
      <label className={formStyles.field}>
        <span className={formStyles.label}>{labels.messageLabel}</span>
        <textarea className={formStyles.textarea} name="message" required maxLength={MESSAGE_MAX} defaultValue={values.message ?? ""} />
      </label>
      <HoneypotField />
      <PrivacyConsent labels={labels.privacy} />
      {state.status === "error" && <p role="alert" className={`${formStyles.status} ${formStyles.statusError}`}>{getErrorMessage(labels.errors, state.code)}</p>}
      {state.status === "success" && <p role="status" className={`${formStyles.status} ${formStyles.statusSuccess}`}>{labels.success}</p>}
      <button type="submit" className={formStyles.button} disabled={pending}>{pending ? labels.submitting : labels.submit}</button>
    </form>
  );
}
