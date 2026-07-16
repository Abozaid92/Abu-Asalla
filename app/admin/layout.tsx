import "./admin.css";

// ملاحظة أداء: ملف admin.css ده بيتحمّل بس لصفحات /admin/* (Next.js بيقسّم
// الـ CSS تلقائيًا حسب الـ route segment)، فزوار الموقع العام لا يحمّلونه
// أبدًا ولا يؤثر على LCP/INP بتاع الصفحات العامة.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-shell">{children}</div>;
}
