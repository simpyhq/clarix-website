import { ImageResponse } from "next/og";

export const alt = "Clarix Cash Desk — AI bookkeeping and cash visibility for QuickBooks Online";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FAFAF7",
          color: "#0B1220",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#0B1220",
                color: "#FAFAF7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              C
            </div>
            <div style={{ marginLeft: 16, fontSize: 28, fontWeight: 600 }}>Clarix</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, color: "#0B7F58", fontWeight: 600 }}>Cash Desk</div>
            <div style={{ marginTop: 16, fontSize: 68, fontWeight: 700, letterSpacing: -2, lineHeight: 1.02 }}>
              Your books, handled.
            </div>
            <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: -2, lineHeight: 1.02 }}>
              Your cash, clear.
            </div>
            <div style={{ marginTop: 22, fontSize: 26, color: "#475467" }}>
              AI bookkeeping and cash visibility for QuickBooks Online.
            </div>
          </div>
          <div style={{ fontSize: 22, color: "#475467" }}>clarixhq.ai</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
