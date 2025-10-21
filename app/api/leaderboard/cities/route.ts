import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const sql = `
      SELECT 
        city,
        COUNT(*) as user_count,
        SUM(points) as total_points,
        AVG(level) as avg_level
      FROM users
      WHERE city IS NOT NULL
      GROUP BY city
      ORDER BY total_points DESC
      LIMIT 20
    `

    const results = await query(sql)
    return NextResponse.json({ data: results }, { status: 200 })
  } catch (error) {
    console.error("[v0] Get city leaderboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
