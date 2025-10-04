import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getBearerToken, verifyAdminToken } from "@/lib/auth";

// GET /api/project/[id] → 상세 조회 (public)
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // view로 상세 조회: genres(text[]), genre_ids(uuid[])
    const { data, error } = await supabaseAdmin.from("project_with_genres").select("*").eq("id", params.id).single();
    if (error) return NextResponse.json({ message: error.message }, { status: 404 });
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message ?? "Unexpected error" }, { status: 500 });
  }
}

// PUT /api/project/[id] → 수정 (admin)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getBearerToken(req.headers.get("authorization") || undefined);
    verifyAdminToken(token);

    const updates = await req.json();
    const { genres, ...rest } = updates || {};

    // 1) 기본 필드 업데이트 (project)
    if (Object.keys(rest).length > 0) {
      const { error: updateError } = await supabaseAdmin.from("project").update(rest).eq("id", params.id);
      if (updateError) return NextResponse.json({ message: updateError.message }, { status: 500 });
    }

    // 2) 장르 업데이트
    if (Array.isArray(genres)) {
      // upsert 장르명 → id 획득
      const names: string[] = genres.filter((g: any) => typeof g === "string").map((s: string) => s.trim()).filter(Boolean);
      const uniqueNames = Array.from(new Set(names));
      let genreIds: string[] = [];
      if (uniqueNames.length > 0) {
        const { data: upserted, error: upsertError } = await supabaseAdmin
          .from("genre")
          .upsert(uniqueNames.map((n) => ({ name: n })), { onConflict: "name" })
          .select("id, name");
        if (upsertError) return NextResponse.json({ message: upsertError.message }, { status: 500 });
        genreIds = (upserted || []).map((g: any) => g.id);
      }
      // 기존 연결 제거 후 재삽입
      const { error: delError } = await supabaseAdmin.from("project_genre").delete().eq("project_id", params.id);
      if (delError) return NextResponse.json({ message: delError.message }, { status: 500 });
      if (genreIds.length > 0) {
        const linkRows = genreIds.map((gid) => ({ project_id: params.id, genre_id: gid }));
        const { error: linkError } = await supabaseAdmin.from("project_genre").insert(linkRows);
        if (linkError) return NextResponse.json({ message: linkError.message }, { status: 500 });
      }
    }

    // 3) view 재조회하여 반환
    const { data: viewRow, error: viewError } = await supabaseAdmin
      .from("project_with_genres")
      .select("*")
      .eq("id", params.id)
      .single();
    if (viewError) return NextResponse.json({ message: viewError.message }, { status: 500 });
    return NextResponse.json(viewRow, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message ?? "Unauthorized" }, { status: 401 });
  }
}

// DELETE /api/project/[id] → 삭제 (admin)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getBearerToken(req.headers.get("authorization") || undefined);
    verifyAdminToken(token);

    const { error } = await supabaseAdmin.from("project").delete().eq("id", params.id);
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message ?? "Unauthorized" }, { status: 401 });
  }
}
