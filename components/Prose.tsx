import ReactMarkdown from "react-markdown";

export default function Prose({ markdown }: { markdown: string }) {
  return (
    <div className="prose-msd space-y-6 text-[1.0625rem] leading-relaxed">
      <ReactMarkdown
        components={{
          h2: ({ node, ...p }) => <h2 className="pt-4 text-2xl italic" {...p} />,
          h3: ({ node, ...p }) => <h3 className="pt-2 text-xl" {...p} />,
          a: ({ node, ...p }) => (
            <a
              className="underline decoration-line underline-offset-4 hover:decoration-accent"
              {...p}
            />
          ),
          ul: ({ node, ...p }) => <ul className="list-disc space-y-2 pl-6" {...p} />,
          ol: ({ node, ...p }) => <ol className="list-decimal space-y-2 pl-6" {...p} />,
          li: ({ node, ...p }) => <li className="pl-1" {...p} />,
          blockquote: ({ node, ...p }) => (
            <blockquote className="border-l border-accent pl-6 text-ink-muted" {...p} />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
