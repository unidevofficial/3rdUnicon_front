import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { signAdminToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: "email, password required" }, { status: 400 });
    }

    // Call Postgres function admin_login(email, pass) → boolean
    const { data, error } = await supabaseAdmin.rpc("admin_login", { email, pass: password });
    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = signAdminToken(email);
    return NextResponse.json({ token }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message ?? "Unexpected error" }, { status: 500 });
  }
}
