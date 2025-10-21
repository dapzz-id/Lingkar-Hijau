import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId: number, email: string) {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string }
  } catch {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

export async function getAuthCookie() {
  const cookieStore = await cookies()
  return cookieStore.get("auth_token")?.value
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth_token")
}
