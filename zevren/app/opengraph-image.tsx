import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/constants";

export const runtime = "nodejs";
export const alt = `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
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
          backgroundColor: "#050816",
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(96,165,250,0.28), transparent 45%), radial-gradient(circle at 85% 0%, rgba(37,99,235,0.35), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: 4,
            color: "#ffffff",
          }}
        >
          ZEVREN
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 60,
            fontWeight: 600,
            color: "#ffffff",
            maxWidth: 900,
            lineHeight: 1.15,
          }}
        >
          Websites built to make your business look serious
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 28,
            color: "#94A3B8",
          }}
        >
          Independent web studio based in Maastricht, Netherlands
        </div>
      </div>
    ),
    { ...size }
  );
}
