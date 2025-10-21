import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const sql = `
      SELECT a.*, COUNT(ua.id) as unlocked_count
      FROM achievements a
      LEFT JOIN user_achievements ua ON a.id = ua.achievement_id
      GROUP BY a.id
      ORDER BY a.rarity DESC
    `

    const results = await query(sql)
    return NextResponse.json({ data: results }, { status: 200 })
  } catch (error) {
    console.error("[v0] Get achievements error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
