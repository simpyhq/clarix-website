import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/cash-desk", "/security", "/pricing", "/about", "/demo", "/privacy", "/terms"];
  return paths.map((path) => ({
    url: path === "" ? siteUrl : `${siteUrl}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
