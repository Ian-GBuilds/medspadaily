---
theme: light
colors:
  paper: "#faf7f2"
  ink: "#211d19"
  ink-muted: "#6e655c"
  line: "#e7e0d6"
  accent: "#6f7d62"
typography:
  serif:
    fontFamily: "Newsreader, Georgia, serif"
  sans:
    fontFamily: "Work Sans, sans-serif"
---

# MedSpa Daily — Design System

The visual system for a calm, evidence-first daily publication. It reads as a
well-set printed weekly: warm paper, dark ink, one restrained sage accent, and
type doing nearly all of the work. Every value below is a token later UI tasks
consume rather than redefine.

## Overview

**Creative North Star: "A printed weekly paper about medicine, read over morning coffee."**

**Key Characteristics:**
- Text is the interface. Layout, color, and imagery serve the reading; they never decorate around it.
- Hairlines, not boxes. Structure comes from 1px rules and whitespace, never from cards, shadows, or fills.
- One unhurried thing at a time. A single dominant idea per screen, generously spaced.
- Evidence worn openly. Sources and tiers are designed elements, not footnotes.

The register is editorial brand: the design is the product's first promise of
trustworthiness. Restraint here is deliberate and load-bearing, not timidity.
Warmth lives in the paper surface and the serif voice; the accent is a whisper,
used once where it counts.

## Colors

A restrained, single-accent palette. Warm off-white paper carries the whole
surface; near-black ink carries the text; a muted olive-sage is the only color,
spent sparingly on rules, marks, and large type. No gradients, no second accent,
no dark theme.

### Surface & ink
- **Paper** (#faf7f2): the page surface. A warm off-white chosen as the deliberate identity of a printed weekly, not a neutral default. Every screen sits on it.
- **Ink** (#211d19): primary text and the strongest marks. 15.7:1 on paper, far past AA.
- **Ink muted** (#6e655c): secondary text, deks, metadata, and captions. 5.34:1 on paper, chosen to clear AA body contrast rather than sit under it.

### Line & accent
- **Line** (#e7e0d6): every hairline rule and border. The house divider; 1px, never heavier as a decorative stripe.
- **Accent** (#6f7d62): a muted sage, the single restrained color. 4.11:1 on paper, so it is reserved for large type, rules, hover marks, and the selection highlight, and never used for small body text.

**The One Accent Rule.** Sage appears at most once per view and never as small body text. If a screen needs a second color to make sense, the layout is wrong, not the palette.

## Typography

Two families on a real contrast axis: a literary serif for reading and headlines,
a quiet humanist sans for chrome. The serif carries the body because reading is
the product; the sans is confined to small uppercase labels and navigation.

**Display Font:** Newsreader (with Georgia, serif fallback)
**Body Font:** Newsreader (with Georgia, serif fallback)
**Label Font:** Work Sans (with sans-serif fallback)

**Character:** Newsreader set roman for headlines and body reads as considered
editorial prose, not a startup hero; italics are reserved for emphasis and
publication voice, never for oversized display. Work Sans appears only as small,
wide-tracked uppercase labels, the printed-paper masthead cue.

### Hierarchy
- **Display** (Newsreader, roman, clamp(2rem, 1.4rem + 3vw, 3.25rem), line-height 1.15, text-wrap balance): today's lead headline. Long headlines set smaller, never blown up to dominate the fold.
- **Heading** (Newsreader, roman, clamp(1.5rem, 1.2rem + 1.2vw, 2rem), line-height 1.2): section and story titles.
- **Subhead / dek** (Newsreader, italic optional, 1.25rem, line-height 1.4, ink-muted): the one-line subtitle under a headline.
- **Body** (Newsreader, roman, 1.125rem, line-height 1.7, measure 65–72ch): article text. `text-wrap: pretty` to limit orphans.
- **Meta** (Work Sans, 0.875rem, line-height 1.5, ink-muted): bylines, dates, source labels.
- **Label** (Work Sans, uppercase, 0.75rem, letter-spacing 0.12em): nav items, eyebrow category tags, footer column headings.

Type scale is a ~1.25 modular scale; steps stay ≥1.25 apart so hierarchy is
unmistakable. Headings use fluid `clamp()`; body sizes are fixed for a stable
reading measure.

## Elevation

**No shadows.** This surface has no elevation model in the conventional sense.
Depth and grouping are expressed with hairline rules (1px `line`), whitespace,
and type weight. Nothing floats, nothing glows. A drop shadow, a glass blur, or
a glowing accent would break the printed-paper premise, so none are defined.

- **Base** (no shadow): everything sits flat on paper.
- **Separation** (1px solid line): the only divider, between the masthead and content, between stories in the list, and above the footer.

## Components

Chrome is minimal and consistent. Components are built only from the tokens above.

### Header
The masthead. A serif wordmark ("MedSpa Daily") with generous letterspacing, and
a single row of small uppercase Work Sans navigation links.
- **Structure:** wordmark left, category nav following; horizontal, wraps on narrow screens.
- **Background:** paper.
- **Divider:** 1px `line` border-bottom, the full-width hairline under the masthead.
- **Nav items:** Label style, `ink-muted` at rest, `ink` on hover and focus-visible.
- **Padding:** generous vertical breathing room; content aligned to the same measure as the article body.

### Footer
Three quiet columns above a hairline: an about blurb with a one-line medical
disclaimer, a short list of links, and the newsletter placeholder.
- **Structure:** three columns on desktop, stacking to one on mobile.
- **Background:** paper.
- **Divider:** 1px `line` border-top.
- **Headings:** Label style column titles.
- **Text:** `ink-muted` for the blurb and disclaimer; links `ink` with an accent hover mark.

### Newsletter form
A static placeholder (wired later). A single email input and a submit button, no
decoration.
- **Input:** paper background, 1px `line` border, `ink` text, no radius, comfortable padding; placeholder text meets body contrast.
- **Button:** solid `ink` background with `paper` label (15.7:1), Label style. The one firm affordance on the page.
- **State:** default only at this stage; focus-visible ring uses `accent`.

### Links (in prose)
- **Rest:** `ink`, underlined with a hairline offset.
- **Hover / focus:** `accent` underline; color shift only where text is large enough for the accent to clear contrast, otherwise the underline carries the state.

## Do's and Don'ts

### Do
- Do let whitespace and hairline rules do the structuring work.
- Do keep body copy on a 65–72ch measure for a calm reading line.
- Do reserve the sage accent for one moment per view: a rule, a hover, a large mark.
- Do set headlines roman and sized to the content, never blown up to fill the fold.
- Do keep labels short, uppercase, and in Work Sans; keep reading text in Newsreader.

### Don't
- Don't add shadows, gradients, glows, or glass; this is flat printed paper.
- Don't introduce a second accent color or a dark theme.
- Don't use the sage accent for small body text; it does not meet AA at that size.
- Don't wrap content in cards, and never nest one card inside another.
- Don't set oversized italic serif as a hero headline, or stack tracked uppercase eyebrows above every section.
- Don't let a line of body text run past ~75 characters or touch the viewport edge.
