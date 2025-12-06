import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const DOMAIN = "https://bangunancerdas.web.id";

  return [
    {
      url: `${DOMAIN}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${DOMAIN}/project`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/memory`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
