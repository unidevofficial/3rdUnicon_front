import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getBearerToken, verifyAdminToken } from "@/lib/auth";

// PUT /api/inquiry/[id] → 수정 (admin)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getBearerToken(req.headers.get("authorization") || undefined);
    verifyAdminToken(token);

    const updates = await req.json();
    const { data, error } = await supabaseAdmin
      .from("inquiry")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single();
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message ?? "Unauthorized" }, { status: 401 });
  }
}

// DELETE /api/inquiry/[id] → 삭제 (admin)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getBearerToken(req.headers.get("authorization") || undefined);
    verifyAdminToken(token);

    const { error } = await supabaseAdmin.from("inquiry").delete().eq("id", params.id);
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message ?? "Unauthorized" }, { status: 401 });
  }
}
