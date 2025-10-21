import { type NextRequest, NextResponse } from "next/server"
import { getAuthCookie, verifyToken } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthCookie()

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get user data
    const users = await query("SELECT * FROM users WHERE id = ?", [decoded.userId])
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = users[0] as any
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          city: user.city,
          points: user.points,
          level: user.level,
          avatar_url: user.avatar_url,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
