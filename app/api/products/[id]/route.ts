import { type NextRequest, NextResponse } from "next/server"
import { getAuthCookie, verifyToken } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const productId = parseInt(id, 10)

    const products = await query(
      `SELECT p.*, u.name as seller_name, u.city as seller_city 
       FROM marketplace_products p 
       LEFT JOIN users u ON p.seller_id = u.id 
       WHERE p.id = ?`,
      [productId]
    )

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product: products[0] }, { status: 200 })
  } catch (error) {
    console.error("Get product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const token = await getAuthCookie()
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id } = await context.params
    const productId = parseInt(id, 10)
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

    // Cek jika produk ada dan milik user
    const existingProducts = await query(
      "SELECT * FROM marketplace_products WHERE id = ? AND seller_id = ?",
      [productId, decoded.userId]
    )

    if (!Array.isArray(existingProducts) || existingProducts.length === 0) {
      return NextResponse.json({ error: "Product not found or access denied" }, { status: 404 })
    }

    // Update product
    await query(
      `UPDATE marketplace_products 
       SET name = ?, description = ?, category = ?, price = ?, 
           original_price = ?, eco_score = ?, image_url = ?
       WHERE id = ? AND seller_id = ?`,
      [
        name,
        description || null,
        category,
        price,
        original_price || null,
        eco_score || null,
        image_url || null,
        productId,
        decoded.userId
      ]
    )

    const updatedProduct = await query("SELECT * FROM marketplace_products WHERE id = ?", [productId])
    
    return NextResponse.json({ product: updatedProduct[0] }, { status: 200 })
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthCookie()
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id } = await context.params
    const productId = parseInt(id, 10)

    // Cek jika produk ada dan milik user
    const existingProducts = await query(
      "SELECT * FROM marketplace_products WHERE id = ? AND seller_id = ?",
      [productId, decoded.userId]
    )

    if (!Array.isArray(existingProducts) || existingProducts.length === 0) {
      return NextResponse.json({ error: "Product not found or access denied" }, { status: 404 })
    }

    await query("DELETE FROM marketplace_products WHERE id = ? AND seller_id = ?", [productId, decoded.userId])
    
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}