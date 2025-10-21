import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = 12
    const offset = (page - 1) * limit

    let sql = `
      SELECT mp.*, u.name as seller_name, u.city as seller_city
      FROM marketplace_products mp
      JOIN users u ON mp.seller_id = u.id
    `
    const params: any[] = []

    if (category) {
      sql += " WHERE mp.category = ?"
      params.push(category)
    }

    sql += " ORDER BY mp.created_at DESC LIMIT ? OFFSET ?"
    params.push(limit, offset)

    const results = await query(sql, params)
    return NextResponse.json({ data: results }, { status: 200 })
  } catch (error) {
    console.error("Get marketplace error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
