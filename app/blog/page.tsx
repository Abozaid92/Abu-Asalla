import Link from "next/link";
import { Shell } from "@/components/site-shell";
import { getPublishedPosts } from "@/lib/data/blog";

export const revalidate = 86400;
export const metadata = { title: "مدونة الدهان والديكور | أبو أصاله" };

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <Shell>
      <section className="relative mx-auto w-[min(1180px,calc(100%-48px))] overflow-hidden pt-[105px] pb-[70px] max-[760px]:pt-[65px] max-[760px]:pb-[45px]">
        <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">المدونة</p>
        <h1 className="m-0 text-[clamp(39px,5vw,68px)] leading-[1.2] tracking-[-2px]">
          أفكار تساعدك
          <br />
          قبل التنفيذ.
        </h1>
        <p className="max-w-[600px] text-[17px] text-[var(--text-2)]">
          نصائح عملية عن الألوان والخامات وتفاصيل الديكور الداخلي.
        </p>
      </section>
      <section className="mx-auto grid w-[min(1180px,calc(100%-48px))] grid-cols-3 gap-[18px] pb-[115px] max-[760px]:grid-cols-1">
        {posts.length === 0 && (
          <p className="mx-auto w-[min(1180px,calc(100%-48px))]">لا توجد مقالات منشورة حاليًا.</p>
        )}
        {posts.map((p, i) => (
          <Link
            href={`/المدونة/${p.slug}`}
            className="flex min-h-[310px] flex-col rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-7 text-inherit no-underline transition-[0.3s] hover:-translate-y-1 hover:shadow-[var(--shadow)]"
            key={p.slug}
          >
            <span className="text-xs text-[var(--accent-warm)]">0{i + 1}</span>
            <h2 className="my-[35px] mb-[10px] text-2xl leading-[1.4]">{p.title}</h2>
            <p className="m-0 text-sm text-[var(--text-2)]">{p.excerpt}</p>
            <b className="mt-auto text-[13px] text-[var(--accent-warm)]">اقرأ المقال ←</b>
          </Link>
        ))}
      </section>
    </Shell>
  );
}
