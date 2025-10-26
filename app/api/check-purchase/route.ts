import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  console.log("API /check-purchase called with URL:", request.url);
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
    console.log("Authenticated user ID (raw):", userId, "Type:", typeof userId);

    const searchParams = request.nextUrl.searchParams;
    const productId = Number.parseInt(searchParams.get("product_id") ?? "", 10);

    if (isNaN(productId)) {
      console.log("Invalid productId:", searchParams.get("product_id"));
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }
    console.log("Product ID (parsed):", productId, "Type:", typeof productId);

    const sql = `
      SELECT id, rated, count_rate
      FROM history_transaction
      WHERE id_buyer = ? AND id_products = ?
      LIMIT 1
    `;
    const params = [userId, productId];
    console.log("Executing check purchase SQL:", sql, "with params:", params);
    const results = await query(sql, params);

    console.log("Query results (raw):", results);

    // Type assertion for results as RowDataPacket[]
    interface TransactionRow {
      id: number;
      rated: string;
      count_rate: number;
    }
    const typedResults = results as TransactionRow[];

    if (!Array.isArray(typedResults) || typedResults.length === 0) {
      console.log("No transaction found for userId:", userId, "productId:", productId);
      return NextResponse.json({ canReview: false, hasReviewed: false }, { status: 200 });
    }

    const transaction = typedResults[0];
    const hasReviewed = transaction.rated === "Sudah";
    const canReview = true;
    console.log("Transaction found:", transaction);

    return NextResponse.json({ canReview, hasReviewed, transactionId: transaction.id, count_rate: transaction.count_rate }, { status: 200 });
  } catch (error) {
    console.error("Check purchase error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}