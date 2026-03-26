import Link from "next/link";

export function Navbar() {
  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-border-primary px-10 bg-bg-page">
      <Link href="/" className="flex items-center gap-2">
        <span className="font-mono text-xl font-bold text-accent-green">
          &gt;
        </span>
        <span className="font-mono text-lg font-medium text-text-primary">
          codeshame
        </span>
      </Link>

      <nav className="flex items-center gap-6">
        <Link
          href="/leaderboard"
          className="font-mono text-[13px] text-text-secondary transition-colors hover:text-text-primary"
        >
          leaderboard
        </Link>
      </nav>
    </header>
  );
}
