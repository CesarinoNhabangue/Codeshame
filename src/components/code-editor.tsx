"use client";

import hljs from "highlight.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { LanguageSelector } from "@/components/language-selector";
import { codeBlockVariants } from "@/components/ui/code-block";
import { useShikiHighlighter } from "@/hooks/use-shiki-highlighter";
import {
  HLJS_DETECTION_LANGUAGES,
  hljsIdToLanguageKey,
  LANGUAGES,
} from "@/lib/languages";

const MAX_CHARACTERS = 5000;
const formatCount = new Intl.NumberFormat("en-US");

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onLanguageChange?: (language: string) => void;
  className?: string;
  shameMode?: boolean;
  placeholder?: string;
};

function CodeEditor({
  value,
  onChange,
  onLanguageChange,
  className,
  shameMode = true,
  placeholder = "// paste your code here...",
}: CodeEditorProps) {
  const { highlight, isReady, langVersion } = useShikiHighlighter();
  const highlightedRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [detected, setDetected] = useState<string>("plaintext");
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  useEffect(() => {
    if (!value.trim()) {
      setDetected("plaintext");
      return;
    }
    const timer = setTimeout(() => {
      const res = hljs.highlightAuto(value, HLJS_DETECTION_LANGUAGES);
      if (res.language) {
        const key = hljsIdToLanguageKey(res.language) || "javascript";
        setDetected(key);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  const activeLangKey = selectedLang ?? detected;

  useEffect(() => {
    onLanguageChange?.(activeLangKey);
  }, [activeLangKey, onLanguageChange]);

  const ext = LANGUAGES[activeLangKey]?.ext || "txt";
  const filename = shameMode ? `trash.${ext}` : `input.${ext}`;

  const charCount = value.length;
  const isOverLimit = charCount > MAX_CHARACTERS;

  const lines = value.split(/\r?\n/);
  const lineCount = Math.max(lines.length, 1);

  // Synchronous highlight — no debounce for instant feedback
  const highlightedHtml = useMemo(() => {
    // Reference langVersion so it re-evaluates when language loads
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    langVersion;
    if (!isReady || !value) return "";
    return highlight(value, activeLangKey);
  }, [value, activeLangKey, isReady, highlight, langVersion]);

  // Show text visibly when highlight is not ready yet
  const hasHighlight = isReady && highlightedHtml.length > 0;

  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Scroll sync: textarea -> highlighted overlay + line numbers
  const handleScroll = useCallback(() => {
    const textarea = textareaRef.current;
    const highlighted = highlightedRef.current;
    const lineNumbers = lineNumbersRef.current;
    if (!textarea) return;

    if (highlighted) {
      highlighted.scrollTop = textarea.scrollTop;
      highlighted.scrollLeft = textarea.scrollLeft;
    }
    if (lineNumbers) {
      lineNumbers.scrollTop = textarea.scrollTop;
    }
  }, []);

  // Sync scroll on content changes (e.g. hitting Enter)
  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to sync scroll on value change
  useEffect(() => {
    handleScroll();
  }, [value, handleScroll]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();

        const target = e.currentTarget;
        const start = target.selectionStart;
        const end = target.selectionEnd;

        // Use document.execCommand to preserve history (undo/redo stack)
        // This is a web standard trick used in many web code editors including ray.so
        if (start === end) {
          if (e.shiftKey) {
            // Dedent
            const beforeStart = value.slice(0, start);
            const lineStartIdx = beforeStart.lastIndexOf("\n") + 1;
            const lineText = value.slice(lineStartIdx, end);

            if (lineText.startsWith("  ")) {
              target.setSelectionRange(lineStartIdx, end);
              document.execCommand("insertText", false, lineText.slice(2));
            }
          } else {
            // Indent
            document.execCommand("insertText", false, "  ");
          }
        } else {
          // Fallback for multiline selection if needed (simpler: just replace with indent)
          // For now just indenting replacing selection like default behavior, or doing nothing.
          document.execCommand("insertText", false, "  ");
        }
      }
    },
    [value],
  );

  const {
    root,
    header,
    controls,
    controlRed,
    controlAmber,
    controlGreen,
    fileNameContainer,
    fileName: fileNameCls,
    contentContainer,
  } = codeBlockVariants();

  return (
    <div className={twMerge(root(), "h-[300px] sm:h-[400px]", className)}>
      {/* Window Header */}
      <div className={header()}>
        <div className={controls()}>
          <span className={controlRed()} />
          <span className={controlAmber()} />
          <span className={controlGreen()} />
        </div>

        {/* Filename centered */}
        <div className={fileNameContainer()}>
          <span className={fileNameCls()}>{filename}</span>
        </div>

        {/* Language selector */}
        <div className="relative flex items-center bg-bg-input z-50">
          <LanguageSelector
            id="lang-selector"
            detectedLang={detected}
            selectedLang={selectedLang}
            onSelect={setSelectedLang}
          />
        </div>
      </div>

      {/* Code Area */}
      <div className={twMerge(contentContainer(), "flex")}>
        {/* Line Numbers */}
        <div
          ref={lineNumbersRef}
          className="flex flex-col items-end gap-0 py-4 px-3 w-12 shrink-0 border-r border-border-primary bg-[#0f0f0f] select-none overflow-hidden"
        >
          {Array.from({ length: lineCount }, (_, i) => {
            const key = `line-${i}`;
            return (
              <span
                key={key}
                className="font-mono text-[13px] leading-[24px] text-text-tertiary"
              >
                {i + 1}
              </span>
            );
          })}
        </div>

        {/* Editor overlay container */}
        <div className="relative flex-1 min-w-0">
          {/* Highlighted code (below) */}
          <div
            ref={highlightedRef}
            aria-hidden="true"
            className={twMerge(
              "absolute inset-0 py-4 px-4 font-mono text-[13px] leading-[24px] overflow-hidden whitespace-pre pointer-events-none [tab-size:2] [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!bg-transparent [&_.line]:leading-[24px] [font-variant-ligatures:normal] [font-feature-settings:'liga'_1,'calt'_1]",
              !hasHighlight && "opacity-0",
            )}
            dangerouslySetInnerHTML={{
              __html: highlightedHtml,
            }}
          />

          {/* Textarea (above, transparent text when highlight is active) */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            className={twMerge(
              "absolute inset-0 w-full h-full py-4 px-4 bg-transparent border-0 font-mono text-[13px] leading-[24px] outline-none resize-none whitespace-pre overflow-auto overscroll-none [tab-size:2] [font-variant-ligatures:normal] [font-feature-settings:'liga'_1,'calt'_1]",
              hasHighlight
                ? "text-transparent caret-accent-green selection:bg-white/10"
                : "text-text-primary placeholder:text-text-tertiary caret-accent-green",
            )}
          />

          {/* Character count */}
          <div className="absolute bottom-2 right-2 pointer-events-none z-0">
            <span
              className={twMerge(
                "font-mono text-[10px] tabular-nums bg-bg-input/80 px-1.5 py-0.5 rounded backdrop-blur-sm",
                isOverLimit ? "text-accent-red" : "text-text-tertiary",
              )}
            >
              {formatCount.format(charCount)}/{formatCount.format(MAX_CHARACTERS)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CodeEditor, MAX_CHARACTERS, type CodeEditorProps };
