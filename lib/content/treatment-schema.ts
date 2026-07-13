import { z } from "zod";

export const TreatmentDraftSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(3),
  summary: z.string().min(50).max(300),
  what_it_is: z.string().min(200),
  what_to_expect: z.string().min(200),
  evidence_summary: z.string().min(200),
  risks: z.string().min(100),
  typical_cost_range: z.string().min(5).max(120),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).min(3).max(5),
});

export type TreatmentDraft = z.infer<typeof TreatmentDraftSchema>;
