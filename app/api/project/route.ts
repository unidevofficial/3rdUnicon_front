import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getBearerToken, verifyAdminToken } from "@/lib/auth";

// GET /api/project?title=&genre=&platform=&team_type=&page=1&pageSize=12
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") ?? undefined;
    const genre = searchParams.get("genre") ?? undefined;
    const platform = searchParams.get("platform") ?? undefined; // pc | mobile
    const teamType = searchParams.get("team_type") ?? undefined; // challenger | rookie
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 12)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // view: project_with_genres (genres: text[], genre_ids: uuid[])
    let query = supabaseAdmin.from("project_with_genres").select("*", { count: "exact" });

    if (title) query = query.ilike("title", `%${title}%`);
    if (genre) query = query.contains("genres", [genre]);
    if (platform) query = query.eq("platform", platform);
    if (teamType) query = query.eq("team_type", teamType);

    const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to);
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json({ items: data, page, pageSize, total: count ?? 0 }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message ?? "Unexpected error" }, { status: 500 });
  }
}

// POST /api/project → 생성 (admin)
export async function POST(req: NextRequest) {
  try {
    const token = getBearerToken(req.headers.get("authorization") || undefined);
    verifyAdminToken(token);

  const body = await req.json();
  const { title, description, team_type, team_name, platform, video_url, banner_image, gallery_images, download_url, genres } = body ?? {};
    if (!title || !team_type) {
      return NextResponse.json({ message: "title, team_type required" }, { status: 400 });
    }

    // 1) 프로젝트 기본 정보 생성 (단일 레코드)
    const { data: created, error: insertError } = await supabaseAdmin
      .from("project")
      .insert({ title, description, team_type, team_name, platform, video_url, banner_image, gallery_images, download_url })
      .select("id")
      .single();
    if (insertError) return NextResponse.json({ message: insertError.message }, { status: 500 });

    const projectId = created?.id as string;

    // 2) 장르 처리: names 배열 기반 upsert 후 project_genre 연결
    const genreNames: string[] = Array.isArray(genres)
      ? (genres.filter((g: any) => typeof g === "string").map((s: string) => s.trim()).filter(Boolean))
      : [];

    if (genreNames.length > 0) {
      const upsertPayload = Array.from(new Set(genreNames)).map((name) => ({ name }));
      const { data: upserted, error: upsertError } = await supabaseAdmin
        .from("genre")
        .upsert(upsertPayload, { onConflict: "name" })
        .select("id, name");
      if (upsertError) return NextResponse.json({ message: upsertError.message }, { status: 500 });
      const ids = (upserted || []).filter(Boolean).map((g: any) => g.id);
      if (ids.length > 0) {
        const linkRows = ids.map((gid: string) => ({ project_id: projectId, genre_id: gid }));
        const { error: linkError } = await supabaseAdmin.from("project_genre").insert(linkRows);
        if (linkError) return NextResponse.json({ message: linkError.message }, { status: 500 });
      }
    }

    // 3) 생성된 결과를 view에서 조회하여 반환
    const { data: viewRow, error: viewError } = await supabaseAdmin
      .from("project_with_genres")
      .select("*")
      .eq("id", projectId)
      .single();
    if (viewError) return NextResponse.json({ message: viewError.message }, { status: 500 });
    return NextResponse.json(viewRow, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message ?? "Unauthorized" }, { status: 401 });
  }
}
