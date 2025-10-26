import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth"; // Sesuaikan path

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthCookie();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const userId = decoded.userId;

    const body = await request.json();
    const { productId, comment, rating, transactionId, hasReviewed } = body;

    if (!productId || !transactionId || !comment || rating === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let reviewSql, reviewParams;
    let newAverageRating, newReviewsCount;

    const productSql = `
      SELECT rating, reviews_count
      FROM marketplace_products
      WHERE id = ?
    `;
    const productResults = await query(productSql, [productId]) as Array<{ rating: number, reviews_count: number }>;
    if (!productResults || productResults.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    let currentRating = productResults[0].rating || 0;
    let currentReviewsCount = productResults[0].reviews_count || 0;

    if (hasReviewed) {
      reviewSql = `
        UPDATE reviews
        SET comment_buyer = ?, id_buyer = ?
        WHERE id_buyer = ? AND id_products = ?
      `;
      reviewParams = [comment, userId, userId, productId];

      const oldRateSql = `
        SELECT count_rate
        FROM history_transaction
        WHERE id = ?
      `;
      const oldRateResults = await query(oldRateSql, [transactionId]) as Array<{ count_rate: number }>;
      const oldRate = oldRateResults.length > 0 ? oldRateResults[0].count_rate || 0 : 0;

      if (currentReviewsCount > 0) {
        const totalOldRating = currentRating * currentReviewsCount;
        const totalNewRating = totalOldRating - oldRate + rating;
        newAverageRating = totalNewRating / currentReviewsCount;
      } else {
        newAverageRating = rating;
      }

      const updateTransactionSql = `
        UPDATE history_transaction
        SET count_rate = ?, rated = 'Sudah'
        WHERE id = ?
      `;
      await query(updateTransactionSql, [rating, transactionId]);
    } else {
      reviewSql = `
        INSERT INTO reviews (id_seller, id_buyer, id_products, comment_buyer, created_at)
        VALUES ((SELECT seller_id FROM marketplace_products WHERE id = ?), ?, ?, ?, NOW())
      `;
      reviewParams = [productId, userId, productId, comment];

      const totalOldRating = currentRating * currentReviewsCount;
      const totalNewRating = totalOldRating + rating;
      newReviewsCount = currentReviewsCount + 1;
      newAverageRating = totalNewRating / newReviewsCount;

      // Update history_transaction
      const updateTransactionSql = `
        UPDATE history_transaction
        SET count_rate = ?, rated = 'Sudah'
        WHERE id = ?
      `;
      await query(updateTransactionSql, [rating, transactionId]);
    }

    await query(reviewSql, reviewParams);

    // Update marketplace_products
    const updateProductSql = `
      UPDATE marketplace_products
      SET rating = ?, reviews_count = ?
      WHERE id = ?
    `;
    const updateProductParams = [newAverageRating, newReviewsCount || currentReviewsCount, productId];
    await query(updateProductSql, updateProductParams);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Post review error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}