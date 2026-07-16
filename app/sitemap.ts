import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/constants";
import { getServiceSlugs } from "@/lib/data/services";
import { getProjectSlugs } from "@/lib/data/projects";
import { getAreaSlugs } from "@/lib/data/areas";
import { getPostSlugs } from "@/lib/data/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [serviceSlugs, projectSlugs, areaSlugs, postSlugs] = await Promise.all([
    getServiceSlugs(),
    getProjectSlugs(),
    getAreaSlugs(),
    getPostSlugs(),
  ]);

  const staticPaths = [
    "/",
    "/خدمات",
    "/اعمالنا",
    "/من-نحن",
    "/اتصل-بنا",
    "/الأسئلة-الشائعة",
    "/المدونة",
    "/سياسة-الخصوصية",
    "/الشروط-والأحكام",
  ];

  const dynamicPaths = [
    ...serviceSlugs.map((slug) => `/خدمات/${slug}`),
    ...projectSlugs.map((slug) => `/اعمالنا/${slug}`),
    ...areaSlugs.map((slug) => `/مناطق/${slug}`),
    ...postSlugs.map((slug) => `/المدونة/${slug}`),
  ];

  return [...staticPaths, ...dynamicPaths].map((path) => ({
    url: new URL(path, baseUrl).toString(),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
