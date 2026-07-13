import { signOut } from "@/app/admin/actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <span className="font-sans text-xs uppercase tracking-widest text-ink-muted">
          MedSpa Daily · Admin
        </span>
        <form action={signOut}>
          <button
            type="submit"
            className="font-sans text-xs uppercase tracking-widest text-ink-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Sign out
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
