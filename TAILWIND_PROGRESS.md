# تتبع تحويل CSS -> Tailwind

## تم عمل setup
- @import "tailwindcss" + @theme inline في app/globals.css (يربط ألوان/راديوس/شادو تايلويند بنفس متغيرات المشروع)
- postcss.config.mjs
- tailwindcss + @tailwindcss/postcss متثبتين في package.json

## ملفات خلصت (الكلاسات القديمة بتاعتها لسه في globals.css لحد ما نخلص كله)
- [x] components/site-shell.tsx (footer + whatsapp float) — كلاسات اتحولت: site-footer, footer-top, footer-brand, brand+footer-logo, brand-mark (+override), brand-text, footer-social, footer-col, footer-contact, footer-muted, footer-bottom, footer-legal, whatsapp
  - ملحوظة: .brand-text كان فيه override نهائي `display:none` في آخر الملف (سطر 1183) بيخفيه خالص — اتحول لـ `hidden` بالظبط زي السلوك الحالي.
  - .whatsapp-pulse keyframes سابته في globals.css لأنه animation primitive مش كلاس component (Tailwind بيرجع له بـ animate-[whatsapp-pulse_...])

- [x] components/nav-menu.tsx — كلاسات اتحولت: nav, nav-scrolled, wrap, brand, brand-mark, brand-text, main-nav, nav-item, chevron/up, mega/open, mega-grid, mega-link, mega-all, nav-right, button/button-dark, burger/open, mobile-drawer/open, mobile-drawer-links, mobile-toggle/open, mobile-sub, mobile-overlay
  - استخدمت breakpoint مخصص `max-[760px]:` بدل `md:` الافتراضي لتايلويند عشان الأصل كان @media(max-width:760px) بالظبط

- [x] app/page.tsx (الصفحة الرئيسية) — كل السكاشن اتحولت: hero, trust, showcase (services), portfolio/project-grid, ba-showcase (bleed), testimonials, faq, quote section
  - .bleed اتحولت لتايلويند، بس سابت `.bleed .ba-slider{border-radius:0}` و`.bleed .ba-carousel-bar{padding-inline:...}` في globals.css كـ overrides حقيقية (nested selector عابر بين المكونات) — الكلاسين `ba-slider`/`ba-carousel-bar` فضلوا كـ "hooks" فاضية في الـ JSX عشان الـ nested selector يشتغل
  - .form-error سابته في globals.css لأنه لسه مستخدم في quote-form (error state) وفي admin (quotes-manager, resource-manager, admin login) اللي لسه ما اتحولوش
  - .reveal-in / .reveal-1..6 سابتهم زي ما هم (primitives زي الـ keyframes)
- [x] components/reveal.tsx — مفيهوش كلاسات محتاجة تحويل
- [x] components/before-after-slider.tsx — اتحول كامل
- [x] components/before-after-carousel.tsx — اتحول كامل
- [x] components/quote-form.tsx — اتحول كامل

## ملحوظة عن globals.css
شيلت الكلاسات المحوّلة فوق (hero*, trust, section/section-head, showcase-*, portfolio/project-grid/project, ba-showcase/ba-carousel/ba-slider/ba-img/ba-handle/ba-tag/ba-caption/ba-carousel-nav, testimonials/testimonial-*, faq-list/faq-item, quote/quote-grid/contact-mini + الفورم اللي جواها).
فيه كام سطر "ميت" فضل من الـ shared mobile media query بيرجع لكلاسات اتشالت (زي `.hero{height:650px}` جوه الميديا كويري) — مالهوش تأثير فعلي، هنشيله مع باقي التنظيف الأخير لإن الميديا كويري ده مشترك مع كلاسات لسه مش محولة (.wrap, .nav, .main-nav, .burger, .services-grid, .service).

## ملحوظة: الأدمن مؤجل بطلب من العميل
- طلب العميل إنه ما نكملش صفحات/مكونات الأدمن دلوقتي (مش أولوية حاليًا).
- اتحول بس: app/admin/login/page.tsx و app/admin/[...section]/page.tsx (الـ shell/layout بتاعهم)
- اتحول كمان: components/admin/quotes-manager.tsx (تم قبل طلب الإيقاف، تحويل كامل وسليم)
- لسه على حالها الأصلية (CSS classes زي ما هي): components/admin/settings-manager.tsx، components/admin/resource-manager.tsx
- ملحوظة مهمة: كلاسات زي .admin-resource, .admin-resource-head, .admin-empty-note, .admin-table, .admin-form, .active مفيهاش أي تعريف CSS في globals.css ولا additions.css أصلًا (يعني شكلها الحالي بدون أي تنسيق فعلي) — لو هيتحولوا لاحقًا محتاجين قرار تصميم مش مجرد نقل كلاسات.

## لسه هيتعمل (لو حبيت تكمل لاحقًا)
- [x] كل صفحات app/ العامة اتحولت: services (listing+detail), projects (listing+detail via projects-gallery), blog (listing+detail), contact, faq, areas/[city], about, privacy, terms
- [x] components/projects-gallery.tsx
- [ ] components/admin/* (quotes-manager, resource-manager, settings-manager) + admin login/layout لو موجودة
- [ ] app/layout.tsx (مفيهاش كلاسات فعليًا، بس نتأكد)

## آخر الشغل
- [ ] نمسح كل الكلاسات المحوّلة من app/globals.css و app/additions.css (يفضل بس اللي معمول له override حقيقي زي :root وrare keyframes)
- [ ] نتأكد npm run build شغال تمام
