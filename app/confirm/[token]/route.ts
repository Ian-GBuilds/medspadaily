import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { SITE } from "@/lib/site";

export async function GET(
  _req: Request, { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const db = supabaseAdmin();
  const { data } = await db
    .from("subscribers").select("id").eq("confirm_token", token).maybeSingle();
  if (!data) return NextResponse.redirect(`${SITE.url}/?subscribed=invalid`);
  await db.from("subscribers")
    .update({ confirmed: true, confirmed_at: new Date().toISOString() })
    .eq("id", data.id);
  return NextResponse.redirect(`${SITE.url}/?subscribed=1`);
}
