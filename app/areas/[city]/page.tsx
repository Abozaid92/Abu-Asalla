import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/site-shell";
import { getAreaBySlug, getAreaSlugs } from "@/lib/data/areas";
import { getActiveServices } from "@/lib/data/services";

export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await getAreaSlugs();
  return slugs.map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const area = await getAreaBySlug((await params).city);
  if (!area) return {};
  return { title: area.metaTitle, description: area.metaDescription };
}

const inlineLink =
  "border border-[var(--border)] px-4 py-[10px] rounded-full text-[var(--text-2)] no-underline text-sm transition-[0.2s] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)]";

export default async function AreaPage({ params }: { params: Promise<{ city: string }> }) {
  const city = (await params).city;
  const [area, services] = await Promise.all([getAreaBySlug(city), getActiveServices()]);
  if (!area) notFound();

  return (
    <Shell>
      <article className="mx-auto w-[min(1180px,calc(100%-48px))] py-[85px] pb-[120px]">
        <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">تغطية الرياض</p>
        <h1 className="m-0 text-[clamp(39px,5vw,68px)] leading-[1.2] tracking-[-2px]">دهانات وديكورات {area.name} الرياض</h1>
        <div className="mb-[45px] columns-2 gap-x-[45px] text-base text-[var(--text-2)] max-[760px]:columns-1">
          {area.content.split("\n").filter(Boolean).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {area.projects.length > 0 && (
          <>
            <h2 className="m-0 mb-[19px] text-[34px] leading-[1.3]">أعمال منفذة في {area.name}</h2>
            <div className="mt-[33px] flex flex-wrap gap-3">
              {area.projects.map((p) => (
                <Link className={inlineLink} key={p.slug} href={`/اعمالنا/${p.slug}`}>
                  {p.title} ←
                </Link>
              ))}
            </div>
          </>
        )}

        <h2 className="m-0 mb-[19px] text-[34px] leading-[1.3]">خدماتنا في {area.name}</h2>
        <div className="mt-[33px] flex flex-wrap gap-3">
          {services.slice(0, 4).map((s) => (
            <Link className={inlineLink} key={s.slug} href={`/خدمات/${s.slug}`}>
              {s.name} ←
            </Link>
          ))}
        </div>

        <Link
          className="relative mt-10 inline-flex items-center justify-center gap-5 overflow-hidden rounded-full bg-[var(--accent)] px-6 py-[15px] text-sm font-semibold text-white no-underline transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(23,22,28,0.22)]"
          href="/اتصل-بنا"
        >
          اطلب عرض سعر <span className="text-[19px] leading-none">←</span>
        </Link>
      </article>
    </Shell>
  );
}
