import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getBearerToken, verifyAdminToken } from "@/lib/auth";

// POST /api/inquiry  → 생성 (public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, title, content } = body ?? {};
    if (!name || !email || !title || !content) {
      return NextResponse.json({ message: "name, email, title, content required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.from("inquiry").insert({ name, email, phone, title, content }).select().single();
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message ?? "Unexpected error" }, { status: 500 });
  }
}

// GET /api/inquiry?page=1&pageSize=10  → 리스트 (admin)
export async function GET(req: NextRequest) {
  try {
    const token = getBearerToken(req.headers.get("authorization") || undefined);
    verifyAdminToken(token);

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 10)));
    const checkedParam = searchParams.get("checked"); // "true" | "false" | null
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabaseAdmin
      .from("inquiry")
      .select("*", { count: "exact" });

    if (checkedParam === "true") {
      query = query.eq("is_checked", true);
    } else if (checkedParam === "false") {
      query = query.eq("is_checked", false);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json({ items: data, page, pageSize, total: count ?? 0 }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message ?? "Unauthorized" }, { status: 401 });
  }
}
