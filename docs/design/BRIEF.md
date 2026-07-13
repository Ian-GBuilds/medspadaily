# Design Brief — Site Shell + Homepage

Produced through the Impeccable `shape` flow for MedSpa Daily. Interviewer and
answerer are the same author here; every answer is derived from PRODUCT.md, the
approved design spec (`docs/superpowers/specs/2026-07-12-medspadaily-design.md`),
and DESIGN.md. This brief governs the site shell (Header, Footer) and the
homepage frame. It was confirmed before any UI code was written.

Prompt this shapes: "Homepage and site shell for MedSpa Daily: today's story
large at top, quiet editorial list of recent stories below, header with wordmark
+ five category links, footer with about/sourcing/newsletter. Kinfolk-calm,
text-first."

## 1. Feature Summary

The site shell is the masthead and footer that wrap every page, plus the
homepage frame they live in. The masthead carries the wordmark and category
navigation; the footer carries the about blurb, a medical disclaimer, sourcing
and feed links, and a newsletter capture placeholder. The homepage leads with
today's single story set large, followed by a quiet list of recent stories. It
is for a cautious patient-reader arriving mid-decision who wants one trustworthy
read, and it must establish, in the first second, that this is a calm editorial
publication rather than a clinic ad or a health-news portal.

## 2. Primary User Action

Read today's story. Everything else on the shell (subscribe, browse a category,
learn how sourcing works) is secondary and must not compete with the lead story
for attention. The masthead orients; it does not sell.

## 3. Design Direction

**Color strategy: Restrained.** Tinted-neutral surface (warm paper) plus dark
ink, with a single sage accent spent at most once per view. This is the
PRODUCT.md default and the surface earns it: a publication about trust reads as
credible through restraint, not through committed color. No per-surface override.

**Scene sentence:** a reader at a kitchen table in flat morning light, coffee in
hand, reading a printed weekly about a decision they are weighing. That sentence
forces a light theme on warm paper; a dark UI would read as a dashboard or a
crypto page, both explicit anti-references.

**Anchor references:** Kinfolk magazine (the calm editorial grid, generous
margins, serif-led hierarchy, muted photography); a broadsheet weekly's front
page (one lead story dominant, a quiet index of the rest below a hairline); and
the printed pharmacopoeia / museum-caption register for how sources and tiers
are shown plainly rather than dramatized.

Fonts and tokens are fixed by the approved spec and recorded in DESIGN.md:
Newsreader (serif, body and headlines) + Work Sans (sans, small uppercase
labels); paper #faf7f2, ink #211d19, ink-muted #6e655c, line #e7e0d6, accent
sage #6f7d62. Newsreader appears on Impeccable's prose reflex-reject font list,
but is kept deliberately: this is a literal editorial publication (the register
that list exempts), the pairing is mandated by the approved spec, and it is
documented rather than reached for by reflex.

## 4. Scope

Production-ready. Breadth is the whole shell (Header + Footer used by the root
layout) plus a minimal homepage placeholder frame; the real homepage content is
Task 7. Interactivity is shipped-quality static components: real semantic markup,
real hover/focus states, responsive from 320px up. Time intent: polish until it
ships, because every later UI task inherits this shell.

## 5. Layout Strategy

A single centered column (max ~48rem / measure ~65–72ch) holds all reading
content; the shell aligns to that same measure so the page reads as one object.
The masthead is a full-width band with a hairline base: wordmark leading, then a
wrapping row of small uppercase category links. Below it, `main` holds the page.
On the homepage frame, today's story gets the display headline and the most
vertical breathing room; recent stories fall below as a hairline-separated list,
not a card grid. The footer is a three-column band above a hairline that
collapses to a single stack on mobile. Rhythm is deliberate: tight groupings for
related metadata, generous separations (48–96px) between the masthead, the lead,
the list, and the footer.

## 6. Key States

- **Default:** masthead, lead story, recent list, footer all present.
- **Homepage pre-content (this task):** no published stories yet, so the frame
  shows the tagline as the lead and a muted "First edition arriving shortly."
  line. This is the honest empty state for launch day, replaced by Task 7.
- **Nav hover / focus-visible:** link shifts from ink-muted to ink; focus-visible
  shows a clear ring. No hover-only affordances.
- **Newsletter placeholder:** default only. Input and button render and are
  focusable; submission is inert until Task 11 wires it. No fake success state.
- **Responsive:** nav wraps rather than truncates; footer columns stack; nothing
  overflows or touches the viewport edge at any width from 320px up.
- **Reduced motion:** the shell ships with no entrance motion, so there is
  nothing to suppress; any future motion must honor prefers-reduced-motion.

## 7. Interaction Model

Navigation links route to category archives, the treatments directory, and the
about page. Hover and focus-visible shift color and reveal a focus ring; keyboard
tab order follows source order (wordmark, then nav, then main, then footer). The
newsletter input accepts focus and typing but its button does nothing yet
(placeholder). There is no scroll-driven behavior, no sticky header, no infinite
scroll: the reader moves at their own pace down a finite page.

## 8. Content Requirements

- **Wordmark:** "MedSpa Daily", serif, generous letterspacing, links to `/`.
- **Nav labels:** the five category labels from `CATEGORY_LABELS` routed via
  `CATEGORY_ROUTES` (Research, Treatments → treatments-news, Legislation,
  Longevity, Industry), plus "Treatments" → `/treatments` and "About" → `/about`.
- **Footer about blurb:** one or two calm sentences on what the publication is,
  drawn from `SITE.description`.
- **Medical disclaimer one-liner:** a plain sentence that the site is editorial,
  not medical advice.
- **Footer links:** `/about`, `/how-we-source`, `/feed.xml`.
- **Newsletter placeholder:** a short label, an email input with a real
  placeholder, and a submit button ("Subscribe").
- **Homepage frame copy (this task):** `SITE.tagline` as the lead line and
  "First edition arriving shortly." as the muted supporting line.
- **Imagery:** none in the shell. The shell is legitimately text-only chrome;
  editorial photography lives inside story content (Task 7+), not the masthead.
  Copy avoids em-dash overuse, marketing buzzwords, and aphoristic cadence.

## 9. Recommended References

- `typeset.md` — the shell is typography-driven; hierarchy and the serif/sans
  split are the whole visual system.
- `layout.md` — column measure, spacing rhythm, and responsive wrapping of the
  masthead and footer.
- `clarify.md` — the disclaimer, newsletter, and nav labels are small copy that
  must be plain and precise.
- `brand.md` (register reference) — keep the editorial lane deliberate rather
  than reflexive, and keep restraint from tipping into blandness.

## 10. Open Questions

None blocking. Decided defaults: body copy is set in Newsreader (serif), not the
sans, because reading is the product; the newsletter button is solid ink on paper
rather than sage, because sage does not meet AA at button-label size; and the
shell ships with no entrance motion, matching the calm register.
