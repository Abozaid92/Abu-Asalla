"use client";

import { useEffect, useState } from "react";
import { IconWhatsapp } from "@/components/admin/icons";

type Quote = {
  id: string;
  name: string;
  phone: string;
  areaText: string | null;
  notes: string | null;
  status: "UNREAD" | "READ" | "CONTACTED" | "CLOSED";
  createdAt: string;
  service?: { name: string } | null;
};

const statusLabels: Record<Quote["status"], string> = {
  UNREAD: "غير مقروء",
  READ: "مقروء",
  CONTACTED: "تم التواصل",
  CLOSED: "مغلق",
};

const statusPillClass: Record<Quote["status"], string> = {
  UNREAD: "pill-unread",
  READ: "pill-read",
  CONTACTED: "pill-contacted",
  CLOSED: "pill-closed",
};

export function QuotesManager() {
  const [rows, setRows] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Quote["status"] | "ALL">("ALL");

  async function load() {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch("/api/admin/quotes", { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setRows(await res.json());
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error("فشل تحميل الطلبات:", e);
      setError(
        e?.name === "AbortError"
          ? "استغرق التحميل وقتًا طويلًا (تأكد من اتصال السيرفر/قاعدة البيانات)."
          : `تعذر تحميل الطلبات (${e?.message ?? "خطأ غير معروف"}).`,
      );
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: Quote["status"]) {
    const res = await fetch(`/api/admin/quotes/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
  }

  const counts = rows.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const visibleRows = filter === "ALL" ? rows : rows.filter((r) => r.status === filter);

  return (
    <div>
      <div className="admin-stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 18 }}>
        {(Object.keys(statusLabels) as Quote["status"][]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(filter === s ? "ALL" : s)}
            className="admin-stat-card glass"
            style={{
              cursor: "pointer",
              textAlign: "right",
              border: filter === s ? "1px solid rgba(212,175,106,0.5)" : undefined,
            }}
          >
            <span className={`pill ${statusPillClass[s]}`}>{statusLabels[s]}</span>
            <b style={{ marginTop: 10 }}>{counts[s] ?? 0}</b>
          </button>
        ))}
      </div>

      {error && <p className="form-error" style={{ marginBottom: 14 }}>{error}</p>}

      <div className="glass admin-table-wrap">
        {loading && <p className="admin-loading">جارٍ التحميل...</p>}
        {!loading && visibleRows.length === 0 && (
          <p className="admin-empty-note">لا توجد طلبات{filter !== "ALL" ? " بهذه الحالة" : ""}.</p>
        )}
        {!loading && visibleRows.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الجوال</th>
                <th>الخدمة</th>
                <th>ملاحظات</th>
                <th>التاريخ</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>
                    <a
                      href={`https://wa.me/${row.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: "var(--a-success)",
                        textDecoration: "none",
                      }}
                    >
                      <IconWhatsapp style={{ width: 15, height: 15 }} />
                      {row.phone}
                    </a>
                  </td>
                  <td>{row.service?.name ?? "—"}</td>
                  <td style={{ maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {row.notes ?? "—"}
                  </td>
                  <td>{new Date(row.createdAt).toLocaleDateString("ar-SA")}</td>
                  <td>
                    <select
                      value={row.status}
                      onChange={(e) => updateStatus(row.id, e.target.value as Quote["status"])}
                      style={{
                        background: "rgba(0,0,0,0.25)",
                        border: "1px solid var(--a-border)",
                        borderRadius: 9,
                        color: "var(--a-text-0)",
                        padding: "6px 10px",
                        fontSize: 12.5,
                        fontFamily: "inherit",
                      }}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
