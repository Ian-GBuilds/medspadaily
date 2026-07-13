export type StoryCategory =
  | "research" | "treatments" | "legislation" | "longevity" | "industry";
export type StoryStatus = "pending_review" | "published" | "rejected";

export type SourceType = "journal" | "regulatory" | "clinical_trial"
  | "professional_society" | "trade_press" | "legislature" | "manufacturer";

export interface Source {
  title: string;
  url: string;
  publication: string;
  source_type: SourceType;
  tier: 1 | 2;
}

export interface FaqItem { question: string; answer: string; }

export interface PipelineLogEntry { step: string; at: string; note: string; }

export interface StoryRow {
  id: string;
  slug: string;
  title: string;
  dek: string;
  body: string;
  category: StoryCategory;
  evidence_tier: 1 | 2;
  status: StoryStatus;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  image_flagged: boolean;
  sources: Source[];
  key_takeaways: string[];
  faq: FaqItem[] | null;
  related_treatments: string[];
  meta_description: string;
  pipeline_log: PipelineLogEntry[];
  published_at: string | null;
  created_at: string;
}

export interface TreatmentRow {
  id: string;
  slug: string;
  name: string;
  summary: string;
  what_it_is: string;
  what_to_expect: string;
  evidence_summary: string;
  risks: string;
  typical_cost_range: string;
  faq: FaqItem[];
  created_at: string;
  updated_at: string;
}

export interface SubscriberRow {
  id: string;
  email: string;
  confirmed: boolean;
  confirm_token: string;
  created_at: string;
  confirmed_at: string | null;
}

export interface PipelineRunRow {
  id: string;
  ran_at: string;
  category: StoryCategory;
  status: "success" | "failed";
  error: string | null;
  story_id: string | null;
}
