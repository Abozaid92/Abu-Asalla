import Image from "next/image";
import Link from "next/link";
import { Shell } from "@/components/site-shell";
import { Reveal } from "@/components/reveal";
import { getActiveServices } from "@/lib/data/services";

export const revalidate = 86400;
export const metadata = { title: "خدمات الدهانات والديكور | أبو أصاله" };

export default async function ServicesPage() {
  const services = await getActiveServices();
  return (
    <Shell>
      <section className="relative mx-auto w-[min(1180px,calc(100%-48px))] overflow-hidden pt-[105px] pb-[70px] max-[760px]:pt-[65px] max-[760px]:pb-[45px]">
        <Reveal>
          <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">
            خدماتنا
          </p>
          <h1 className="m-0 text-[clamp(39px,5vw,68px)] leading-[1.2] tracking-[-2px]">
            حلول دهان وديكور
            <br />
            تفهم مساحة بيتك.
          </h1>
          <p className="max-w-[600px] text-[17px] text-[var(--text-2)]">
            ننفذ تشطيبات مدروسة تجمع جودة التنفيذ، ونظافة التفاصيل، والهوية التي
            تريدها للمكان.
          </p>
        </Reveal>
      </section>
      <section className="mx-auto grid w-[min(1180px,calc(100%-48px))] gap-[18px] pb-[110px]">
        {services.map((s, i) => (
          <Reveal key={s.slug} className={`reveal-${Math.min(i + 1, 6)}`}>
            <Link
              href={`/خدمات/${s.slug}`}
              className="group grid min-h-[300px] grid-cols-[1.15fr_0.85fr] overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--surface)] text-inherit no-underline transition-[0.3s] hover:-translate-y-1 hover:shadow-[var(--shadow)] max-[760px]:grid-cols-1"
            >
              <div className="p-[47px] max-[760px]:p-7">
                <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">
                  خدمة أبو أصاله
                </p>
                <h2 className="m-0 text-[31px]">{s.name}</h2>
                <p className="max-w-[430px] text-[var(--text-2)]">
                  {s.shortDescription}
                </p>
                <span className="mt-3 inline-block border-b border-[var(--accent-warm)] pb-[5px] text-sm font-semibold text-[var(--text-1)] no-underline">
                  اكتشف الخدمة ←
                </span>
              </div>
              <div className="overflow-hidden max-[760px]:order-first max-[760px]:h-[240px]">
                <Image
                  className="h-full w-full object-cover"
                  src={s.heroImage}
                  alt={s.name}
                  width={500}
                  height={350}
                />
              </div>
            </Link>
          </Reveal>
        ))}
      </section>
    </Shell>
  );
}
