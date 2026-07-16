import { Shell } from "@/components/site-shell";
import { getGeneralFaqs } from "@/lib/data/faqs";

export const revalidate = 86400;
export const metadata = { title: "الأسئلة الشائعة | أبو أصاله" };

export default async function FaqPage() {
  const faqs = await getGeneralFaqs();
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return (
    <Shell>
      <section className="relative mx-auto w-[min(1180px,calc(100%-48px))] overflow-hidden pt-[105px] pb-[70px] max-[760px]:pt-[65px] max-[760px]:pb-[45px]">
        <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">الأسئلة الشائعة</p>
        <h1 className="m-0 text-[clamp(39px,5vw,68px)] leading-[1.2] tracking-[-2px]">
          إجابات واضحة
          <br />
          قبل أن تبدأ.
        </h1>
      </section>
      <section className="mx-auto max-w-[900px] py-20">
        {faqs.map((f) => (
          <details
            key={f.id}
            className="group border-t border-[var(--border)] py-[19px] last:border-b last:border-[var(--border)]"
          >
            <summary className="cursor-pointer list-none font-semibold before:ml-3 before:inline-block before:text-[20px] before:text-[var(--accent-warm)] before:content-['+'] group-open:before:content-['−']">
              {f.question}
            </summary>
            <p className="mx-8 mt-3 text-[var(--text-2)]">{f.answer}</p>
          </details>
        ))}
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
    </Shell>
  );
}
