"use client";

import { useEffect, useState } from "react";
import { IconPlus, IconEdit } from "@/components/admin/icons";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  contentHtml: string | null;
  coverImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[];
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED";
  updatedAt: string;
  readingTime: number;
  author?: { name: string } | null;
};

const statusLabels: Record<Post["status"], string> = {
  DRAFT: "مسودة",
  PUBLISHED: "منشور",
  SCHEDULED: "مجدول",
  ARCHIVED: "مؤرشف",
};

const statusPillClass: Record<Post["status"], string> = {
  DRAFT: "pill-read",
  PUBLISHED: "pill-closed",
  SCHEDULED: "pill-contacted",
  ARCHIVED: "pill-no",
};

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  contentHtml: "",
  coverImage: "",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  status: "DRAFT" as Post["status"],
};

export function BlogManager() {
  const [rows, setRows] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [values, setValues] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch("/api/admin/blog", { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setRows(await res.json());
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error("فشل تحميل مقالات المدونة:", e);
      setError(
        e?.name === "AbortError"
          ? "استغرق التحميل وقتًا طويلًا (تأكد من اتصال السيرفر/قاعدة البيانات)."
          : `تعذر تحميل مقالات المدونة (${e?.message ?? "خطأ غير معروف"}).`,
      );
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setValues(emptyForm);
    setShowForm(true);
  }

  function openEdit(post: Post) {
    setEditingId(post.id);
    setValues({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      contentHtml: post.contentHtml ?? "",
      coverImage: post.coverImage ?? "",
      metaTitle: post.metaTitle ?? "",
      metaDescription: post.metaDescription ?? "",
      keywords: (post.keywords ?? []).join(", "),
      status: post.status,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...values,
        keywords: values.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      };
      const url = editingId ? `/api/admin/blog/${editingId}` : "/api/admin/blog";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ? JSON.stringify(body.error) : "تعذر الحفظ");
      }
      setShowForm(false);
      await load();
    } catch (e: any) {
      setError(e.message || "تعذر الحفظ");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("متأكد من حذف المقال؟ الإجراء ده لا يمكن التراجع عنه.")) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.ok) load();
    else setError("تعذر الحذف");
  }

  return (
    <div>
      <div className="admin-resource-head">
        <p style={{ margin: 0, fontSize: 13, color: "var(--a-text-2)" }}>
          {loading ? "جارٍ التحميل..." : `${rows.length} مقال`}
        </p>
        <button className="a-btn a-btn-primary" onClick={openCreate}>
          <IconPlus />
          مقال جديد
        </button>
      </div>

      {error && <p className="form-error" style={{ marginBottom: 14 }}>{error}</p>}

      <div className="glass admin-table-wrap">
        {loading && <p className="admin-loading">جارٍ التحميل...</p>}
        {!loading && rows.length === 0 && (
          <p className="admin-empty-note">لا توجد مقالات بعد. ابدأ بكتابة أول مقال.</p>
        )}
        {!loading && rows.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>العنوان</th>
                <th>الرابط</th>
                <th>مدة القراءة</th>
                <th>الحالة</th>
                <th>آخر تحديث</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td style={{ color: "var(--a-text-2)", fontSize: 12.5 }}>/{p.slug}</td>
                  <td>{p.readingTime} د</td>
                  <td>
                    <span className={`pill ${statusPillClass[p.status]}`}>{statusLabels[p.status]}</span>
                  </td>
                  <td>{new Date(p.updatedAt).toLocaleDateString("ar-SA")}</td>
                  <td className="admin-table-actions">
                    <button className="a-btn a-btn-ghost a-btn-sm" onClick={() => openEdit(p)}>
                      <IconEdit />
                      تعديل
                    </button>
                    <button className="a-btn a-btn-danger a-btn-sm" onClick={() => handleDelete(p.id)}>
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <form className="admin-form glass" onSubmit={handleSubmit}>
            <h2>{editingId ? "تعديل المقال" : "مقال جديد"}</h2>
            <label>
              العنوان
              <input
                required
                value={values.title}
                onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
              />
            </label>
            <label>
              الرابط (slug)
              <input
                required
                value={values.slug}
                onChange={(e) => setValues((v) => ({ ...v, slug: e.target.value }))}
              />
            </label>
            <label>
              مقتطف مختصر
              <textarea
                rows={2}
                value={values.excerpt}
                onChange={(e) => setValues((v) => ({ ...v, excerpt: e.target.value }))}
              />
            </label>
            <label>
              المحتوى (HTML)
              <textarea
                required
                rows={8}
                value={values.contentHtml}
                onChange={(e) => setValues((v) => ({ ...v, contentHtml: e.target.value }))}
              />
            </label>
            <label>
              رابط صورة الغلاف
              <input
                value={values.coverImage}
                onChange={(e) => setValues((v) => ({ ...v, coverImage: e.target.value }))}
              />
            </label>
            <label>
              Meta Title
              <input
                value={values.metaTitle}
                onChange={(e) => setValues((v) => ({ ...v, metaTitle: e.target.value }))}
              />
            </label>
            <label>
              Meta Description
              <textarea
                rows={2}
                value={values.metaDescription}
                onChange={(e) => setValues((v) => ({ ...v, metaDescription: e.target.value }))}
              />
            </label>
            <label>
              كلمات مفتاحية (مفصولة بفاصلة)
              <input
                value={values.keywords}
                onChange={(e) => setValues((v) => ({ ...v, keywords: e.target.value }))}
              />
            </label>
            <label>
              الحالة
              <select
                value={values.status}
                onChange={(e) => setValues((v) => ({ ...v, status: e.target.value as Post["status"] }))}
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <div className="admin-form-actions">
              <button className="a-btn a-btn-ghost" type="button" onClick={() => setShowForm(false)}>
                إلغاء
              </button>
              <button className="a-btn a-btn-primary" type="submit" disabled={submitting}>
                {submitting ? "جارٍ الحفظ..." : "حفظ"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
