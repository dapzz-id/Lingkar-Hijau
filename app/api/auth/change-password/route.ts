import { type NextRequest, NextResponse } from "next/server"
import { getAuthCookie, verifyToken, verifyPassword, hashPassword } from "@/lib/auth"
import { query } from "@/lib/db"

export async function PUT(request: NextRequest) {
  try {
    const token = await getAuthCookie()
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const userId = decoded.userId
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Password lama dan baru diperlukan" },
        { status: 400 }
      )
    }

    const users = await query("SELECT * FROM users WHERE id = ?", [userId])
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = users[0] as any

    const isPasswordValid = await verifyPassword(currentPassword, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Password lama Anda salah" }, { status: 401 })
    }

    const hashedNewPassword = await hashPassword(newPassword)

    await query("UPDATE users SET password = ? WHERE id = ?", [hashedNewPassword, userId])

    return NextResponse.json(
      { success: true, message: "Password telah berhasil diubah" },
      { status: 200 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    )
  }
}
