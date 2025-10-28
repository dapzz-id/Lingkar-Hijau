import { query } from "@/lib/db"
import { getAuthCookie, verifyToken } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const token = await getAuthCookie()
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { points } = await req.json()

    const newLevel = Math.floor(points / 500) + 1

        await query(
          "UPDATE users SET level = ? WHERE id = ?",
          [newLevel, payload.userId]
        )
    
        return NextResponse.json({
      success: true,
      message: "Level updated successfully",
      level: newLevel,
    })
  } catch (err: any) {
    console.error("Error updating level:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
