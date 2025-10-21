import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const city = searchParams.get("city")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = 20
    const offset = (page - 1) * limit

    let sql = "SELECT id, name, city, points, level FROM users"
    const params: any[] = []

    if (city) {
      sql += " WHERE city = ?"
      params.push(city)
    }

    sql += " ORDER BY points DESC LIMIT ? OFFSET ?"
    params.push(limit, offset)

    const results = await query(sql, params)
    return NextResponse.json({ data: results }, { status: 200 })
  } catch (error) {
    console.error("[v0] Get user leaderboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
