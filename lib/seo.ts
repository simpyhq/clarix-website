import type { Metadata } from "next";

export const siteUrl = "https://www.clarixhq.ai";

export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${opts.title} · Clarix`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      title: fullTitle,
      description: opts.description,
      url: opts.path,
    },
    twitter: {
      title: fullTitle,
      description: opts.description,
    },
  };
}
