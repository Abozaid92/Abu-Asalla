import Image from "next/image";
import Link from "next/link";
import { QuoteForm } from "@/components/quote-form";
import { Shell } from "@/components/site-shell";
import { Reveal } from "@/components/reveal";
import { BeforeAfterCarousel } from "@/components/before-after-carousel";
import { getActiveServices } from "@/lib/data/services";
import {
  getFeaturedProjects,
  getBeforeAfterProjects,
  projectTypeLabels,
} from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/settings";
import { getPublishedTestimonials } from "@/lib/data/testimonials";
import { getGeneralFaqs } from "@/lib/data/faqs";

export const revalidate = 86400;

const DEMO_BEFORE =
  "https://res.cloudinary.com/dfhecwiib/image/upload/v1784096419/d96f11ed-aacb-43eb-b5a3-32b54f99306d_azkiog.png";
const DEMO_AFTER =
  "https://res.cloudinary.com/dfhecwiib/image/upload/v1784096536/144a348b-8719-49b8-83cf-cfaa30955e25_ldjiof.png";

export default async function Home() {
  const [
    services,
    projects,
    beforeAfterProjects,
    settings,
    testimonials,
    faqs,
  ] = await Promise.all([
    getActiveServices(),
    getFeaturedProjects(8),
    getBeforeAfterProjects(4),
    getSiteSettings(),
    getPublishedTestimonials(6),
    getGeneralFaqs(),
  ]);

  const heroProject = projects[0];
  const baItems =
    beforeAfterProjects.length > 0 ?
      beforeAfterProjects.map((p) => ({
        key: p.slug,
        before: p.beforeImage as string,
        after: p.afterImage as string,
        title: p.title,
        meta: `${projectTypeLabels[p.projectType]} · الرياض`,
      }))
    : [
        {
          key: "demo",
          before: DEMO_BEFORE,
          after: DEMO_AFTER,
          title: "نموذج تنفيذ",
          meta: "دهانات داخلية",
        },
      ];

  const heading =
    "text-[clamp(38px,5.2vw,72px)] leading-[1.22] tracking-[-2.8px] m-0 font-semibold";

  return (
    <Shell>
      <main>
        <section className="relative mt-5 h-[min(720px,calc(100vh-130px))] min-h-[560px] overflow-hidden rounded-[var(--radius)] text-white max-[760px]:h-[650px] max-[760px]:min-h-0">
          <div className="absolute inset-0 h-full w-full">
            {heroProject && (
              <Image
                src={
                  "https://res.cloudinary.com/dfhecwiib/image/upload/v1784187173/5656abf8-35e0-4655-bc4e-eddf646c3f06_ojsuvb.png"
                }
                alt={heroProject.title}
                fill
                priority
                sizes="100vw"
                className="object-cover [filter:grayscale(0.18)]"
              />
            )}
          </div>
          <div className="absolute inset-0 h-full w-full bg-[linear-gradient(90deg,rgba(18,17,15,0.76),rgba(18,17,15,0.18)_75%),linear-gradient(0deg,rgba(0,0,0,0.22),transparent_45%)]" />
          <div className="relative z-[1] mx-auto w-[min(1180px,calc(100%-48px))] pt-[clamp(115px,18vh,190px)] max-[760px]:pt-[120px]">
            <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[#d5b188]">
              دهانات وديكورات · الرياض
            </p>
            <h1 className={`${heading} max-[760px]:tracking-[-2px]`}>
              المساحة التي تتخيلها
              <br />
              ننفذها كما تستحق.
            </h1>
            <p className="my-[23px] mb-[35px] max-w-[480px] text-[17px] text-[#f1eee9]">
              من أول طبقة دهان إلى أدق تفصيلة ديكور، نصنع للمكان شخصية تليق به.
            </p>
            <div className="flex items-center gap-[27px]">
              <Link
                className="relative inline-flex items-center justify-center gap-5 overflow-hidden rounded-full bg-white px-6 py-[15px] text-sm font-semibold text-[var(--accent)] no-underline transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(23,22,28,0.22)]"
                href="#quote"
              >
                اطلب عرض سعر{" "}
                <span className="relative text-[19px] leading-none">←</span>
              </Link>
              <Link
                className="border-b border-[#caaa83] pb-[5px] text-sm font-semibold text-white no-underline"
                href="/اعمالنا"
              >
                شاهد أعمالنا <span>↙</span>
              </Link>
            </div>
          </div>
          <div className="absolute bottom-[35px] left-[28px] z-[1] flex items-center gap-5 text-xs max-[760px]:bottom-[22px] max-[760px]:left-4 max-[760px]:block">
            <b>تنفيذ في الرياض</b>
            <span className="text-[#eee]">مواعيد واضحة · تشطيب نظيف</span>
          </div>
          <div className="absolute top-[34px] left-[28px] z-[2] flex items-center gap-3 rounded-full bg-white/92 py-3 pr-[18px] pl-3 text-[var(--text-1)] shadow-[var(--shadow)] backdrop-blur-[8px] [animation:float-in_0.8s_0.5s_cubic-bezier(0.2,0.8,0.2,1)_both,floaty_4.5s_1.4s_ease-in-out_infinite] max-[760px]:hidden">
            <span className="grid h-[30px] w-[30px] flex-none place-items-center rounded-full bg-[image:var(--gold-gradient)] text-[13px] font-bold text-[#1c1a17]">
              ✓
            </span>
            <div>
              <b className="block text-[13px]"> </b>
              <small className="text-[11px] text-[var(--text-3)]">
                متابعة بعد التسليم
              </small>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-7 grid w-[min(1180px,calc(100%-48px))] grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3.5 border-b-0 p-0 max-[760px]:w-[min(calc(100%-32px),1180px)]">
          {settings.yearsExperience && (
            <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-6 py-[26px] transition-[transform,box-shadow] duration-[250ms] ease hover:-translate-y-[3px] hover:shadow-[var(--shadow)]">
              <strong className="block text-[22px] text-[var(--accent-warm)]">
                +{settings.yearsExperience}
              </strong>
              <span className="mt-1 block text-[12.5px] text-[var(--text-3)]">
                سنوات خبرة
              </span>
            </div>
          )}
          {settings.projectsCount && (
            <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-6 py-[26px] transition-[transform,box-shadow] duration-[250ms] ease hover:-translate-y-[3px] hover:shadow-[var(--shadow)]">
              <strong className="block text-[22px] text-[var(--accent-warm)]">
                +{settings.projectsCount}
              </strong>
              <span className="mt-1 block text-[12.5px] text-[var(--text-3)]">
                مشروع منفذ
              </span>
            </div>
          )}
          <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-6 py-[26px] transition-[transform,box-shadow] duration-[250ms] ease hover:-translate-y-[3px] hover:shadow-[var(--shadow)]">
            <strong className="block text-[22px] text-[var(--accent-warm)]">
              حلول متكاملة
            </strong>
            <span className="mt-1 block text-[12.5px] text-[var(--text-3)]">
              دهانات وديكور للمساحات السكنية
            </span>
          </div>
          <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-6 py-[26px] transition-[transform,box-shadow] duration-[250ms] ease hover:-translate-y-[3px] hover:shadow-[var(--shadow)]">
            <strong className="block text-[22px] text-[var(--accent-warm)]">
              معاينة وطلب سعر
            </strong>
            <span className="mt-1 block text-[12.5px] text-[var(--text-3)]">
              بحسب احتياجات ومساحة مشروعك
            </span>
          </div>
          <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-6 py-[26px] transition-[transform,box-shadow] duration-[250ms] ease hover:-translate-y-[3px] hover:shadow-[var(--shadow)]">
            <strong className="block text-[22px] text-[var(--accent-warm)]">
              تواصل مباشر
            </strong>
            <span className="mt-1 block text-[12.5px] text-[var(--text-3)]">
              بدون وسيط وبرد سريع على واتساب
            </span>
          </div>
        </section>

        <section className="mx-auto w-[min(1180px,calc(100%-48px))] py-[120px] max-[760px]:py-[70px]">
          <Reveal className="mb-14 flex items-end justify-between gap-10 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-4">
            <div>
              <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">
                ما الذي نقدمه
              </p>
              <h2 className={heading}>
                تفاصيل تجعل المكان
                <br />
                أقرب لذوقك.
              </h2>
            </div>
            <p className="m-0 max-w-[330px] text-[15px] text-[var(--text-2)]">
              خدمات مدروسة للمنازل والفلل والمساحات التي تريد لها حضورًا
              مختلفًا.
            </p>
          </Reveal>
          <div className="grid grid-cols-3 gap-[22px] max-[760px]:grid-cols-1">
            {services.map((s, i) => (
              <Reveal key={s.slug} className={`reveal-${Math.min(i + 1, 6)}`}>
                <Link
                  className="group flex flex-col overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-inherit no-underline transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-[6px] hover:shadow-[var(--shadow-lg)]"
                  href={`/خدمات/${s.slug}`}
                >
                  {s.heroImage && (
                    <span className="relative aspect-[4/3] w-full overflow-hidden">
                      <span className="absolute top-[14px] right-[14px] z-[1] rounded-full bg-[rgba(20,18,15,0.55)] px-3 py-[5px] text-xs font-bold text-white backdrop-blur-[6px]">
                        0{i + 1}
                      </span>
                      <Image
                        src={s.heroImage}
                        alt={s.name}
                        fill
                        sizes="(max-width:760px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.08]"
                      />
                    </span>
                  )}
                  <span className="flex flex-1 flex-col px-[22px] pt-[22px] pb-6">
                    <h3 className="mt-0 mb-2 text-[19px] transition-colors duration-250 ease group-hover:text-[var(--accent-warm)]">
                      {s.name}
                    </h3>
                    <p className="mt-0 mb-4 flex-1 text-[13.5px] text-[var(--text-2)]">
                      {s.shortDescription}
                    </p>
                    <span className="inline-flex items-center gap-1.5 self-start text-[13px] font-bold text-[var(--accent-warm)] after:content-['←'] after:transition-transform after:duration-300 after:ease group-hover:after:-translate-x-[5px]">
                      اكتشف الخدمة
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
        <section className="bg-[var(--bg-deep)] py-[120px] max-[760px]:py-[70px]">
          <div className="mx-auto w-[min(1180px,calc(100%-48px))]">
            <Reveal className="mb-14 flex items-end justify-between gap-10 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-4">
              <div>
                <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">
                  الفرق واضح
                </p>
                <h2 className={heading}>
                  قبل
                  <br />
                  وبعد.
                </h2>
              </div>
              <p className="m-0 max-w-[330px] text-[15px] text-[var(--text-2)]">
                حرّك المؤشر لترى الفرق بنفسك — نفس المساحة، قبل التنفيذ وبعده.
              </p>
            </Reveal>
          </div>
          <div className="bleed mx-0 w-screen ms-[calc(50%-50vw)] px-0">
            <BeforeAfterCarousel items={baItems} />
          </div>
        </section>

        <section className="bg-[var(--bg-deep)] py-[120px] max-[760px]:py-[70px]">
          <div className="mx-auto w-[min(1180px,calc(100%-48px))]">
            <Reveal className="mb-14 flex items-end justify-between gap-10 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-4">
              <div>
                <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">
                  مختارات من التنفيذ
                </p>
                <h2 className={heading}>
                  أعمال تتكلم
                  <br />
                  عن نفسها.
                </h2>
              </div>
              <Link
                className="border-b border-[var(--accent-warm)] pb-[5px] text-sm font-semibold text-[var(--text-1)] no-underline"
                href="/اعمالنا"
              >
                عرض كل الأعمال ↙
              </Link>
            </Reveal>
            <div className="grid grid-cols-[1.12fr_0.88fr_0.88fr] grid-rows-[260px_260px] gap-3.5 max-[760px]:grid-cols-1 max-[760px]:grid-rows-none">
              {projects.map((p, i) => (
                <Link
                  className={`group relative overflow-hidden rounded-[var(--radius-sm)] bg-[#222] h-[260px] max-[760px]:h-[220px] max-[760px]:row-span-1 ${i === 0 ? "row-span-2" : ""}`}
                  href={`/اعمالنا/${p.slug}`}
                  key={p.slug}
                >
                  <Image
                    src={p.gallery[0] ?? p.afterImage ?? p.beforeImage ?? ""}
                    alt={p.title}
                    fill
                    sizes="(max-width:760px) 50vw, 35vw"
                    className="h-full w-full object-cover transition-transform duration-[550ms] ease group-hover:scale-[1.04] group-hover:opacity-[0.82]"
                  />
                  <div className="absolute inset-x-0 top-auto bottom-0 bg-[linear-gradient(transparent,rgba(0,0,0,0.75))] px-[23px] pt-11 pb-5 text-white">
                    <p className="m-0 text-[11px] text-[#ded9d2]">
                      الرياض · {projectTypeLabels[p.projectType]} · تنفيذ أبو
                      أصاله
                    </p>
                    <h3 className="mt-[3px] mb-0 text-[18px]">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {testimonials.length > 0 && (
          <section className="bg-[var(--bg-deep)] py-[120px] max-[760px]:py-[70px]">
            <div className="mx-auto w-[min(1180px,calc(100%-48px))]">
              <Reveal className="mb-14 flex items-end justify-between gap-10 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-4">
                <div>
                  <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">
                    ماذا يقول عملاؤنا
                  </p>
                  <h2 className={heading}>
                    ثقة تُبنى
                    <br />
                    بالتنفيذ.
                  </h2>
                </div>
              </Reveal>
              <div className="grid grid-cols-3 gap-[18px] max-[760px]:grid-cols-1">
                {testimonials.map((t, i) => (
                  <Reveal key={t.id} className={`reveal-${Math.min(i + 1, 6)}`}>
                    <div className="rounded-[var(--radius-sm)] bg-[var(--surface)] p-7 shadow-[0_6px_18px_rgba(20,18,15,0.05)]">
                      <div className="mb-3.5 text-sm tracking-[3px] text-[var(--accent-warm)]">
                        {"★".repeat(t.rating)}
                      </div>
                      <p className="mt-0 mb-[22px] text-[14.5px] leading-[1.9] text-[var(--text-2)]">
                        {t.content}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="grid h-[42px] w-[42px] flex-none place-items-center rounded-full bg-[image:var(--gold-gradient)] font-bold text-[#1c1a17]">
                          {t.authorName.trim().charAt(0)}
                        </span>
                        <div>
                          <b className="block text-sm">{t.authorName}</b>
                          {t.authorArea && (
                            <small className="text-xs text-[var(--text-3)]">
                              {t.authorArea}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {faqs.length > 0 && (
          <section className="mx-auto w-[min(1180px,calc(100%-48px))] py-[120px] max-[760px]:py-[70px]">
            <Reveal className="mb-14 flex items-end justify-between gap-10 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-4">
              <div>
                <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">
                  أسئلة شائعة
                </p>
                <h2 className={heading}>
                  عندك استفسار؟
                  <br />
                  غالبًا جاوبنا عليه.
                </h2>
              </div>
            </Reveal>
            <div className="mx-auto flex max-w-[780px] flex-col gap-3">
              {faqs.map((f) => (
                <details
                  className="group overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)]"
                  key={f.id}
                >
                  <summary className="flex list-none cursor-pointer items-center justify-between gap-4 px-6 py-5 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                    {f.question}
                    <i className="flex-none text-[var(--accent-warm)] not-italic transition-transform duration-250 ease group-open:rotate-45">
                      +
                    </i>
                  </summary>
                  <p className="m-0 px-6 pb-[22px] text-sm leading-[1.9] text-[var(--text-2)]">
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        <section
          id="quote"
          className="bg-[var(--accent)] py-[105px] text-white max-[760px]:py-[60px]"
        >
          <div className="mx-auto grid w-[min(1180px,calc(100%-48px))] grid-cols-[0.9fr_1.1fr] gap-[100px] max-[760px]:grid-cols-1 max-[760px]:gap-10">
            <div>
              <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[#d5b188]">
                خطوتك الأولى
              </p>
              <h2 className="m-0 text-[clamp(37px,4.4vw,61px)] font-semibold leading-[1.22] tracking-[-2.8px]">
                خلّنا نتحدث عن
                <br />
                مساحتك.
              </h2>
              <p className="max-w-[370px] text-[#d0cfca]">
                أرسل تفاصيل بسيطة عن مشروعك، وسنتواصل معك لتجهيز عرض مناسب.
              </p>
              <div className="mt-[45px]">
                <span className="block text-xs text-[#aaa]">واتساب</span>
                <a
                  className="block w-max text-right text-[19px] text-white no-underline [direction:ltr]"
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`}
                >
                  {settings.whatsappNumber}
                </a>
              </div>
            </div>
            <QuoteForm services={services} />
          </div>
        </section>
      </main>
    </Shell>
  );
}
