import { revalidatePath } from "next/cache";
import type { StoryCategory } from "./db/types";
import { CATEGORY_ROUTES } from "./site";

export function revalidateStoryPaths(slug: string, category: StoryCategory) {
  revalidatePath("/");
  revalidatePath(`/stories/${slug}`);
  revalidatePath(`/${CATEGORY_ROUTES[category]}`);
  revalidatePath("/feed.xml");
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");
}
