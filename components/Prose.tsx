import ReactMarkdown from "react-markdown";

// ---------------------------------------------------------------------------
// Prose — the article body renderer.
//
// Explicit editorial treatment (see DESIGN.md and globals.css `.prose-msd`):
//   - h2 renders in small-caps sans, NOT italic serif. The design doc
//     forbids italic serif at display size; small caps carry the same
//     print-label voice without competing with the display headline.
//   - h3 is roman serif at a small step down.
//   - The first paragraph gets a drop cap via a CSS selector on
//     `.prose-msd > p:first-of-type::first-letter`.
//   - Blockquotes become pull quotes (see globals.css).
//   - Links use a hairline underline that shifts to sage on hover — the
//     one moment of accent color on the line.
//
// The wrapper enforces a 65ch measure via `.prose-msd`, so callers must not
// impose their own `max-w-*` container.
// ---------------------------------------------------------------------------

export default function Prose({ markdown }: { markdown: string }) {
  return (
    <div className="prose-msd space-y-6 text-[1.0625rem] leading-[1.7]">
      <ReactMarkdown
        components={{
          h2: ({ node, ...p }) => (
            <h2
              className="small-caps mt-10 mb-2 font-sans text-lg font-medium text-ink"
              {...p}
            />
          ),
          h3: ({ node, ...p }) => (
            <h3 className="mt-6 mb-1 font-serif text-xl text-ink" {...p} />
          ),
          a: ({ node, ...p }) => (
            <a
              className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
              {...p}
            />
          ),
          ul: ({ node, ...p }) => <ul className="list-disc" {...p} />,
          ol: ({ node, ...p }) => <ol className="list-decimal" {...p} />,
          li: ({ node, ...p }) => <li {...p} />,
          blockquote: ({ node, ...p }) => <blockquote {...p} />,
          hr: () => (
            <hr className="my-10 border-0 border-t border-line" />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
