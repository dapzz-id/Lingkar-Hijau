import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

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

    if (!productId || !transactionId || rating === undefined) {
      return NextResponse.json({ error: "Product ID, Transaction ID, and Rating are required" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // Cek apakah transaksi valid dan milik user
    const transactionCheck = await query(
      `SELECT id, id_product, id_user, count_rate 
       FROM history_transactions 
       WHERE id = ? AND id_user = ? AND id_product = ? AND status = 'completed'`,
      [transactionId, userId, productId]
    ) as Array<{ id: string; id_product: string; id_user: string; count_rate: number | null }>;

    if (!transactionCheck || transactionCheck.length === 0) {
      return NextResponse.json({ error: "Invalid transaction or transaction not found" }, { status: 400 });
    }

    // Cek apakah produk ada
    const productSql = `
      SELECT id, seller_id, rating, reviews_count
      FROM marketplace_products
      WHERE id = ?
    `;
    const productResults = await query(productSql, [productId]) as Array<{ 
      id: string; 
      seller_id: string; 
      rating: number; 
      reviews_count: number 
    }>;
    
    if (!productResults || productResults.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = productResults[0];
    let currentRating = product.rating || 0;
    let currentReviewsCount = product.reviews_count || 0;
    let newAverageRating = currentRating;
    let newReviewsCount = currentReviewsCount;

    if (hasReviewed) {
      // Update review yang sudah ada
      const oldReviewCheck = await query(
        `SELECT id, count_rate FROM reviews WHERE id_buyer = ? AND id_products = ? AND id_transaction = ?`,
        [userId, productId, transactionId]
      ) as Array<{ id: string; count_rate: number }>;

      if (oldReviewCheck && oldReviewCheck.length > 0) {
        const oldReview = oldReviewCheck[0];
        const oldRating = oldReview.count_rate || 0;

        // Update review
        await query(
          `UPDATE reviews 
           SET comment_buyer = ?, count_rate = ?, updated_at = NOW()
           WHERE id = ?`,
          [comment || null, rating, oldReview.id]
        );

        // Hitung rating baru
        if (currentReviewsCount > 0) {
          const totalOldRating = currentRating * currentReviewsCount;
          const totalNewRating = totalOldRating - oldRating + rating;
          newAverageRating = totalNewRating / currentReviewsCount;
        } else {
          newAverageRating = rating;
        }
      } else {
        return NextResponse.json({ error: "Review not found for update" }, { status: 404 });
      }
    } else {
      // Insert review baru
      await query(
        `INSERT INTO reviews 
         (id_seller, id_buyer, id_products, id_transaction, comment_buyer, count_rate, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [product.seller_id, userId, productId, transactionId, comment || null, rating]
      );

      // Hitung rating baru
      const totalOldRating = currentRating * currentReviewsCount;
      const totalNewRating = totalOldRating + rating;
      newReviewsCount = currentReviewsCount + 1;
      newAverageRating = totalNewRating / newReviewsCount;
    }

    // Update rating di history_transactions
    await query(
      `UPDATE history_transactions 
       SET count_rate = ?, rated = 'Sudah'
       WHERE id = ? AND id_user = ?`,
      [rating, transactionId, userId]
    );

    // Update marketplace_products
    await query(
      `UPDATE marketplace_products 
       SET rating = ?, reviews_count = ?
       WHERE id = ?`,
      [newAverageRating, newReviewsCount, productId]
    );

    return NextResponse.json({ 
      success: true,
      message: hasReviewed ? "Review updated successfully" : "Review submitted successfully",
      newRating: newAverageRating,
      newReviewsCount: newReviewsCount
    }, { status: 200 });

  } catch (error) {
    console.error("Post review error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}