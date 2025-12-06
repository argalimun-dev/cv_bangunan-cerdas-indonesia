import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const DOMAIN = "https://bangunancerdas.web.id";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${DOMAIN}/sitemap.xml`,
  };
}
