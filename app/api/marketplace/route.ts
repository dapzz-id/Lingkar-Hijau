import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "popular";

    let sql = `
      SELECT 
        marketplace_products.id,
        marketplace_products.seller_id,
        marketplace_products.name,
        marketplace_products.description,
        marketplace_products.category,
        marketplace_products.price,
        marketplace_products.original_price,
        marketplace_products.eco_score,
        marketplace_products.image_url,
        marketplace_products.rating,
        marketplace_products.reviews_count,
        marketplace_products.created_at,
        users.name AS seller_name
      FROM marketplace_products
      INNER JOIN users ON users.id = marketplace_products.seller_id
    `;
    const params: any[] = [];

    // Filter berdasarkan pencarian
    if (searchQuery) {
      sql += " WHERE name LIKE ?";
      params.push(`%${searchQuery}%`);
    }

    // Urutan berdasarkan sortBy
    let orderByClause = "";
    switch (sortBy) {
      case "price-low":
        orderByClause = " ORDER BY price ASC";
        break;
      case "price-high":
        orderByClause = " ORDER BY price DESC";
        break;
      case "rating":
        orderByClause = " ORDER BY rating DESC";
        break;
      case "popular":
      default:
        orderByClause = " ORDER BY reviews_count DESC";
        break;
    }
    sql += orderByClause;

    console.log("Executing SQL:", sql, "with params:", params); // Debug log
    const results = await query(sql, params);

    if (!results || !Array.isArray(results)) {
      throw new Error("No data returned from database");
    }

    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error) {
    console.error("Get marketplace error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}