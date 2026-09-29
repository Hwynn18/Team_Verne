export function getErrorMessage(errors, code) {
  const message = errors[code];
  if (!message) {
    throw new Error(`Missing guestbook error message: ${code}`);
  }
  return message;
}
