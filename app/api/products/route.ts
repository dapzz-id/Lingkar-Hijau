import { type NextRequest, NextResponse } from "next/server"
import { getAuthCookie, verifyToken } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('seller_id')

    let sql = `
      SELECT p.*, u.name as seller_name 
      FROM marketplace_products p 
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE 1=1
    `
    let params = []

    if (sellerId) {
      sql += " AND p.seller_id = ?"
      params.push(sellerId)
    }

    sql += " ORDER BY p.created_at DESC"

    const products = await query(sql, params)
    
    return NextResponse.json({ products }, { status: 200 })
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthCookie()
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { 
      name, 
      description, 
      category, 
      price, 
      original_price, 
      eco_score, 
      image_url 
    } = body

    if (!name || !price || !category) {
      return NextResponse.json({ 
        error: "Name, price, and category are required" 
      }, { status: 400 })
    }

    if (price < 0) {
      return NextResponse.json({ 
        error: "Price must be positive" 
      }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO marketplace_products 
       (seller_id, name, description, category, price, original_price, eco_score, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        decoded.userId,
        name,
        description || null,
        category,
        price,
        original_price || null,
        eco_score || null,
        image_url || null
      ]
    )

    const newProducts = await query("SELECT * FROM marketplace_products WHERE id = ?", [result.insertId])
    
    if (!Array.isArray(newProducts) || newProducts.length === 0) {
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }

    return NextResponse.json({ 
      product: newProducts[0],
      message: "Product created successfully"
    }, { status: 201 })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}