import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "180px",
          height: "180px",
          background: "#1A1F2E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#38BDF8",
          fontSize: 108,
          fontWeight: 700,
        }}
      >
        C
      </div>
    ),
    { ...size },
  );
}
