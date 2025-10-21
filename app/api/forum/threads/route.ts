import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const sort = searchParams.get("sort") || "latest"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = 10
    const offset = (page - 1) * limit

    let sql = `
      SELECT ft.*, u.name as author_name, u.city as author_city,
             (SELECT COUNT(*) FROM forum_comments WHERE thread_id = ft.id) as replies_count
      FROM forum_threads ft
      JOIN users u ON ft.author_id = u.id
    `
    const params: any[] = []

    if (category) {
      sql += " WHERE ft.category = ?"
      params.push(category)
    }

    // Sorting
    if (sort === "popular") {
      sql += " ORDER BY ft.likes DESC"
    } else if (sort === "most_viewed") {
      sql += " ORDER BY ft.views DESC"
    } else {
      sql += " ORDER BY ft.created_at DESC"
    }

    sql += " LIMIT ? OFFSET ?"
    params.push(limit, offset)

    const results = await query(sql, params)
    return NextResponse.json({ data: results }, { status: 200 })
  } catch (error) {
    console.error("Get forum threads error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
