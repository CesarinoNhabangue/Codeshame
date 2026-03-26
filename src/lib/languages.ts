type LanguageEntry = {
  name: string;
  shikiId: string;
  hljsId: string;
  ext: string;
  /** Load this language eagerly on initialization */
  eager?: boolean;
};

const LANGUAGES: Record<string, LanguageEntry> = {
  javascript: {
    name: "JavaScript",
    shikiId: "javascript",
    hljsId: "javascript",
    ext: "js",
    eager: true,
  },
  typescript: {
    name: "TypeScript",
    shikiId: "typescript",
    hljsId: "typescript",
    ext: "ts",
    eager: true,
  },
  jsx: {
    name: "JSX",
    shikiId: "jsx",
    hljsId: "javascript",
    ext: "jsx",
    eager: true,
  },
  tsx: {
    name: "TSX",
    shikiId: "tsx",
    hljsId: "typescript",
    ext: "tsx",
    eager: true,
  },
  python: {
    name: "Python",
    shikiId: "python",
    hljsId: "python",
    ext: "py",
  },
  go: {
    name: "Go",
    shikiId: "go",
    hljsId: "go",
    ext: "go",
  },
  rust: {
    name: "Rust",
    shikiId: "rust",
    hljsId: "rust",
    ext: "rs",
  },
  java: {
    name: "Java",
    shikiId: "java",
    hljsId: "java",
    ext: "java",
  },
  ruby: {
    name: "Ruby",
    shikiId: "ruby",
    hljsId: "ruby",
    ext: "rb",
  },
  php: {
    name: "PHP",
    shikiId: "php",
    hljsId: "php",
    ext: "php",
  },
  sql: {
    name: "SQL",
    shikiId: "sql",
    hljsId: "sql",
    ext: "sql",
  },
  bash: {
    name: "Shell",
    shikiId: "shellscript",
    hljsId: "bash",
    ext: "sh",
  },
  html: {
    name: "HTML",
    shikiId: "html",
    hljsId: "xml",
    ext: "html",
  },
  css: {
    name: "CSS",
    shikiId: "css",
    hljsId: "css",
    ext: "css",
  },
  json: {
    name: "JSON",
    shikiId: "json",
    hljsId: "json",
    ext: "json",
  },
  yaml: {
    name: "YAML",
    shikiId: "yaml",
    hljsId: "yaml",
    ext: "yml",
  },
  markdown: {
    name: "Markdown",
    shikiId: "markdown",
    hljsId: "markdown",
    ext: "md",
  },
  c: {
    name: "C",
    shikiId: "c",
    hljsId: "c",
    ext: "c",
  },
  cpp: {
    name: "C++",
    shikiId: "cpp",
    hljsId: "cpp",
    ext: "cpp",
  },
  csharp: {
    name: "C#",
    shikiId: "csharp",
    hljsId: "csharp",
    ext: "cs",
  },
  swift: {
    name: "Swift",
    shikiId: "swift",
    hljsId: "swift",
    ext: "swift",
  },
  kotlin: {
    name: "Kotlin",
    shikiId: "kotlin",
    hljsId: "kotlin",
    ext: "kt",
  },
  dart: {
    name: "Dart",
    shikiId: "dart",
    hljsId: "dart",
    ext: "dart",
  },
  plaintext: {
    name: "Plain Text",
    shikiId: "plaintext",
    hljsId: "plaintext",
    ext: "txt",
  },
} as const;

/** Language keys used as option values (sorted alphabetically by display name) */
const LANGUAGE_OPTIONS = Object.entries(LANGUAGES)
  .sort(([, a], [, b]) => a.name.localeCompare(b.name))
  .map(([key, entry]) => ({ value: key, label: entry.name }));

/** All hljs language IDs registered for auto-detection */
const HLJS_DETECTION_LANGUAGES = [
  ...new Set(Object.values(LANGUAGES).map((l) => l.hljsId)),
];

/** Map hljs detected ID back to our language key */
function hljsIdToLanguageKey(hljsId: string): string | null {
  const entry = Object.entries(LANGUAGES).find(
    ([, lang]) => lang.hljsId === hljsId,
  );
  return entry?.[0] ?? null;
}

export {
  LANGUAGES,
  LANGUAGE_OPTIONS,
  HLJS_DETECTION_LANGUAGES,
  hljsIdToLanguageKey,
  type LanguageEntry,
};
