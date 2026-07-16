import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  IconMail,
  IconBriefcase,
  IconLayers,
  IconWhatsapp,
} from "@/components/admin/icons";

const statusLabels: Record<string, string> = {
  UNREAD: "غير مقروء",
  READ: "مقروء",
  CONTACTED: "تم التواصل",
  CLOSED: "مغلق",
};

const statusPillClass: Record<string, string> = {
  UNREAD: "pill-unread",
  READ: "pill-read",
  CONTACTED: "pill-contacted",
  CLOSED: "pill-closed",
};

function dayLabel(d: Date) {
  return d.toLocaleDateString("ar-SA", { weekday: "short" });
}

export async function DashboardOverview() {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [
    quotesTotal,
    quotesUnread,
    servicesActive,
    projectsTotal,
    testimonialsPending,
    recentQuotes,
    recentQuotesForChart,
  ] = await Promise.all([
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({ where: { status: "UNREAD" } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.project.count(),
    prisma.testimonial.count({ where: { isPublished: false } }),
    prisma.quoteRequest.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { service: { select: { name: true } } },
    }),
    prisma.quoteRequest.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    }),
  ]);

  // تجميع طلبات آخر 7 أيام يدويًا (بدون مكتبة تجميع) عشان نرسم شارت بسيط
  // بـ CSS فقط، من غير أي مكتبة رسوم بيانية على العميل.
  const days: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toDateString();
    const count = recentQuotesForChart.filter(
      (q) => new Date(q.createdAt).toDateString() === key,
    ).length;
    days.push({ label: dayLabel(d), count });
  }
  const maxCount = Math.max(1, ...days.map((d) => d.count));

  return (
    <>
      <div className="admin-stats-grid">
        <div className="admin-stat-card glass">
          {quotesUnread > 0 && <span className="stat-trend trend-warn">جديد</span>}
          <div className="stat-icon">
            <IconMail />
          </div>
          <b>{quotesTotal}</b>
          <span className="label">إجمالي طلبات عروض الأسعار</span>
        </div>

        <div className="admin-stat-card glass">
          <div className="stat-icon">
            <IconWhatsapp />
          </div>
          <b>{quotesUnread}</b>
          <span className="label">طلبات غير مقروءة</span>
        </div>

        <div className="admin-stat-card glass">
          <div className="stat-icon">
            <IconBriefcase />
          </div>
          <b>{servicesActive}</b>
          <span className="label">خدمات مفعّلة</span>
        </div>

        <div className="admin-stat-card glass">
          <div className="stat-icon">
            <IconLayers />
          </div>
          <b>{projectsTotal}</b>
          <span className="label">أعمال ومشاريع منشورة</span>
        </div>
      </div>

      <div className="admin-dash-grid">
        <div className="admin-panel glass">
          <div className="admin-panel-head">
            <h2>طلبات عروض الأسعار — آخر 7 أيام</h2>
            <Link href="/admin/quotes" className="a-btn a-btn-ghost a-btn-sm">
              عرض الكل
            </Link>
          </div>
          <div className="chart-bars">
            {days.map((d, i) => (
              <div className="chart-bar-col" key={i}>
                <div
                  className="chart-bar"
                  style={{ height: `${(d.count / maxCount) * 100}%` }}
                  title={`${d.count} طلب`}
                />
                <span>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel glass">
          <div className="admin-panel-head">
            <h2>أحدث الطلبات</h2>
          </div>
          {recentQuotes.length === 0 && (
            <p className="admin-empty-note">لا توجد طلبات بعد.</p>
          )}
          <div className="admin-list">
            {recentQuotes.map((q) => (
              <div className="admin-list-row" key={q.id}>
                <div className="row-icon">{q.name?.[0] ?? "؟"}</div>
                <div className="row-main">
                  <b>{q.name}</b>
                  <span>{q.service?.name ?? "بدون خدمة محددة"}</span>
                </div>
                <span className={`pill ${statusPillClass[q.status]}`}>
                  {statusLabels[q.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {testimonialsPending > 0 && (
        <div className="admin-panel glass" style={{ marginTop: 16 }}>
          <div className="admin-panel-head">
            <h2>⭐ بانتظار المراجعة</h2>
            <Link href="/admin/testimonials" className="a-btn a-btn-ghost a-btn-sm">
              مراجعة الشهادات
            </Link>
          </div>
          <p style={{ margin: 0, color: "var(--a-text-2)", fontSize: 13 }}>
            يوجد {testimonialsPending} شهادة عميل غير منشورة بعد — راجعها قبل
            نشرها للتأكد إنها حقيقية.
          </p>
        </div>
      )}
    </>
  );
}
