import { NextRequest, NextResponse } from "next/server";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import fs from "fs";
import path from "path";

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

    const formData = await request.formData();
    const avatarFile = formData.get("avatar") as File | null;

    if (!avatarFile || !(avatarFile instanceof File)) {
      return NextResponse.json({ error: "Tidak ada file avatar yang diunggah" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatar");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const avatarFilename = `avatar_${userId}_${Date.now()}_${avatarFile.name.replace(/\s+/g, "_")}`;
    const avatarPath = path.join(uploadDir, avatarFilename);

    const arrayBuffer = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(avatarPath, buffer);

    const avatarUrl = `/uploads/avatar/${avatarFilename}`;

    return NextResponse.json(
      { success: true, avatarUrl },
      { status: 200 }
    );

  } catch (error) {
    console.error("Upload avatar error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
