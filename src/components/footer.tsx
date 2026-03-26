import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-10 mt-auto flex justify-center">
      <Link
        href="https://github.com/danitsdev"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-1.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
      >
        <span className="text-text-tertiary font-mono text-[11px] group-hover:text-accent-green transition-colors">
          created by
        </span>
        <span className="text-text-primary font-mono text-[11px] font-bold border-b border-transparent group-hover:border-accent-green transition-all">
          danitsdev
        </span>
      </Link>
    </footer>
  );
}
