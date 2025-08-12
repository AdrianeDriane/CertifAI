import type { DocumentData } from "../layouts/DocumentLayout"; // adjust path as needed

export function getLatestSfdt(document: DocumentData): string | null {
  if (!document?.versions || document.versions.length === 0) return null;

  const latestVersion = document.versions.reduce((prev, curr) =>
    curr.version > prev.version ? curr : prev
  );

  return latestVersion.sfdt || null;
}
