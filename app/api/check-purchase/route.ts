import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("auth_token")?.value;

    if (!token) {
      console.log("No token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.log("Invalid token");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const userId = decoded.userId;

    const searchParams = request.nextUrl.searchParams;
    const productId = Number.parseInt(searchParams.get("product_id") ?? "", 10);

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    // Cek apakah user sudah pernah membeli produk ini di history_transactions
    const sql = `
      SELECT 
        ht.id, 
        ht.rated, 
        ht.count_rate,
        r.comment_buyer,
        r.id as review_id
      FROM history_transactions ht
      LEFT JOIN reviews r ON ht.id = r.id_transaction AND r.id_products = ?
      WHERE ht.id_user = ? AND ht.id_product = ? AND ht.status = 'completed'
      ORDER BY ht.created_at DESC
      LIMIT 1
    `;
    const params = [productId, userId, productId];
    const results = await query(sql, params);

    interface TransactionRow {
      id: number;
      rated: string;
      count_rate: number;
      comment_buyer: string | null;
      review_id: number | null;
    }
    const typedResults = results as TransactionRow[];

    if (!Array.isArray(typedResults) || typedResults.length === 0) {
      return NextResponse.json({ 
        canReview: false, 
        hasReviewed: false,
        message: "User belum membeli produk ini atau transaksi belum completed" 
      }, { status: 200 });
    }

    const transaction = typedResults[0];
    
    // User bisa review jika transaksi completed
    const canReview = true;
    
    // User sudah review jika rated = 'Sudah' atau ada review_id
    const hasReviewed = transaction.rated === "Sudah" || transaction.review_id !== null;

    return NextResponse.json({ 
      canReview, 
      hasReviewed, 
      transactionId: transaction.id, 
      count_rate: transaction.count_rate || 0,
      comment_buyer: transaction.comment_buyer || "",
      review_id: transaction.review_id
    }, { status: 200 });

  } catch (error) {
    console.error("Check purchase error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}