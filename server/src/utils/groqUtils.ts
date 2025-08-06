export function sanitizeToValidJSON(raw: string): string {
  return raw
    .replace(/^```(?:json)?/i, "") // remove starting ```
    .replace(/```$/, "") // remove ending ```
    .replace(/[“”]/g, '"') // replace fancy double quotes
    .replace(/[‘’]/g, "'") // replace fancy single quotes
    .replace(/\r?\n|\r/g, "") // remove line breaks
    .trim();
}
