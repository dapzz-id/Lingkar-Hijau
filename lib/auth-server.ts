import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"

export async function getUserFromServer() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  if (!token) return null

  try {
    return jwt.verify(token, JWT_SECRET) as { userId?: string } | null
  } catch {
    return null
  }
}