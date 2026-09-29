"use client";

import { useActionState, useState } from "react";
import formStyles from "@/lib/forms/Forms.module.css";
import { deleteEntry } from "./actions";
import { getErrorMessage } from "@/lib/forms/errorMessage";
import { PASSWORD_MIN, PASSWORD_MAX } from "./validation";
import styles from "./Guestbook.module.css";

const INITIAL_STATE = { status: "idle" };

export default function DeleteEntryForm({ id, labels }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(deleteEntry, INITIAL_STATE);

  if (!open) {
    return <button type="button" className={styles.deleteToggle} onClick={() => setOpen(true)}>{labels.deleteOpen}</button>;
  }

  return (
    <form action={formAction} className={styles.deleteForm}>
      <input type="hidden" name="id" value={id} />
      <label className={styles.deleteField}>
        <span className={formStyles.hint}>{labels.deletePasswordLabel}</span>
        <input className={formStyles.input} type="password" name="password" required minLength={PASSWORD_MIN} maxLength={PASSWORD_MAX} autoComplete="current-password" />
      </label>
      <div className={styles.deleteActions}>
        <button type="submit" className={styles.deleteSubmit} disabled={pending}>{pending ? labels.deleting : labels.deleteConfirm}</button>
        <button type="button" className={styles.deleteToggle} onClick={() => setOpen(false)}>{labels.deleteCancel}</button>
      </div>
      {state.status === "error" && <p role="alert" className={`${formStyles.status} ${formStyles.statusError}`}>{getErrorMessage(labels.errors, state.code)}</p>}
    </form>
  );
}
