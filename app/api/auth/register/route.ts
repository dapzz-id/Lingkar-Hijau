import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, city } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await query("SELECT id FROM users WHERE email = ?", [email])
    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const result = await query("INSERT INTO users (email, password, name, city) VALUES (?, ?, ?, ?)", [
      email,
      hashedPassword,
      name,
      city || null,
    ])

    const userId = (result as any).insertId
    const token = generateToken(userId, email)
    await setAuthCookie(token)

    return NextResponse.json({ message: "User registered successfully", userId, token }, { status: 201 })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
