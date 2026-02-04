import { NextResponse } from "next/server"
import path from "path"
import { randomUUID } from "crypto"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file")

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "File is required" }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const originalName = file.name || "image"
  const ext = path.extname(originalName) || ".png"
  const filename = `${randomUUID()}${ext}`
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "product-images"
  const objectPath = `products/${filename}`

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(objectPath, buffer, {
      contentType: file.type || "image/png",
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }

  const { data: publicData } = supabaseAdmin.storage.from(bucket).getPublicUrl(objectPath)

  return NextResponse.json({ url: publicData.publicUrl })
}
