"use client";

import { Copy, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ShareRoastModal({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/results/${slug}`);
  }, [slug]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        className="gap-2 px-4 h-12 sm:h-9 w-full sm:w-auto"
        onClick={() => setOpen(true)}
      >
        <span className="font-mono text-sm sm:text-xs">$ share_score</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="flex flex-col w-full max-w-[560px] bg-bg-surface rounded-3xl p-8 gap-8 border border-border-primary shadow-[0_16px_32px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-text-primary font-mono text-2xl font-semibold">
                Share this Score
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Preview */}
            <a
              href={`/results/${slug}/opengraph-image`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col w-full aspect-[1200/630] bg-bg-page rounded-xl border border-border-secondary relative overflow-hidden font-mono cursor-pointer transition-all hover:ring-2 hover:ring-border-primary"
            >
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-black/60 text-text-primary text-xs px-3 py-1.5 rounded-md backdrop-blur-md border border-border-secondary font-medium">
                  Open Image ↗
                </span>
              </div>

              <img
                src={`/results/${slug}/opengraph-image`}
                alt="Open Graph Preview"
                className="w-full h-full object-cover"
              />
            </a>

            {/* Copy Link */}
            <div className="flex items-center gap-2 w-full pt-2">
              <div className="flex-1 bg-bg-input rounded-lg border border-border-primary px-4 py-4 flex items-center overflow-hidden">
                <span className="text-text-primary font-mono text-sm truncate">
                  {url}
                </span>
              </div>
              <button
                type="button"
                onClick={copyLink}
                className="flex items-center justify-center gap-2 bg-accent-green hover:bg-accent-green/90 transition-colors text-black px-6 py-4 rounded-lg font-mono font-semibold cursor-pointer"
              >
                <Copy size={20} />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
