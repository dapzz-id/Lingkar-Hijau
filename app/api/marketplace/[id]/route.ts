import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const sql = `
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
            users.name AS seller_name,
            users.email AS seller_email
        FROM marketplace_products
        INNER JOIN users ON users.id = marketplace_products.seller_id
        WHERE marketplace_products.id = ?
    `;
    const queryParams = [productId];
    const results = await query(sql, queryParams);

    if (!Array.isArray(results)) {
      return NextResponse.json({ error: "Unexpected query result" }, { status: 500 });
    }

    if (results.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = results[0];

    const reviewsSql = `
        SELECT 
            reviews.id,
            reviews.id_products,
            reviews.id_seller,
            reviews.id_buyer,
            reviews.comment_buyer,
            reviews.reply_comment_by_seller,
            reviews.created_at,
            seller_users.name AS seller_name,
            seller_users.avatar_url AS seller_avatar,
            buyer_users.name AS buyer_name,
            buyer_users.avatar_url AS buyer_avatar,
            ht.count_rate
        FROM reviews
        INNER JOIN users seller_users ON seller_users.id = reviews.id_seller
        INNER JOIN users buyer_users ON buyer_users.id = reviews.id_buyer
        LEFT JOIN history_transaction ht ON ht.id_products = reviews.id_products 
            AND ht.id_buyer = reviews.id_buyer 
            AND ht.rated = 'Sudah'
        WHERE reviews.id_products = ?
        ORDER BY reviews.created_at DESC
    `;
    const reviewsParams = [productId];
    const reviewsResults = await query(reviewsSql, reviewsParams);

    const responseData = {
      ...product,
      reviews: reviewsResults,
    };

    return NextResponse.json({ data: responseData }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}