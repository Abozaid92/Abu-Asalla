# PROGRESS.md — سجل استكمال مشروع أبو أصالة للدهانات والديكور

> ده الملف اللي بيتحدث أول ما أخلص كل خطوة. لو التوكن خلص فجأة، افتح الملف ده
> الأول قبل أي حاجة عشان تعرف آخر نقطة اتوقفنا عندها بالظبط، وابعته لأي
> موديل/Agent جديد هيكمل بدل ما يعيد اكتشاف نفس المشاكل من الصفر.

## الحالة العامة
تدقيق كامل اتعمل على المشروع (الملف المضغوط + الملفات المنفصلة). النتيجة:
الـ schema والـ seed routes و quote-request API شغالين فعلًا. باقي الموقع
(الصفحات العامة + الأدمن) كانت hardcoded/stub بالكامل. جاري الإصلاح الآن.

## الترتيب المتفق عليه
1. طبقة البيانات (lib/data/*.ts عبر unstable_cache) + ربط الصفحات العامة بيها
2. تصحيح باغات الـ API الموجودة (revalidateTag + validation) + rate limit
3. لوحة الأدمن الحقيقية (CRUD forms)

## سجل الخطوات

### [تم] الخطوة 1: طبقة البيانات
- [x] `lib/data/services.ts` / `projects.ts` / `areas.ts` / `blog.ts` / `faqs.ts` / `settings.ts` (عبر unstable_cache + tags متطابقة مع الـ API)
- [x] ربط كل الصفحات العامة: الرئيسية، خدمات، اعمالنا، مناطق، المدونة، أسئلة شائعة، اتصل بنا، من نحن
- [x] `sitemap.ts` و`robots.ts` بقوا ديناميكيين من الـ DB
- [x] حذف `lib/site-data.ts` نهائيًا (baseUrl اتنقل لـ `lib/constants.ts`)
- [x] `site-shell.tsx` و`quote-form.tsx` بقوا بياخدوا البيانات من الـ DB

### [تم] الخطوة 2: إصلاح باغات API
- [x] تصحيح `revalidateTag(tag, "max")` → `revalidateTag(tag)`
- [x] Zod `.partial()` validation على PATCH في `[resource]/[id]/route.ts`
- [x] rate limiting in-memory على `/api/quote-request` (محدوديته موثقة في الكود)
- [x] **باغ أمان أخطر اتكتشف واتصلح**: `authorized` callback كان متحط غلط جوه
  middleware `config` (Next.js بيتجاهله، بيقرأ matcher بس) — يعني `/admin/*`
  مكانش فعليًا محمي بإعادة توجيه. اتنقل لجوه `NextAuth()` في `auth.ts`.
- [x] `/admin/login` بقت فورم حقيقي بـ Server Action (كانت شكل فاضي بدون submit)

### [تم] الخطوة 3: لوحة الأدمن الحقيقية
- [x] مكوّن عام `components/admin/resource-manager.tsx` (جدول + فورم create/edit/delete حقيقي، بيكلم الـ API الموجود فعليًا)
- [x] كونفيجات الحقول لكل مورد في `lib/admin/configs.tsx`: الأقسام، الخدمات، المشاريع، المناطق، الأسئلة الشائعة، الشهادات
- [x] `components/admin/quotes-manager.tsx` — عرض الطلبات + تغيير الحالة فقط (مفيش create/delete، ده مطلوب مقصود)
- [x] `components/admin/settings-manager.tsx` — فورم واحد لـ Singleton الإعدادات
- [x] `app/admin/[...section]/page.tsx` بقى بيوجّه فعليًا لكل مكوّن بدل placeholder فاضي
- [ ] المدونة (Tiptap) — **لسه مؤجلة عمدًا**، فيها رسالة توضيحية بدل الفورم. محتاجة مسار API مخصص يحوّل محتوى المحرر لـ HTML منقّى (زي `sanitize-html` في مشروع موطن الريف) قبل الحفظ في `contentHtml`. المستخدم قال هيكتب المقالات بنفسه فمش أولوية دلوقتي.

## ملاحظات تنفيذ مهمة (اتعملت في الخطوة 3)
- حقول الصور (gallery) في فورم الخدمات/المشاريع دلوقتي "روابط مفصولة بفاصلة"
  مش رافع صور حقيقي — لأن `CLOUDINARY_*` مش موجودة في `.env` الفعلي. لما
  تحطهم، ينفع نبني widget رفع حقيقي بدل الحقل النصي ده.
- حقل `steps` (Json) بتاع الخدمة **مش موجود في فورم الأدمن العام** لأنه معقد
  على الفورم الجيneric (array of {title, description}) — أي تعديل عليه دلوقتي
  لازم يتم مباشرة في قاعدة البيانات أو Prisma Studio لحد ما نبني محرر مخصص ليه.
- أضفت `quotes` schema في `_shared.ts` (status بس) — كانت ناقصة تمامًا قبل كده
  فكان تغيير حالة الطلب مستحيل عبر الـ API الموجود.

## تحقق فني اتعمل
- `npm install` نجح (141 حزمة).
- **باغ تاني اتكتشف من ريبورت المستخدم بعد التسليم**: `package.json` كان حاطط
  `"next-auth": "latest"` — ده بيسحب v4.24.14 (لأن v5/Auth.js لسه بيتا مش
  عليها تاج `latest` في npm)، لكن كل كود المشروع (`auth.ts`, `middleware.ts`,
  `AuthError` في صفحة اللوجين) متبني على v5 API. ده كان هيكسر الـ build فورًا
  (`no exported member 'PrismaClient'/'AuthError'`). اتصلح بتثبيت الإصدار
  صراحة: `"next-auth": "5.0.0-beta.31"`.
- `npx prisma generate` **فشل في بيئة العمل دي بس** لأن تحميل الـ engine
  محتاج نطاق `binaries.prisma.sh` مش متاح في الشبكة المسموحة هنا. **لازم
  تشغّلها من عندك** (`npx prisma generate` ثم `npx prisma migrate dev`) قبل
  أي build فعلي — التحقق النهائي من الأنواع (`next build` / `tsc`) لازم يتم
  عندك بعد كده لأنه يعتمد على الـ Prisma Client المولّد.

## آخر حاجة لازم تعملها قبل production فعليًا
1. `npx prisma generate && npx prisma migrate dev` (يحتاج DATABASE_URL شغال)
2. `npm run db:seed` (بعد ما تحط ADMIN_SEED_EMAIL/PASSWORD في `.env`)
3. شغّل `seed-services` و`seed-projects` مرة واحدة (بعد ما تحط SEED_SECRET)، وبعدين احذفهم أو امسح SEED_SECRET
4. `npm run build` وشوف لو فيه type errors ظهرت (محتمل تظهر حاجات بسيطة محتاجة تعديل، خصوصًا في enum imports من `@prisma/client`)
5. غيّر `DATABASE_URL` و`NEXTAUTH_SECRET` في `.env` (كانوا في الشات ده)
6. اكتب محتوى حقيقي للخدمات (1600-2400 كلمة) والمناطق (400-600 كلمة) من لوحة الأدمن الجديدة — ده مش كود، ده محتوى بتكتبه انت
7. حط بيانات Cloudinary في `.env` لو عايز رفع صور حقيقي بدل روابط يدوية

### [تم دمجه] ملفات الجذر
كانت مبعوتة منفصلة عن الـ rar: `auth.ts`, `middleware.ts`, `package.json`,
`tsconfig.json`, `next.config.ts`, `.env`, `.env.example`. اتنقلوا للمشروع
الموحّد وأصلح منهم `auth.ts` و`middleware.ts`.

## ملاحظات مهمة لازم تتحل قبل أي نشر فعلي
- ملف `.env` اللي بعته فيه `DATABASE_URL` و`NEXTAUTH_SECRET` حقيقيين — يفضل
  تغيّرهم كإجراء احترازي لأنهم بقوا في الشات.
- `CLOUDINARY_*` مش موجودة في `.env` الفعلي (موجودة بس في `.env.example`) —
  رفع الصور من الأدمن مش هيشتغل لحد ما تتحط.
- `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` / `SEED_SECRET` فاضيين في `.env`
  — لازم تتحط قبل `npm run db:seed` و قبل تشغيل `seed-projects` / `seed-services`.
- التصميم شغال بـ CSS عادي (`globals.css`) مش Tailwind رغم إن REQUIREMENTS.md
  بيحدد Tailwind كـ stack. قرار: سبناه زي ما هو لأنه شغال ومطابق للكلاسات
  المستخدمة في الصفحات، وإعادة كتابته بـ Tailwind دلوقتي تكلفة وقت من غير فايدة
  فعلية. لو عايز تحويله لاحقًا قوللي.
- محتوى الخدمات لسه مش 1600-2400 كلمة زي المطلوب (كان placeholder من
  seed-services.ts: "محتوى مؤقت..."). محتاج يتكتب فعليًا (راجع PROMPT_ARTICLES.md
  لمنهج البحث عن كلمات مفتاحية حقيقية).
- الـ 50 مقالة مدونة (PROMPT_ARTICLES.md) لسه معملتش خالص — 3 مقالات وهمية بس
  كانت hardcoded وهتتشال.
- Prisma migrate لسه ما اتشغلش فعليًا (مفيش اتصال إنترنت لقاعدة بيانات في بيئة
  العمل دي) — لازم تتشغل من عندك: `npx prisma migrate dev` ثم `npm run db:seed`.
