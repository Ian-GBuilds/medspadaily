import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { runOnce } from "@/lib/pipeline/run";

export const maxDuration = 300;

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${env("CRON_SECRET")}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const result = await runOnce();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
