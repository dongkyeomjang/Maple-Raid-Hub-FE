import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/me/", "/chat/", "/posts/new"],
    },
    sitemap: "https://www.mapleraid.com/sitemap.xml",
  };
}
