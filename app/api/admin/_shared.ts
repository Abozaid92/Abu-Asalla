import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const resources = [
  "categories",
  "services",
  "projects",
  "areas",
  "faqs",
  "testimonials",
  "blog",
  "blog-categories",
  "blog-tags",
  "quotes",
  "settings",
] as const;

export type Resource = (typeof resources)[number];

// كل مورد بيتربط بتاج الـ cache اللي بتستخدمه lib/data/*.ts (راجع unstable_cache
// tags هناك) — أي تعديل هنا لازم يفضل متطابق مع الملفات دي.
export const tags: Record<Resource, string> = {
  categories: "services",
  services: "services",
  projects: "projects",
  areas: "areas",
  faqs: "faqs",
  testimonials: "testimonials",
  blog: "blog",
  "blog-categories": "blog",
  "blog-tags": "blog",
  quotes: "quotes",
  settings: "settings",
};

const modelMap: Record<Resource, string> = {
  categories: "category",
  services: "service",
  projects: "project",
  areas: "area",
  faqs: "faq",
  testimonials: "testimonial",
  blog: "blogPost",
  "blog-categories": "blogCategory",
  "blog-tags": "blogTag",
  quotes: "quoteRequest",
  settings: "siteSettings",
};

// معظم الموديلات فيها updatedAt، لكن BlogTag مفيهوش (شايف schema.prisma) —
// فبنستخدم createdAt بديل ليه بس عشان GET findMany متكسرش برانتايم error.
export const orderField: Record<Resource, "updatedAt" | "createdAt"> = {
  categories: "updatedAt",
  services: "updatedAt",
  projects: "updatedAt",
  areas: "updatedAt",
  faqs: "updatedAt",
  testimonials: "updatedAt",
  blog: "updatedAt",
  "blog-categories": "updatedAt",
  "blog-tags": "createdAt",
  quotes: "updatedAt",
  settings: "updatedAt",
};

// Zod schemas تُستخدم لكل من POST (كامل) وPATCH (partial()) — نفس مصدر
// الحقيقة عشان مفيش تعديل يعدي من غير تحقق زي ما كان حاصل قبل كده.
export const createSchemas: Partial<Record<Resource, z.ZodTypeAny>> = {
  categories: z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    scope: z.enum(["SERVICE", "PROJECT"]),
    image: z.string().url().optional().nullable(),
    parentId: z.string().optional().nullable(),
  }),
  services: z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    shortDescription: z.string().optional().nullable(),
    content: z.string().min(20),
    heroImage: z.string(),
    gallery: z.array(z.string()).default([]),
    steps: z.array(z.object({ title: z.string(), description: z.string() })).optional().nullable(),
    priceNote: z.string().optional().nullable(),
    categoryId: z.string().optional().nullable(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    keywords: z.array(z.string()).default([]),
    isActive: z.boolean().default(true),
  }),
  projects: z.object({
    title: z.string().min(2),
    slug: z.string().min(2),
    projectType: z.enum(["VILLA", "APARTMENT", "OFFICE", "COMMERCIAL", "OTHER"]),
    categoryId: z.string().optional().nullable(),
    serviceId: z.string().optional().nullable(),
    areaId: z.string().optional().nullable(),
    beforeImage: z.string().optional().nullable(),
    afterImage: z.string().optional().nullable(),
    gallery: z.array(z.string()).default([]),
    videoUrl: z.string().optional().nullable(),
    durationNote: z.string().optional().nullable(),
    challenge: z.string().optional().nullable(),
    solution: z.string().optional().nullable(),
    isFeatured: z.boolean().default(false),
    metaTitle: z.string().optional().nullable(),
    metaDescription: z.string().optional().nullable(),
  }),
  areas: z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    content: z.string().min(20),
    metaTitle: z.string(),
    metaDescription: z.string(),
    keywords: z.array(z.string()).default([]),
    heroImage: z.string().optional().nullable(),
  }),
  faqs: z.object({
    question: z.string().min(4),
    answer: z.string().min(4),
    scope: z.enum(["GENERAL", "SERVICE", "PROJECT"]).default("GENERAL"),
    order: z.number().int().default(0),
    serviceId: z.string().optional().nullable(),
  }),
  testimonials: z.object({
    authorName: z.string().min(2),
    content: z.string().min(4),
    rating: z.number().int().min(1).max(5).default(5),
    authorArea: z.string().optional().nullable(),
    videoUrl: z.string().optional().nullable(),
    isPublished: z.boolean().default(false),
    serviceId: z.string().optional().nullable(),
  }),
  quotes: z.object({
    status: z.enum(["UNREAD", "READ", "CONTACTED", "CLOSED"]),
  }),
  "blog-categories": z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().optional().nullable(),
    color: z.string().default("#2b2b28"),
  }),
  "blog-tags": z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
  }),
  settings: z.object({
    whatsappNumber: z.string().min(6),
    instagramUrl: z.string().url().optional().nullable(),
    heroVideoUrl: z.string().optional().nullable(),
    yearsExperience: z.number().int().optional().nullable(),
    projectsCount: z.number().int().optional().nullable(),
    workingHours: z.string().optional().nullable(),
  }),
  // "blog": مؤجل عمدًا — محرر Tiptap محتاج مسار مخصص (يحوّل JSON → HTML
  // منقّى قبل الحفظ)، مش POST عام زي باقي الموارد. راجع PROGRESS.md.
};

export function getModel(resource: Resource) {
  return (prisma as any)[modelMap[resource]];
}

export function isValidResource(value: string): value is Resource {
  return (resources as readonly string[]).includes(value);
}

export async function requireAdmin() {
  const session = await auth();
  return Boolean(session);
}

export const unauthorized = () =>
  NextResponse.json({ error: "غير مصرح" }, { status: 401 });
