import { type NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const timestamp = Date.now()
    const extension = file.name.split(".").pop()
    const filename = `product-${timestamp}.${extension}`

    const bucketName = process.env.AWS_S3_BUCKET_NAME!
    const uploadParams = {
      Bucket: bucketName,
      Key: `uploads/${filename}`,
      Body: buffer,
      ContentType: file.type
    }

    await s3.send(new PutObjectCommand(uploadParams))

    const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${filename}`

    return NextResponse.json(
      {
        success: true,
        imageUrl,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
