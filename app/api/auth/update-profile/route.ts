import { NextRequest, NextResponse } from "next/server";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";

export async function PUT(request: NextRequest) {
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
    const { name, email, city, newAvatarUrl } = await request.json();

    if (!name || !email || !city) {
      return NextResponse.json(
        { error: "Nama, email, dan kota diperlukan" },
        { status: 400 }
      );
    }

    await query(
      `UPDATE users SET name = ?, email = ?, city = ?, avatar_url = ? WHERE id = ?`,
      [name, email, city, newAvatarUrl, userId]
    );

    const [updatedUser] = await query(
      `SELECT * FROM users WHERE id = ? LIMIT 1`,
      [userId]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Profile telah berhasil diperbarui",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
