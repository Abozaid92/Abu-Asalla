"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconGrid,
  IconTag,
  IconBriefcase,
  IconLayers,
  IconNewspaper,
  IconMapPin,
  IconMail,
  IconStar,
  IconSettings,
  IconLogout,
} from "@/components/admin/icons";
import { logoutAction } from "@/lib/admin/actions";

const primaryNav = [
  { href: "/admin/dashboard", label: "لوحة التحكم", icon: IconGrid },
];

const contentNav = [
  { href: "/admin/categories", label: "الأقسام", icon: IconTag },
  { href: "/admin/services", label: "الخدمات", icon: IconBriefcase },
  { href: "/admin/projects", label: "الأعمال والمشاريع", icon: IconLayers },
  { href: "/admin/blog", label: "المدونة", icon: IconNewspaper },
  { href: "/admin/blog-categories", label: "تصنيفات المدونة", icon: IconTag },
  { href: "/admin/blog-tags", label: "وسوم المدونة", icon: IconTag },
  { href: "/admin/areas", label: "المناطق", icon: IconMapPin },
  { href: "/admin/faqs", label: "الأسئلة الشائعة", icon: IconMail },
  { href: "/admin/testimonials", label: "الشهادات", icon: IconStar },
];

const opsNav = [
  { href: "/admin/quotes", label: "طلبات عروض السعر", icon: IconMail },
  { href: "/admin/settings", label: "الإعدادات", icon: IconSettings },
];

export function SidebarNav({
  userName,
  userEmail,
  unreadQuotes,
}: {
  userName: string;
  userEmail: string;
  unreadQuotes: number;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const initials = userName
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  return (
    <aside className="admin-sidebar glass">
      <div className="admin-brand">
        <div className="admin-brand-mark">أ أ</div>
        <div>
          <b>أبو أصاله</b>
          <span>لوحة التحكم</span>
        </div>
      </div>

      <nav className="admin-nav">
        {primaryNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={isActive(item.href) ? "active" : ""}
          >
            <item.icon />
            {item.label}
          </Link>
        ))}

        <p className="admin-nav-group-label">المحتوى</p>
        {contentNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={isActive(item.href) ? "active" : ""}
          >
            <item.icon />
            {item.label}
          </Link>
        ))}

        <p className="admin-nav-group-label">العمليات</p>
        {opsNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={isActive(item.href) ? "active" : ""}
          >
            <item.icon />
            {item.label}
            {item.href === "/admin/quotes" && unreadQuotes > 0 && (
              <span className="admin-nav-badge">{unreadQuotes}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-avatar">{initials || "أد"}</div>
        <div>
          <b>{userName}</b>
          <span>{userEmail}</span>
        </div>
        <form action={logoutAction}>
          <button
            className="admin-logout"
            type="submit"
            title="تسجيل الخروج"
            aria-label="تسجيل الخروج"
          >
            <IconLogout />
          </button>
        </form>
      </div>
    </aside>
  );
}
