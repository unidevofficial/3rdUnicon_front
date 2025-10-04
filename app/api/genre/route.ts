import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getBearerToken, verifyAdminToken } from "@/lib/auth";

// GET /api/genre?query=텍스트 → 장르 검색 (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("query") || "").trim();
    const limitParam = Number(searchParams.get("limit") || 200);
    const limit = Math.max(1, Math.min(1000, limitParam));

    let query = supabaseAdmin
      .from("genre")
      .select("id, name")
      .order("name", { ascending: true })
      .limit(limit);
    if (q) {
      query = query.ilike("name", `%${q}%`);
    }
    const { data, error } = await query;
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json({ items: data ?? [] }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message ?? "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/genre → 장르 생성 (admin)
// body: { name: string }
export async function POST(req: NextRequest) {
  try {
    const token = getBearerToken(req.headers.get("authorization") || undefined);
    verifyAdminToken(token);

    const body = await req.json();
    const rawName = String(body?.name || "").trim();
    if (!rawName) return NextResponse.json({ message: "name required" }, { status: 400 });

    // 고유 제약(name) 기준 업서트
    const { data, error } = await supabaseAdmin
      .from("genre")
      .upsert({ name: rawName }, { onConflict: "name" })
      .select("id, name")
      .single();
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message ?? "Unauthorized" }, { status: 401 });
  }
}
