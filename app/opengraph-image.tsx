import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Designer Learning Curve";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#f8fafc",
            marginBottom: 24,
          }}
        >
          Designer Learning Curve
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#94a3b8",
          }}
        >
          디자이너를 위한 아티클 큐레이션 & 학습 플랫폼
        </div>
      </div>
    ),
    { ...size }
  );
}
