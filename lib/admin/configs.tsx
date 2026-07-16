import type { ResourceConfig } from "@/lib/admin/types";

export const categoriesConfig: ResourceConfig = {
  resource: "categories",
  title: "الأقسام",
  columns: [
    { key: "name", label: "الاسم" },
    { key: "slug", label: "الرابط" },
    { key: "scope", label: "النوع", render: (r) => (r.scope === "SERVICE" ? "خدمة" : "مشروع") },
  ],
  fields: [
    { key: "name", label: "الاسم", type: "text", required: true },
    { key: "slug", label: "الرابط (slug)", type: "text", required: true },
    {
      key: "scope",
      label: "النوع",
      type: "select",
      required: true,
      options: [
        { value: "SERVICE", label: "خدمة" },
        { value: "PROJECT", label: "مشروع" },
      ],
    },
    { key: "image", label: "رابط صورة (اختياري)", type: "text" },
  ],
};

export const servicesConfig: ResourceConfig = {
  resource: "services",
  title: "الخدمات",
  columns: [
    { key: "name", label: "الاسم" },
    { key: "slug", label: "الرابط" },
    { key: "isActive", label: "مفعّلة؟", render: (r) => (r.isActive ? "نعم" : "لا") },
  ],
  fields: [
    { key: "name", label: "اسم الخدمة", type: "text", required: true },
    { key: "slug", label: "الرابط (slug)", type: "text", required: true },
    { key: "shortDescription", label: "وصف مختصر (يظهر في البطاقات)", type: "text" },
    { key: "content", label: "المحتوى الكامل (1600-2400 كلمة)", type: "textarea", required: true },
    { key: "heroImage", label: "رابط الصورة الرئيسية", type: "text", required: true },
    { key: "gallery", label: "معرض الصور (روابط مفصولة بفاصلة)", type: "tags" },
    { key: "priceNote", label: "ملاحظة سعر (اختياري)", type: "text" },
    { key: "metaTitle", label: "Meta Title", type: "text", required: true },
    { key: "metaDescription", label: "Meta Description", type: "textarea", required: true },
    { key: "keywords", label: "كلمات مفتاحية (مفصولة بفاصلة)", type: "tags" },
    { key: "isActive", label: "مفعّلة", type: "boolean" },
  ],
};

export const projectsConfig: ResourceConfig = {
  resource: "projects",
  title: "الأعمال والمشاريع",
  columns: [
    { key: "title", label: "العنوان" },
    { key: "projectType", label: "النوع" },
    { key: "isFeatured", label: "مميز؟", render: (r) => (r.isFeatured ? "نعم" : "لا") },
  ],
  fields: [
    { key: "title", label: "العنوان", type: "text", required: true },
    { key: "slug", label: "الرابط (slug)", type: "text", required: true },
    {
      key: "projectType",
      label: "نوع المكان",
      type: "select",
      required: true,
      options: [
        { value: "VILLA", label: "فيلا" },
        { value: "APARTMENT", label: "شقة" },
        { value: "OFFICE", label: "مكتب" },
        { value: "COMMERCIAL", label: "تجاري" },
        { value: "OTHER", label: "أخرى" },
      ],
    },
    { key: "beforeImage", label: "صورة قبل (اختياري)", type: "text" },
    { key: "afterImage", label: "صورة بعد (اختياري)", type: "text" },
    { key: "gallery", label: "معرض الصور (روابط مفصولة بفاصلة)", type: "tags" },
    { key: "durationNote", label: "مدة التنفيذ", type: "text" },
    { key: "challenge", label: "التحدي", type: "textarea" },
    { key: "solution", label: "الحل", type: "textarea" },
    { key: "isFeatured", label: "يظهر في الرئيسية", type: "boolean" },
    { key: "metaTitle", label: "Meta Title (اختياري)", type: "text" },
    { key: "metaDescription", label: "Meta Description (اختياري)", type: "textarea" },
  ],
};

export const areasConfig: ResourceConfig = {
  resource: "areas",
  title: "المناطق",
  columns: [
    { key: "name", label: "الاسم" },
    { key: "slug", label: "الرابط" },
  ],
  fields: [
    { key: "name", label: "اسم الحي", type: "text", required: true },
    { key: "slug", label: "الرابط (slug)", type: "text", required: true },
    { key: "content", label: "المحتوى (400-600 كلمة على الأقل)", type: "textarea", required: true },
    { key: "heroImage", label: "رابط صورة (اختياري)", type: "text" },
    { key: "metaTitle", label: "Meta Title", type: "text", required: true },
    { key: "metaDescription", label: "Meta Description", type: "textarea", required: true },
    { key: "keywords", label: "كلمات مفتاحية (مفصولة بفاصلة)", type: "tags" },
  ],
};

export const faqsConfig: ResourceConfig = {
  resource: "faqs",
  title: "الأسئلة الشائعة",
  columns: [
    { key: "question", label: "السؤال" },
    { key: "scope", label: "النطاق" },
  ],
  fields: [
    { key: "question", label: "السؤال", type: "text", required: true },
    { key: "answer", label: "الإجابة", type: "textarea", required: true },
    {
      key: "scope",
      label: "النطاق",
      type: "select",
      required: true,
      options: [
        { value: "GENERAL", label: "عام" },
        { value: "SERVICE", label: "خدمة" },
        { value: "PROJECT", label: "مشروع" },
      ],
    },
    { key: "order", label: "الترتيب", type: "number" },
  ],
};

export const testimonialsConfig: ResourceConfig = {
  resource: "testimonials",
  title: "الشهادات",
  columns: [
    { key: "authorName", label: "الاسم" },
    { key: "rating", label: "التقييم" },
    { key: "isPublished", label: "منشورة؟", render: (r) => (r.isPublished ? "نعم" : "لا") },
  ],
  fields: [
    { key: "authorName", label: "اسم العميل", type: "text", required: true },
    { key: "authorArea", label: "الحي (اختياري)", type: "text" },
    { key: "content", label: "نص التقييم", type: "textarea", required: true },
    { key: "rating", label: "التقييم (1-5)", type: "number", required: true },
    {
      key: "isPublished",
      label: "منشورة (لا تفعّل غير لو التقييم حقيقي فعلًا — راجع REQUIREMENTS.md §8)",
      type: "boolean",
    },
  ],
};

export const blogCategoriesConfig: ResourceConfig = {
  resource: "blog-categories",
  title: "تصنيفات المدونة",
  columns: [
    { key: "name", label: "الاسم" },
    { key: "slug", label: "الرابط" },
    { key: "color", label: "اللون" },
  ],
  fields: [
    { key: "name", label: "الاسم", type: "text", required: true },
    { key: "slug", label: "الرابط (slug)", type: "text", required: true },
    { key: "description", label: "وصف (اختياري)", type: "textarea" },
    { key: "color", label: "لون (hex)", type: "text", placeholder: "#2b2b28" },
  ],
};

export const blogTagsConfig: ResourceConfig = {
  resource: "blog-tags",
  title: "وسوم المدونة",
  columns: [
    { key: "name", label: "الاسم" },
    { key: "slug", label: "الرابط" },
  ],
  fields: [
    { key: "name", label: "الاسم", type: "text", required: true },
    { key: "slug", label: "الرابط (slug)", type: "text", required: true },
  ],
};
