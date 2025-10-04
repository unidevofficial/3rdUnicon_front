import jwt from "jsonwebtoken";
import { ENV } from "@/lib/env";

type AdminTokenPayload = {
  sub: string; // admin.user_id (email)
  role: "admin";
};

export function signAdminToken(userId: string): string {
  const payload: AdminTokenPayload = { sub: userId, role: "admin" };
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "12h" });
}

export function verifyAdminToken(token?: string): AdminTokenPayload {
  if (!token) throw new Error("Missing token");
  return jwt.verify(token, ENV.JWT_SECRET) as AdminTokenPayload;
}

export function getBearerToken(authorization?: string): string | undefined {
  if (!authorization) return undefined;
  const [scheme, value] = authorization.split(" ");
  if (scheme?.toLowerCase() !== "bearer") return undefined;
  return value;
}
