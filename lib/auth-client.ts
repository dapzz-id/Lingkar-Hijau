import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "your_jwt_secret_key"

export function getAuthCookie() {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(^| )auth_token=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : null
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId?: string } | null
  } catch {
    return null
  }
}