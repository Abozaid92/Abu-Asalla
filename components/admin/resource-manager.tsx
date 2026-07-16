"use client";

import { useEffect, useState } from "react";
import type { ResourceConfig, FieldConfig } from "@/lib/admin/types";
import {
  categoriesConfig,
  servicesConfig,
  projectsConfig,
  areasConfig,
  faqsConfig,
  testimonialsConfig,
  blogCategoriesConfig,
  blogTagsConfig,
} from "@/lib/admin/configs";
import { IconPlus, IconEdit } from "@/components/admin/icons";

// الكونفيجات فيها functions (render) في الأعمدة، فمينفعش تتبعت كـ prop من
// Server Component لـ Client Component. الحل: نستورد الكونفيجات هنا جوه
// الملف ده نفسه (Client Component) ونختار بالاسم بس.
const configsByResource: Record<string, ResourceConfig> = {
  categories: categoriesConfig,
  services: servicesConfig,
  projects: projectsConfig,
  areas: areasConfig,
  faqs: faqsConfig,
  testimonials: testimonialsConfig,
  "blog-categories": blogCategoriesConfig,
  "blog-tags": blogTagsConfig,
};

type Row = Record<string, any>;

function emptyFormValues(fields: FieldConfig[]): Row {
  const values: Row = {};
  for (const field of fields) {
    if (field.type === "boolean") values[field.key] = false;
    else values[field.key] = "";
  }
  return values;
}

function toPayload(values: Row, fields: FieldConfig[]) {
  const payload: Row = {};
  for (const field of fields) {
    const raw = values[field.key];
    if (field.type === "tags") {
      payload[field.key] = String(raw || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (field.type === "number") {
      payload[field.key] = raw === "" || raw === null ? null : Number(raw);
    } else if (field.type === "boolean") {
      payload[field.key] = Boolean(raw);
    } else {
      payload[field.key] = raw === "" ? null : raw;
    }
  }
  return payload;
}

function fromRow(row: Row, fields: FieldConfig[]) {
  const values: Row = {};
  for (const field of fields) {
    const raw = row[field.key];
    if (field.type === "tags")
      values[field.key] = Array.isArray(raw) ? raw.join(", ") : "";
    else if (field.type === "boolean") values[field.key] = Boolean(raw);
    else values[field.key] = raw ?? "";
  }
  return values;
}

export function ResourceManager({ resourceKey }: { resourceKey: string }) {
  const config = configsByResource[resourceKey];
  if (!config)
    return <p className="form-error">مورد غير معروف: {resourceKey}</p>;
  return <ResourceManagerInner config={config} />;
}

function ResourceManagerInner({ config }: { config: ResourceConfig }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [values, setValues] = useState<Row>(() =>
    emptyFormValues(config.fields),
  );
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(`/api/admin/${config.resource}`, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(`فشل تحميل ${config.resource}:`, e);
      setError(
        e?.name === "AbortError"
          ? "استغرق التحميل وقتًا طويلًا (تأكد من اتصال السيرفر/قاعدة البيانات)."
          : `تعذر تحميل البيانات (${e?.message ?? "خطأ غير معروف"}).`,
      );
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.resource]);

  function openCreate() {
    setEditingId(null);
    setValues(emptyFormValues(config.fields));
    setShowForm(true);
  }

  function openEdit(row: Row) {
    setEditingId(row.id);
    setValues(fromRow(row, config.fields));
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = toPayload(values, config.fields);
      const url =
        editingId ?
          `/api/admin/${config.resource}/${editingId}`
        : `/api/admin/${config.resource}`;
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
    if (!confirm("متأكد من الحذف؟ الإجراء ده لا يمكن التراجع عنه.")) return;
    const res = await fetch(`/api/admin/${config.resource}/${id}`, {
      method: "DELETE",
    });
    if (res.ok) load();
    else setError("تعذر الحذف");
  }

  return (
    <div>
      <div className="admin-resource-head">
        <div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--a-text-2)" }}>
            {loading ? "جارٍ التحميل..." : `${rows.length} عنصر`}
          </p>
        </div>
        <button className="a-btn a-btn-primary" onClick={openCreate}>
          <IconPlus />
          إضافة جديد
        </button>
      </div>

      {error && <p className="form-error" style={{ marginBottom: 14 }}>{error}</p>}

      <div className="glass admin-table-wrap">
        {loading && <p className="admin-loading">جارٍ التحميل...</p>}
        {!loading && rows.length === 0 && (
          <p className="admin-empty-note">لا توجد عناصر بعد. ابدأ بإضافة أول عنصر.</p>
        )}

        {!loading && rows.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                {config.columns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {config.columns.map((c) => (
                    <td key={c.key}>
                      {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                    </td>
                  ))}
                  <td className="admin-table-actions">
                    <button className="a-btn a-btn-ghost a-btn-sm" onClick={() => openEdit(row)}>
                      <IconEdit />
                      تعديل
                    </button>
                    <button
                      className="a-btn a-btn-danger a-btn-sm"
                      onClick={() => handleDelete(row.id)}
                    >
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
            <h2>{editingId ? `تعديل — ${config.title}` : `إضافة جديد — ${config.title}`}</h2>
            {config.fields.map((field) => (
              <label
                key={field.key}
                className={field.type === "boolean" ? "field-boolean" : ""}
              >
                {field.type === "boolean" ? (
                  <>
                    <input
                      type="checkbox"
                      checked={Boolean(values[field.key])}
                      onChange={(e) =>
                        setValues((v) => ({
                          ...v,
                          [field.key]: e.target.checked,
                        }))
                      }
                    />
                    {field.label}
                  </>
                ) : (
                  field.label
                )}
                {field.type === "textarea" && (
                  <textarea
                    required={field.required}
                    rows={5}
                    placeholder={field.placeholder}
                    value={values[field.key] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.key]: e.target.value }))
                    }
                  />
                )}
                {field.type === "select" && (
                  <select
                    required={field.required}
                    value={values[field.key] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.key]: e.target.value }))
                    }
                  >
                    <option value="" disabled>
                      اختر
                    </option>
                    {field.options?.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                )}
                {(field.type === "text" ||
                  field.type === "number" ||
                  field.type === "tags") && (
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={values[field.key] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.key]: e.target.value }))
                    }
                  />
                )}
              </label>
            ))}
            <div className="admin-form-actions">
              <button
                className="a-btn a-btn-ghost"
                type="button"
                onClick={() => setShowForm(false)}
              >
                إلغاء
              </button>
              <button
                className="a-btn a-btn-primary"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "جارٍ الحفظ..." : "حفظ"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
