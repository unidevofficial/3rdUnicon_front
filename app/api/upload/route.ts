import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { getBearerToken, verifyAdminToken } from "@/lib/auth"

// POST /api/upload (admin only)
// form-data: file (binary), folder (string)
export async function POST(req: NextRequest) {
  try {
    const token = getBearerToken(req.headers.get("authorization") || undefined)
    verifyAdminToken(token)

    const form = await req.formData()
    const file = form.get("file") as File | null
    const folder = String(form.get("folder") || "misc")
    if (!file) return NextResponse.json({ message: "file required" }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const fileExt = file.name.split(".").pop() || "bin"
    const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`
    const path = `${folder}/${filename}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from("files")
      .upload(path, buffer, { contentType: file.type, upsert: false })
    if (uploadError) return NextResponse.json({ message: uploadError.message }, { status: 500 })

    const { data } = supabaseAdmin.storage.from("files").getPublicUrl(path)
    return NextResponse.json({ url: data.publicUrl, path }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ message: e.message ?? "Unauthorized" }, { status: 401 })
  }
}
