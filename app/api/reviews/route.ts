import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import { Console } from "console";

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
    const { productId, comment, rating: rawRating, transactionId, hasReviewed } = body;

    if (!productId || !transactionId || rawRating === undefined) {
      return NextResponse.json({ error: "Product ID, Transaction ID, and Rating are required" }, { status: 400 });
    }

    const rating = Number(rawRating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be a number between 1 and 5" }, { status: 400 });
    }

    // Cek apakah transaksi valid dan milik user
    const transactionCheck = await query(
      `SELECT ht.id, ht.id_products, ht.id_buyer, ht.transaction_code, ht.count_rate, t.status 
       FROM history_transaction ht
       INNER JOIN transactions t ON t.id = ht.transaction_code
       WHERE ht.transaction_code = ? AND ht.id_buyer = ? AND ht.id_products = ?`,
      [transactionId, userId, productId]
    ) as Array<{ 
      id: string; 
      id_products: string; 
      id_buyer: string; 
      transaction_code: string; 
      count_rate: number | null; 
      status: string 
    }>;

    if (!transactionCheck || transactionCheck.length === 0 || transactionCheck[0].status !== 'completed') {
      return NextResponse.json({ error: "Invalid transaction or transaction not completed" }, { status: 400 });
    }

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
    let currentRating = Number(product.rating) || 0; // Total bintang saat ini
    let currentReviewsCount = Number(product.reviews_count) || 0;
    let newRating = currentRating;
    let newReviewsCount = currentReviewsCount;

    const history = transactionCheck[0];
    let oldRating = Number(history.count_rate) || 0; // Rating lama dari history_transaction

    if (hasReviewed) {
      const updateReviewResult = await query(
        `UPDATE reviews 
         SET comment_buyer = ?
         WHERE id_buyer = ? AND id_products = ? AND id_seller = ?`,
        [comment || null, userId, productId, product.seller_id]
      );

      if (updateReviewResult.affectedRows === 0) {
        const insertReviewResult = await query(
          `INSERT INTO reviews 
           (id_buyer, id_seller, id_products, comment_buyer, created_at) 
           VALUES (?, ?, ?, ?, NOW())`,
          [userId, product.seller_id, productId, comment || null]
        );

        if (insertReviewResult.affectedRows === 0) {
          return NextResponse.json({ error: "Failed to insert review" }, { status: 500 });
        }

        newRating = currentRating + rating;
        newReviewsCount = currentReviewsCount + 1;
      } else {
        await query(
          `UPDATE history_transaction 
           SET count_rate = ?, rated = 'Sudah'
           WHERE transaction_code = ? AND id_buyer = ?`,
          [rating, transactionId, userId]
        );

        newRating = currentRating - oldRating + rating;
      }
    } else {
      const insertReviewResult = await query(
        `INSERT INTO reviews 
         (id_buyer, id_seller, id_products, comment_buyer, created_at) 
         VALUES (?, ?, ?, ?, NOW())`,
        [userId, product.seller_id, productId, comment || null]
      );

      if (insertReviewResult.affectedRows === 0) {
        return NextResponse.json({ error: "Failed to insert review" }, { status: 500 });
      }

      await query(
        `UPDATE history_transaction 
         SET count_rate = ?, rated = 'Sudah'
         WHERE transaction_code = ? AND id_buyer = ?`,
        [rating, transactionId, userId]
      );

      newRating = currentRating + rating;
      newReviewsCount = currentReviewsCount + 1;
    }

    const validatedNewRating = Number.isFinite(newRating) ? newRating : 0;
    if (!Number.isFinite(validatedNewRating)) {
      return NextResponse.json({ error: "Invalid rating calculation" }, { status: 500 });
    }

    const updateProductResult = await query(
      `UPDATE marketplace_products 
       SET rating = ?, reviews_count = ?
       WHERE id = ?`,
      [validatedNewRating, newReviewsCount, productId]
    );

    if (updateProductResult.affectedRows === 0) {
      return NextResponse.json({ error: "Failed to update product rating" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: hasReviewed ? "Review updated successfully" : "Review submitted successfully",
      newRating: validatedNewRating,
      newReviewsCount: newReviewsCount,
      refresh: true
    }, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}

// Endpoint untuk balasan penjual
export async function PATCH(request: NextRequest) {
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
    const { reviewId, reply } = body;

    if (!reviewId || !reply) {
      return NextResponse.json({ error: "Review ID and reply are required" }, { status: 400 });
    }

    const reviewCheck = await query(
      `SELECT id_products, id_seller FROM reviews WHERE id = ?`,
      [reviewId]
    ) as Array<{ id_products: string; id_seller: string }>;

    if (!reviewCheck || reviewCheck.length === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const review = reviewCheck[0];
    if (review.id_seller != String(userId)) {
      return NextResponse.json({ error: `Unauthorized reply attempt by user: ${userId} for review: ${review.id_seller}` }, { status: 403 });
    }

    await query(
      `UPDATE reviews 
       SET reply_comment_by_seller = ?
       WHERE id = ?`,
      [reply, reviewId]
    );

    return NextResponse.json({ success: true, message: "Reply submitted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Patch review error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}