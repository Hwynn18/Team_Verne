export function pickLocalized(row, field, locale) {
  const value = row[`${field}_${locale}`];
  if (typeof value !== "string") {
    throw new Error(`Missing localized field: ${field}_${locale}`);
  }
  return value;
}
