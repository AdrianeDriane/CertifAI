import crypto from "crypto";

export function hashSfdt(sfdt: any): string {
  // Stable string → hash → hex
  const body = JSON.stringify(sfdt);
  return crypto.createHash("sha256").update(body).digest("hex");
}
