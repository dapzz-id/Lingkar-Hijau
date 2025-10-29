import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query("SELECT COUNT(*) AS total FROM forum_threads")
    const total = result[0]?.total || 0
    
    return NextResponse.json({ success: true, total })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, total: 0 }, { status: 500 })
  }
}