import { type NextRequest, NextResponse } from "next/server";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";

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

    const body = await request.json();
    const { items, total } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Hitung total poin (100 poin per item)
    const totalPoints = items.reduce((sum, item) => sum + item.quantity * 100, 0);

    const transactionResult = await query(
      `INSERT INTO transactions (user_id, total_amount, total_points, status, created_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [decoded.userId, total, totalPoints, "completed"]
    );

    const transactionId = transactionResult.insertId;

    for (const item of items) {
      await query(
        `INSERT INTO transaction_items 
         (transaction_id, product_id, product_name, quantity, price, points_earned, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [
          transactionId,
          item.id,
          item.name,
          item.quantity,
          item.price,
          item.quantity * 100,
        ]
      );

      const existing = await query(
        `SELECT id FROM history_transaction WHERE id_products = ? AND id_buyer = ? LIMIT 1`,
        [item.id, decoded.userId]
      );

      if (existing.length === 0) {
        await query(
          `INSERT INTO history_transaction 
           (id_products, id_buyer, transaction_code, rated, count_rate) 
           VALUES (?, ?, ?, ?, ?)`,
          [item.id, decoded.userId, transactionId, "Belum", null]
        );
      }
    }

    await query(`UPDATE users SET points = points + ? WHERE id = ?`, [
      totalPoints,
      decoded.userId,
    ]);

    const [updatedUser] = await query(
      "SELECT points FROM users WHERE id = ?",
      [decoded.userId]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Checkout berhasil",
        transactionId,
        pointsEarned: totalPoints,
        totalPoints: updatedUser.points,
        items: items.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
