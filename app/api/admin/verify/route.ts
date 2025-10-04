import { NextRequest, NextResponse } from "next/server"
import { getBearerToken, verifyAdminToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const token = getBearerToken(req.headers.get("authorization") || undefined)
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyAdminToken(token)
    return NextResponse.json({ ok: true, sub: payload.sub, role: payload.role }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }
}
