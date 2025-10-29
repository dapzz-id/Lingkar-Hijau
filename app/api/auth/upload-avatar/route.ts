import { NextRequest, NextResponse } from "next/server";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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
      return NextResponse.json(
        { error: "Tidak ada file avatar yang diunggah" },
        { status: 400 }
      );
    }

    if (!avatarFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File harus berupa gambar" },
        { status: 400 }
      );
    }

    if (avatarFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const sanitizedName = avatarFile.name.replace(/\s+/g, "_");
    const avatarFilename = `avatar_${userId}_${Date.now()}_${sanitizedName}`;

    const bucketName = process.env.AWS_S3_BUCKET_NAME!;
    const key = `uploads/avatar/${avatarFilename}`;

    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: avatarFile.type
    };

    await s3.send(new PutObjectCommand(uploadParams));
    const avatarUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json(
      { success: true, avatarUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload avatar error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
