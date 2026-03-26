import { ImageResponse } from "next/og";
import { caller } from "@/trpc/server";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Pre-fetch JetBrains Mono font to use in OG Image
  const [jetbrainsMonoRegular, jetbrainsMonoBold] = await Promise.all([
    fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.ttf",
    ).then((res) => res.arrayBuffer()),
    fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-700-normal.ttf",
    ).then((res) => res.arrayBuffer()),
  ]);

  let roast: {
    score: string;
    language: string;
    code: string;
    summary: string;
  };
  try {
    const result = await caller.roast.getBySlug({ slug });
    roast = result.roast;
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const scoreNum = Number.parseFloat(roast.score);
  let severityBadge = "needs_serious_help";
  let severityColor = "#ef4444"; // bg-accent-red

  if (scoreNum >= 7) {
    severityBadge = "not_that_bad";
    severityColor = "#10b981"; // bg-accent-green
  } else if (scoreNum >= 4) {
    severityBadge = "could_be_worse";
    severityColor = "#f59e0b"; // bg-accent-amber
  }

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a0a", // bg-page
        padding: "64px 80px",
        fontFamily: '"JetBrains Mono", monospace',
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: `radial-gradient(ellipse at center, ${severityColor}44 0%, transparent 70%)`,
        }}
      />

      {/* Header: Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "32px",
          zIndex: 10,
        }}
      >
        <span
          style={{
            color: "#10b981", // accent-green
            fontSize: 40,
            fontWeight: 700,
          }}
        >
          {">"}
        </span>
        <span
          style={{
            color: "#fafafa", // text-primary
            fontSize: 36,
            fontWeight: 700,
          }}
        >
          codeshame
        </span>
      </div>

      {/* Middle Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "64px",
          flex: 1,
          zIndex: 10,
        }}
      >
        {/* Circle */}
        <div
          style={{
            display: "flex",
            width: 320,
            height: 320,
            borderRadius: 160,
            border: `16px solid ${severityColor}`,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay inside circle
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              marginLeft: "12px",
            }}
          >
            <span
              style={{
                color: severityColor,
                fontSize: 84,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {roast.score}
            </span>
            <span
              style={{
                color: "#737373", // text-tertiary
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              /10
            </span>
          </div>
        </div>

        {/* Text Side (Quote & Verdict) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: "28px",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "#fafafa",
              fontSize: 32,
              fontWeight: 400,
              lineHeight: 1.5,
              letterSpacing: "-0.01em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 5,
              WebkitBoxOrient: "vertical",
            }}
          >
            "{roast.summary}"
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: severityColor,
              }}
            />
            <span
              style={{
                color: severityColor,
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {severityBadge}
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "JetBrains Mono",
          data: jetbrainsMonoRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "JetBrains Mono",
          data: jetbrainsMonoBold,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
