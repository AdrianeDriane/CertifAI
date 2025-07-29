import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = (payload: { id: string, email: string, fingerprint: string }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};