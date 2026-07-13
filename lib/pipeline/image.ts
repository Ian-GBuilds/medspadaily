import { generateText } from "ai";
import { supabaseAdmin } from "../supabase/admin";

const HOUSE_IMAGE_STYLE = `Editorial still-life photograph for a calm print magazine. Muted warm palette — soft off-white, stone, linen, pale sage. Natural window light, soft shadows, shallow depth of field, generous negative space. Composition breathes. Absolutely no people, no faces, no hands, no text, no logos, no medical gore. Shot on medium format film.`;

export async function generateHeroImage(opts: {
  slug: string;
  imageConcept: string;
}): Promise<string> {
  const result = await generateText({
    model: process.env.IMAGE_MODEL ?? "google/gemini-3.1-flash-image",
    prompt: `${HOUSE_IMAGE_STYLE}\n\nSubject: ${opts.imageConcept}`,
    providerOptions: {
      google: { imageConfig: { aspectRatio: "3:2", imageSize: "2K" } },
    },
  });
  const image = result.files.find((f) => f.mediaType?.startsWith("image/"));
  if (!image) throw new Error("Image model returned no image");

  const ext = image.mediaType === "image/jpeg" ? "jpg" : "png";
  const path = `${opts.slug}.${ext}`;
  const db = supabaseAdmin();
  const { error } = await db.storage
    .from("story-images")
    .upload(path, image.uint8Array, { contentType: image.mediaType, upsert: true });
  if (error) throw error;
  const { data } = db.storage.from("story-images").getPublicUrl(path);
  return data.publicUrl;
}
