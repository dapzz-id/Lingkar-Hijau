import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
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

    // Ambil pencapaian terbaru pengguna
    const achievementSql = `
      SELECT ua.id, ua.user_id, ua.achievement_id, ua.unlocked_at, a.name, a.description, a.icon, a.rarity
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = ?
      ORDER BY ua.unlocked_at DESC
      LIMIT 2
    `;
    const achievementParams = [userId];
    const achievementResults = await query(achievementSql, achievementParams);

    // Ambil produk pengguna
    const productSql = `
      SELECT id, seller_id, name, description, category, price, original_price, eco_score, image_url, rating, reviews_count, created_at
      FROM marketplace_products
      WHERE seller_id = ?
      LIMIT 2
    `;
    const productParams = [userId];
    const productResults = await query(productSql, productParams);

    // Ambil statistik pengguna
    const statsSql = `
      SELECT points, (SELECT COUNT(*) FROM user_achievements WHERE user_id = ?) as achievement_count,
             (SELECT COUNT(*) FROM marketplace_products WHERE seller_id = ?) as product_sold_count
      FROM users
      WHERE id = ?
    `;
    const statsParams = [userId, userId, userId];
    const statsResults = (await query(statsSql, statsParams)) as any[];
    const stats = statsResults[0] || {
      points: 0,
      achievement_count: 0,
      product_sold_count: 0,
    };

    const responseData = {
      stats: {
        totalPoints: stats.points,
        achievementCount: stats.achievement_count,
        productSoldCount: stats.product_sold_count,
      },
      recentAchievements: achievementResults,
      userProducts: productResults,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Get dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
