import { NextResponse } from "next/server";

// The marketing chat widget is the only caller, and no page or layout mounts it.
// The previous handler posted to OpenRouter with no auth and no rate limit.
// Keep the route so a direct call cannot spend the provider key.

function gone(): NextResponse {
  return NextResponse.json(
    { error: "gone" },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}

export function GET(): NextResponse {
  return gone();
}

export function POST(): NextResponse {
  return gone();
}
