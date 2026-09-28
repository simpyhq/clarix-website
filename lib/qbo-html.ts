// HTML for the OAuth browser pages. Every interpolated value is escaped.
// Callers pass plain text; they do not pass markup.

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderConnectionPage(options: { success: boolean; message: string }): string {
  const heading = options.success ? "Connected" : "Connection Issue";
  const color = options.success ? "#16a34a" : "#dc2626";
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>ClarixHQ · QuickBooks Connection</title>
<style>
  body { font-family: -apple-system, sans-serif; background:#0a0a0a; color:#eee;
         display:flex; align-items:center; justify-content:center; height:100vh; margin:0; }
  .card { text-align:center; max-width:480px; padding:2rem; }
  h1 { color:${color}; font-size:1.25rem; margin-bottom:0.5rem; }
  p { color:#999; font-size:0.9rem; line-height:1.5; }
</style>
</head>
<body>
  <div class="card">
    <h1>${escapeHtml(heading)}</h1>
    <p>${escapeHtml(options.message)}</p>
  </div>
</body>
</html>`;
}

export const HTML_PAGE_HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex",
} as const;
