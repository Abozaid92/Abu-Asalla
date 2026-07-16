import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import { DashboardOverview } from "@/components/admin/dashboard-overview";
import { ResourceManager } from "@/components/admin/resource-manager";
import { QuotesManager } from "@/components/admin/quotes-manager";
import { SettingsManager } from "@/components/admin/settings-manager";
import { BlogManager } from "@/components/admin/blog-manager";

const labels: Record<string, string> = {
  dashboard: "لوحة التحكم",
  categories: "الأقسام",
  services: "الخدمات",
  projects: "الأعمال والمشاريع",
  blog: "المدونة",
  "blog-categories": "تصنيفات المدونة",
  "blog-tags": "وسوم المدونة",
  areas: "المناطق",
  faqs: "الأسئلة الشائعة",
  quotes: "طلبات عروض السعر",
  testimonials: "الشهادات",
  settings: "الإعدادات",
};

const genericResources = new Set([
  "categories",
  "services",
  "projects",
  "areas",
  "faqs",
  "testimonials",
  "blog-categories",
  "blog-tags",
]);

function SectionContent({ section }: { section: string }) {
  if (section === "dashboard") return <DashboardOverview />;
  if (section === "quotes") return <QuotesManager />;
  if (section === "settings") return <SettingsManager />;
  if (section === "blog") return <BlogManager />;
  if (genericResources.has(section))
    return <ResourceManager resourceKey={section} />;
  return (
    <div className="admin-panel glass">
      <p style={{ margin: 0, color: "var(--a-text-2)" }}>
        القسم غير موجود. اختر قسمًا من القائمة الجانبية.
      </p>
    </div>
  );
}

export default async function AdminSection({
  params,
}: {
  params: Promise<{ section: string[] }>;
}) {
  const key = (await params).section[0] || "dashboard";
  const label = labels[key] ?? "لوحة التحكم";

  const [session, unreadQuotes] = await Promise.all([
    auth(),
    prisma.quoteRequest.count({ where: { status: "UNREAD" } }),
  ]);

  const userName = session?.user?.name || "الأدمن";
  const userEmail = session?.user?.email || "";

  return (
    <div className="admin-layout">
      <SidebarNav
        userName={userName}
        userEmail={userEmail}
        unreadQuotes={unreadQuotes}
      />
      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1>{label}</h1>
            <p className="admin-breadcrumb">
              لوحة التحكم <span>/ {label}</span>
            </p>
          </div>
        </div>
        <SectionContent section={key} />
      </main>
    </div>
  );
}
