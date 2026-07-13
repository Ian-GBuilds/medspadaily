"use server";

import { Resend } from "resend";
import { isValidEmail } from "@/lib/newsletter/validate";
import { env } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { SITE } from "@/lib/site";

export type SubscribeState = { ok: boolean; message: string } | null;

export async function subscribeAction(
  _prev: SubscribeState, formData: FormData,
): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!isValidEmail(email)) return { ok: false, message: "That email doesn't look right." };

  const db = supabaseAdmin();
  const { data: existing } = await db
    .from("subscribers").select("id, confirmed").eq("email", email).maybeSingle();
  if (existing?.confirmed) return { ok: true, message: "You're already on the list." };

  let token: string;
  if (existing) {
    const { data, error } = await db.from("subscribers")
      .select("confirm_token").eq("id", existing.id).single();
    if (error || !data) return { ok: false, message: "Something went wrong — try again." };
    token = data.confirm_token;
  } else {
    const { data, error } = await db.from("subscribers")
      .insert({ email }).select("confirm_token").single();
    if (error) return { ok: false, message: "Something went wrong — try again." };
    token = data.confirm_token;
  }

  const resend = new Resend(env("RESEND_API_KEY"));
  try {
    const { error: sendError } = await resend.emails.send({
      from: env("NEWSLETTER_FROM"),
      to: email,
      subject: `Confirm your ${SITE.name} subscription`,
      text: `Confirm your subscription to ${SITE.name}:\n\n${SITE.url}/confirm/${token}\n\nIf you didn't request this, ignore this email.`,
    });
    if (sendError) {
      return { ok: false, message: "We couldn't send your confirmation email just now — please try again in a moment." };
    }
  } catch {
    return { ok: false, message: "We couldn't send your confirmation email just now — please try again in a moment." };
  }
  return { ok: true, message: "Check your inbox to confirm." };
}
