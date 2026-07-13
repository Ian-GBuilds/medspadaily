export default function KeyTakeaways({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section className="my-10 border-y border-line py-8">
      <h2 className="font-sans text-xs uppercase tracking-widest text-ink-muted">
        The short version
      </h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="text-lg leading-relaxed text-ink">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
