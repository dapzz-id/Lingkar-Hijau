import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")

    let sql = "SELECT * FROM waste_catalog"
    const params: any[] = []

    if (category) {
      sql += " WHERE category = ?"
      params.push(category)
    }

    const results = await query(sql, params)
    return NextResponse.json({ data: results }, { status: 200 })
  } catch (error) {
    console.error("Get catalog error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
