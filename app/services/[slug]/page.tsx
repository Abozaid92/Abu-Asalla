import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QuoteForm } from "@/components/quote-form";
import { Shell } from "@/components/site-shell";
import { ContentBlocks } from "@/components/content-blocks";
import { parseContentBlocks } from "@/lib/content-blocks";
import { canonical } from "@/lib/slug";
import {
  getServiceBySlug,
  getServiceSlugs,
  getActiveServices,
} from "@/lib/data/services";
import { getGeneralFaqs } from "@/lib/data/faqs";

export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const service = await getServiceBySlug((await params).slug);
  if (!service) return {};
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: canonical(`/خدمات/${service.slug}`) },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const [service, allServices, generalFaqs] = await Promise.all([
    getServiceBySlug(slug),
    getActiveServices(),
    getGeneralFaqs(),
  ]);
  if (!service) notFound();
  console.log(service);
  const blocks = parseContentBlocks(service.contentBlocks as any);

  // لو الخدمة لسه من غير contentBlocks (مايجريتش لسه)، منرجعش صفحة فاضية —
  // بنرجع لعرض بسيط من content القديم كـ fallback بدل ما نكسر الصفحة.
  const legacyParagraphs =
    blocks.length === 0 ? service.content.split("\n").filter(Boolean) : [];

  // FAQ الموجودة جوه contentBlocks بتغني عن faqs الجدول القديم، لكن لو مفيش
  // بلوك faq في contentBlocks، نرجع لأسئلة عامة زي قبل.
  const hasFaqBlock = blocks.some((b) => b.type === "faq");
  const legacyFaqLd =
    !hasFaqBlock &&
    (service.faqs.length > 0 ?
      service.faqs.map((f) => [f.question, f.answer] as const)
    : generalFaqs.slice(0, 3).map((f) => [f.question, f.answer] as const));

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.metaDescription,
    areaServed: "الرياض",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: "أبو أصاله للدهانات والديكور",
    },
  };

  const faqLd =
    legacyFaqLd && legacyFaqLd.length > 0 ?
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: legacyFaqLd.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      }
    : null;

  return (
    <Shell>
      <article>
        {/* ============ Hero ============ */}
        <section className="relative overflow-hidden bg-[#FAF7F0]">
          <div className="mx-auto grid w-[min(1180px,calc(100%-48px))] grid-cols-2 items-center gap-[60px] py-20 max-[760px]:grid-cols-1 max-[760px]:gap-[27px] max-[760px]:py-[55px]">
            <div>
              <p className="mb-[17px] text-xs font-bold tracking-[0.08em] text-[#B9812F]">
                خدمات أبو أصاله · الرياض
              </p>
              <div className="mb-[18px] text-xs text-[#8A8074]">
                <Link
                  className="text-[#4A4234] no-underline hover:text-[#B9812F]"
                  href="/"
                >
                  الرئيسية
                </Link>{" "}
                /{" "}
                <Link
                  className="text-[#4A4234] no-underline hover:text-[#B9812F]"
                  href="/خدمات"
                >
                  الخدمات
                </Link>{" "}
                / {service.name}
              </div>
              <h1 className="m-0 font-[family-name:var(--font-display-ar)] text-[clamp(39px,5vw,68px)] leading-[1.2] tracking-[-1px] text-[#2A241C]">
                {service.name} في الرياض
              </h1>
              <p className="max-w-[530px] text-[17px] leading-[1.9] text-[#6B6252]">
                {service.shortDescription}
              </p>
              <Link
                className="relative mt-6 inline-flex items-center justify-center gap-5 overflow-hidden rounded-full bg-[#B9812F] px-6 py-[15px] text-sm font-bold text-white no-underline transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(185,129,47,0.35)]"
                href="#quote"
              >
                اطلب عرض سعر <span className="text-[19px] leading-none">←</span>
              </Link>
            </div>
            <Image
              className="h-[460px] w-full rounded-[10px] object-cover shadow-[0_20px_50px_rgba(42,36,28,0.15)] max-[760px]:h-[300px]"
              src={service.heroImage}
              alt={service.name}
              width={720}
              height={560}
              priority
            />
          </div>
        </section>
        {/* ============ Content blocks (الجديد) ============ */}
        {blocks.length > 0 ?
          <ContentBlocks blocks={blocks} />
        : <section className="mx-auto w-[min(720px,calc(100%-48px))] bg-[#FAF7F0] py-16">
            <div className="grid gap-6">
              {legacyParagraphs.map((p, i) => (
                <p key={i} className="text-[16px] leading-[2.1] text-[#4A4234]">
                  {p}
                </p>
              ))}
            </div>
          </section>
        }

        {/* ============ Gallery ============ */}

        {/* ============ Quote CTA ============ */}
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceLd).replace(/</g, "\\u003c"),
        }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </Shell>
  );
}
