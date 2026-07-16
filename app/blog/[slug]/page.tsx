import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/site-shell";
import { getPostBySlug, getPostSlugs } from "@/lib/data/blog";

export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await getPostBySlug((await params).slug);
  if (!post) return {};
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: "أبو أصاله للدهانات والديكور" },
  };

  return (
    <Shell>
      <article className="mx-auto w-[min(1180px,calc(100%-48px))] max-w-[820px] py-[90px] pb-[120px]">
        <div className="mb-[18px] text-xs text-[var(--text-3)]">
          <Link className="text-[var(--text-2)] no-underline" href="/">
            الرئيسية
          </Link>{" "}
          /{" "}
          <Link className="text-[var(--text-2)] no-underline" href="/المدونة">
            المدونة
          </Link>
        </div>
        {post.category && (
          <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">
            {post.category.name}
          </p>
        )}
        <h1 className="m-0 text-[clamp(39px,5vw,68px)] leading-[1.2] tracking-[-2px]">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mb-[45px] max-w-[680px] text-[19px] text-[var(--text-2)]">
            {post.excerpt}
          </p>
        )}
        {/*
          contentHtml لازم يتحفظ منقّى (sanitized) وقت الحفظ من لوحة الأدمن
          (زي ما اتعمل في مشروع موطن الريف بـ sanitize-html) قبل ما يترندر هنا
          مباشرة — مفيش تنقية إضافية في وقت العرض.
        */}
        {post.contentHtml ?
          <div
            className="
      [&_p]:mb-[22px] [&_p]:text-[17px] [&_p]:leading-[2] [&_p]:text-[var(--text-2)]

      [&_h2]:mt-[52px] [&_h2]:mb-[20px] [&_h2]:text-[clamp(26px,3vw,34px)]
      [&_h2]:font-bold [&_h2]:leading-[1.3] [&_h2]:tracking-[-0.5px]
      [&_h2]:text-[var(--text-1)]

      [&_h3]:mt-[38px] [&_h3]:mb-[16px] [&_h3]:text-[clamp(21px,2.4vw,26px)]
      [&_h3]:font-bold [&_h3]:leading-[1.4] [&_h3]:text-[var(--text-1)]

      [&_strong]:font-bold [&_strong]:text-[var(--text-1)]

      [&_blockquote]:my-[32px] [&_blockquote]:border-r-4 [&_blockquote]:border-l-0
      [&_blockquote]:border-[var(--gold)] [&_blockquote]:bg-[var(--surface-2)]
      [&_blockquote]:pr-[20px] [&_blockquote]:pl-[8px] [&_blockquote]:py-[14px]
      [&_blockquote]:text-[16px] [&_blockquote]:text-[var(--text-2)]
      [&_blockquote]:rounded-md

      [&_ul]:mb-[22px] [&_ul]:pr-[24px] [&_ul]:list-disc [&_ul]:space-y-[8px]
      [&_ol]:mb-[22px] [&_ol]:pr-[24px] [&_ol]:list-decimal [&_ol]:space-y-[8px]
      [&_li]:text-[17px] [&_li]:leading-[1.9] [&_li]:text-[var(--text-2)]

[&_a]:text-cyan-600 [&_a]:no-underline [&_a]:font-medium
hover:[&_a]:
      [&_img]:my-[32px] [&_img]:w-full [&_img]:rounded-xl [&_img]:shadow-[var(--shadow-md)]

      [&_table]:w-full [&_table]:my-[28px] [&_table]:border-collapse
      [&_table]:block [&_table]:overflow-x-auto
      [&_table]:text-[15px]
      [&_th]:border [&_th]:border-[var(--border-md)] [&_th]:bg-[var(--surface-2)]
      [&_th]:p-[10px] [&_th]:text-[var(--text-1)] [&_th]:font-semibold
      [&_td]:border [&_td]:border-[var(--border)] [&_td]:p-[10px]
      [&_td]:text-[var(--text-2)]

      [&_hr]:my-[40px] [&_hr]:border-[var(--border)]
    "
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        : <p>المحتوى الكامل لهذا المقال لسه ما اتحفظش كـ HTML.</p>}
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleLd).replace(/</g, "\\u003c"),
        }}
      />
    </Shell>
  );
}
