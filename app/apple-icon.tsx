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
          background: "#0B1220",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FAFAF7",
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
