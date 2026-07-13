import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { SITE } from "@/lib/site";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (code) {
    const supabase = await supabaseServer();
    await supabase.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(`${SITE.url}/admin`);
}
