"use client";

import { Popover } from "@base-ui/react/popover";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

// ---------------------------------------------------------------------------
// Supported languages
// ---------------------------------------------------------------------------

export type SupportedLanguage = {
  id: string;
  label: string;
};

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "csharp", label: "C#" },
  { id: "cpp", label: "C++" },
  { id: "php", label: "PHP" },
  { id: "ruby", label: "Ruby" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
  { id: "kotlin", label: "Kotlin" },
  { id: "swift", label: "Swift" },
  { id: "sql", label: "SQL" },
  { id: "bash", label: "Bash" },
  { id: "json", label: "JSON" },
  { id: "yaml", label: "YAML" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "markdown", label: "Markdown" },
];

function getLangLabel(id: string): string {
  return SUPPORTED_LANGUAGES.find((l) => l.id === id)?.label ?? id;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type LanguageSelectorProps = {
  id?: string;
  detectedLang: string;
  selectedLang: string | null;
  onSelect: (lang: string | null) => void;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LanguageSelector({
  id: customId,
  detectedLang,
  selectedLang,
  onSelect,
}: LanguageSelectorProps) {
  const [filter, setFilter] = useState("");
  const isAuto = selectedLang === null;
  const activeLang = selectedLang ?? detectedLang;
  const isDetecting = detectedLang === "plaintext";
  const reactId = useId();
  const id = customId ?? reactId;

  const filtered = filter.trim()
    ? SUPPORTED_LANGUAGES.filter(
        (l) =>
          l.label.toLowerCase().includes(filter.toLowerCase()) ||
          l.id.toLowerCase().includes(filter.toLowerCase()),
      )
    : SUPPORTED_LANGUAGES;

  return (
    <div className="flex items-center gap-2">
      <Popover.Root
        onOpenChange={(open) => {
          if (!open) setFilter("");
        }}
      >
        <Popover.Trigger
          id={`${id}-trigger`}
          className={[
            "inline-flex items-center gap-1.5",
            "bg-transparent",
            "px-2 py-1 font-mono text-xs",
            "transition-colors duration-150",
            "hover:text-accent-green",
            "focus-visible:outline-none focus-visible:text-accent-green",
            "max-w-[120px] sm:max-w-[140px] justify-between",
            isDetecting && isAuto
              ? "text-text-tertiary"
              : "text-text-secondary",
          ].join(" ")}
        >
          {isAuto ? (
            isDetecting ? (
              <span className="truncate flex-1 text-center">
                Auto detect...
              </span>
            ) : (
              <div className="flex items-center justify-center gap-1 truncate flex-1">
                <span className="text-text-primary truncate">
                  {getLangLabel(activeLang)}
                </span>
                <span className="text-text-tertiary shrink-0">(auto)</span>
              </div>
            )
          ) : (
            <span className="text-text-primary truncate flex-1 text-center">
              {getLangLabel(activeLang)}
            </span>
          )}
          <ChevronDown
            size={12}
            className="text-text-tertiary shrink-0"
            aria-hidden="true"
          />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Positioner side="bottom" align="center" sideOffset={4}>
            <Popover.Popup
              className={[
                "z-[100] w-52 overflow-hidden",
                "border border-border-primary bg-bg-elevated",
                "shadow-lg",
              ].join(" ")}
            >
              {/* Search input */}
              <div className="border-b border-border-primary px-3 py-2 bg-bg-input">
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filter languages..."
                  className={[
                    "w-full bg-transparent font-mono text-xs text-text-primary",
                    "placeholder:text-text-tertiary",
                    "focus:outline-none",
                  ].join(" ")}
                  // biome-ignore lint/a11y/noAutofocus: intentional for popover search
                  autoFocus
                />
              </div>

              {/* Language list */}
              <div
                role="listbox"
                className="max-h-60 overflow-y-auto py-1 bg-bg-input"
              >
                {/* Auto detect option */}
                {(!filter || "auto".includes(filter.toLowerCase())) && (
                  <Popover.Close
                    render={
                      <button
                        type="button"
                        role="option"
                        aria-selected={isAuto}
                        onClick={() => onSelect(null)}
                        className={[
                          "flex w-full cursor-pointer items-center justify-between",
                          "px-3 py-1.5 font-mono text-xs",
                          "transition-colors duration-100",
                          isAuto
                            ? "text-accent-green"
                            : "text-text-secondary hover:bg-bg-page hover:text-text-primary",
                        ].join(" ")}
                      >
                        Auto detect
                        {isAuto && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            aria-hidden="true"
                            className="shrink-0"
                          >
                            <path
                              d="M2 6L5 9L10 3"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    }
                  />
                )}

                {filtered.length === 0 &&
                !(!filter || "auto".includes(filter.toLowerCase())) ? (
                  <div className="px-3 py-2 font-mono text-xs text-text-tertiary">
                    No languages found
                  </div>
                ) : (
                  filtered.map((lang) => {
                    const isSelected = lang.id === selectedLang;
                    return (
                      <Popover.Close
                        key={lang.id}
                        render={
                          <button
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => onSelect(lang.id)}
                            className={[
                              "flex w-full cursor-pointer items-center justify-between",
                              "px-3 py-1.5 font-mono text-xs",
                              "transition-colors duration-100",
                              isSelected
                                ? "text-accent-green"
                                : "text-text-secondary hover:bg-bg-page hover:text-text-primary",
                            ].join(" ")}
                          >
                            {lang.label}
                            {isSelected && (
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                aria-hidden="true"
                                className="shrink-0"
                              >
                                <path
                                  d="M2 6L5 9L10 3"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </button>
                        }
                      />
                    );
                  })
                )}
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
