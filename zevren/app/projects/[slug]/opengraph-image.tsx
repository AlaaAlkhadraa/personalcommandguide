import { ImageResponse } from "next/og";
import { WORK_ITEMS, SITE_CONFIG } from "@/lib/constants";

/**
 * Per-project share card: the project's name and category on the brand
 * ground, so a shared demo link says which demo it is instead of showing
 * the generic site card.
 */

export const runtime = "nodejs";
export const alt = `${SITE_CONFIG.name} projects`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = WORK_ITEMS.find((item) => item.slug === slug);
  const name = project?.name ?? "Projects";
  const category = project?.category ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          backgroundColor: "#0B1530",
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(96,165,250,0.28), transparent 45%), radial-gradient(circle at 85% 0%, rgba(37,99,235,0.35), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 4,
            color: "#ffffff",
          }}
        >
          ZEVREN
          {category ? (
            <span
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: 2,
                color: "#60A5FA",
                border: "1px solid rgba(96,165,250,0.4)",
                borderRadius: 999,
                padding: "6px 18px",
              }}
            >
              {category.toUpperCase()}
            </span>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontSize: 64,
            fontWeight: 600,
            color: "#ffffff",
            maxWidth: 1000,
            lineHeight: 1.1,
          }}
        >
          {name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 26,
            color: "#A9B7CF",
          }}
        >
          zevren.nl/projects
        </div>
      </div>
    ),
    { ...size }
  );
}
