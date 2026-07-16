import { NextResponse } from "next/server";
import { auth } from "@/auth";

// خريطة الفولدر العربي (زي ما الزائر شايفه في الرابط) → اسم الفولدر
// الإنجليزي الحقيقي جوه app/. بنفك تشفير الرابط بنفسنا مرة واحدة بس هنا،
// عشان نتجنب مشكلة التشفير المزدوج اللي كانت بتحصل مع rewrites في
// next.config.mjs مع الروابط الديناميكية ([slug]/[city]).
const routeMap: Record<string, string> = {
  "اتصل-بنا": "contact",
  "الشروط-والأحكام": "terms",
  "الأسئلة-الشائعة": "faq",
  "المدونة": "blog",
  "خدمات": "services",
  "من-نحن": "about",
  "اعمالنا": "projects",
  "مناطق": "areas",
  "سياسة-الخصوصية": "privacy",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // --- حماية لوحة الأدمن (زي ما كانت بالظبط) ---
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // --- تحويل الروابط العربية لفولدرات إنجليزي ---
  // decodeURIComponent هنا بيفك التشفير مرة واحدة بس بشكل صريح، فبنشتغل
  // بنص عربي عادي، وبعدين url.pathname = ... بيعيد التشفير بشكل صحيح
  // تلقائي وبمرة واحدة فقط (اتأكد منها بالاختبار).
  const decodedPath = decodeURIComponent(pathname);
  const segments = decodedPath.split("/").filter(Boolean);

  if (segments.length > 0 && routeMap[segments[0]]) {
    segments[0] = routeMap[segments[0]];
    const url = req.nextUrl.clone();
    url.pathname = "/" + segments.join("/");
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
