"use client";

import { useEffect, useState } from "react";

type Settings = {
  whatsappNumber: string;
  instagramUrl: string | null;
  heroVideoUrl: string | null;
  yearsExperience: number | null;
  projectsCount: number | null;
  workingHours: string | null;
};

export function SettingsManager() {
  const [values, setValues] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function load() {
    setLoadError(null);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch("/api/admin/settings", { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data) throw new Error("رجع فاضي من السيرفر");
      setValues(data);
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error("فشل تحميل الإعدادات:", e);
      setLoadError(
        e?.name === "AbortError"
          ? "استغرق تحميل الإعدادات وقتًا طويلًا (تأكد من اتصال قاعدة البيانات)."
          : `تعذر تحميل الإعدادات (${e?.message ?? "خطأ غير معروف"}). تأكد من تسجيل الدخول ومن اتصال السيرفر.`,
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values) return;
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/settings/1", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    setMessage(res.ok ? "تم حفظ الإعدادات بنجاح." : "تعذر الحفظ، حاول مرة أخرى.");
    setSaving(false);
  }

  if (loadError) {
    return (
      <div className="admin-panel glass" style={{ maxWidth: 780 }}>
        <p className="form-error">{loadError}</p>
        <button className="a-btn a-btn-ghost a-btn-sm" style={{ marginTop: 12 }} onClick={load}>
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!values) return <p className="admin-loading">جارٍ التحميل...</p>;

  return (
    <div className="admin-panel glass" style={{ maxWidth: 780 }}>
      <div className="admin-panel-head">
        <h2>إعدادات الموقع العامة</h2>
      </div>
      <form className="admin-form admin-form-inline" style={{ padding: 0 }} onSubmit={handleSubmit}>
        <label>
          رقم واتساب
          <input
            required
            value={values.whatsappNumber}
            onChange={(e) => setValues({ ...values, whatsappNumber: e.target.value })}
          />
        </label>
        <label>
          رابط انستجرام
          <input
            value={values.instagramUrl ?? ""}
            onChange={(e) => setValues({ ...values, instagramUrl: e.target.value })}
          />
        </label>
        <label>
          رابط فيديو الهيرو
          <input
            value={values.heroVideoUrl ?? ""}
            onChange={(e) => setValues({ ...values, heroVideoUrl: e.target.value })}
          />
        </label>
        <label>
          سنين الخبرة
          <input
            type="number"
            value={values.yearsExperience ?? ""}
            onChange={(e) =>
              setValues({ ...values, yearsExperience: e.target.value ? Number(e.target.value) : null })
            }
          />
        </label>
        <label>
          عدد المشاريع
          <input
            type="number"
            value={values.projectsCount ?? ""}
            onChange={(e) =>
              setValues({ ...values, projectsCount: e.target.value ? Number(e.target.value) : null })
            }
          />
        </label>
        <label>
          ساعات العمل
          <input
            value={values.workingHours ?? ""}
            onChange={(e) => setValues({ ...values, workingHours: e.target.value })}
          />
        </label>
        {message && <p>{message}</p>}
        <div className="admin-form-actions">
          <button className="a-btn a-btn-primary" type="submit" disabled={saving}>
            {saving ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
          </button>
        </div>
      </form>
    </div>
  );
}
