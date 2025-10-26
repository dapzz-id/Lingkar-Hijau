import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `product-${timestamp}.${extension}`

    // Save file to public/uploads directory
    const uploadDir = join(process.cwd(), 'public/uploads')
    const filepath = join(uploadDir, filename)

    await writeFile(filepath, buffer)

    // Return the public URL
    const imageUrl = `/uploads/${filename}`

    return NextResponse.json({ 
      success: true, 
      imageUrl 
    }, { status: 200 })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}