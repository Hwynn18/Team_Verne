"use client";

import { useActionState } from "react";
import HoneypotField from "@/lib/forms/HoneypotField";
import PrivacyConsent from "@/lib/forms/PrivacyConsent";
import { getErrorMessage } from "@/lib/forms/errorMessage";
import formStyles from "@/lib/forms/Forms.module.css";
import { submitInquiry } from "./actions";
import { NAME_MAX, EMAIL_MAX, MESSAGE_MAX } from "./validation";

const INITIAL_STATE = { status: "idle" };

export default function InquiryForm({ labels }) {
  const [state, formAction, pending] = useActionState(submitInquiry, INITIAL_STATE);
  // 에러가 나면 서버가 돌려준 값으로 다시 채워서 입력한 내용이 사라지지 않게 한다
  const values = state.values ?? {};

  return (
    <form action={formAction} className={formStyles.form}>
      <h2 className={formStyles.formTitle}>{labels.formTitle}</h2>
      <div className={formStyles.row}>
        <label className={formStyles.field}>
          <span className={formStyles.label}>{labels.nameLabel}</span>
          <input className={formStyles.input} type="text" name="name" required maxLength={NAME_MAX} autoComplete="organization" defaultValue={values.name ?? ""} />
        </label>
        <label className={formStyles.field}>
          <span className={formStyles.label}>{labels.emailLabel}</span>
          <input className={formStyles.input} type="email" name="email" required maxLength={EMAIL_MAX} autoComplete="email" defaultValue={values.email ?? ""} />
        </label>
      </div>
      <label className={formStyles.field}>
        <span className={formStyles.label}>{labels.messageLabel}</span>
        <textarea className={formStyles.textarea} name="message" required maxLength={MESSAGE_MAX} rows={8} defaultValue={values.message ?? ""} />
      </label>
      <HoneypotField />
      {/* 기획서: 개인정보 동의 문구는 제출 버튼 바로 위 */}
      <PrivacyConsent labels={labels.privacy} />
      {state.status === "error" && <p role="alert" className={`${formStyles.status} ${formStyles.statusError}`}>{getErrorMessage(labels.errors, state.code)}</p>}
      {state.status === "success" && <p role="status" className={`${formStyles.status} ${formStyles.statusSuccess}`}>{labels.success}</p>}
      <button type="submit" className={formStyles.button} disabled={pending}>{pending ? labels.submitting : labels.submit}</button>
    </form>
  );
}
