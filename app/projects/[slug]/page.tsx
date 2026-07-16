import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/site-shell";
import { getProjectBySlug, getProjectSlugs, projectTypeLabels } from "@/lib/data/projects";

export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const project = await getProjectBySlug((await params).slug);
  if (!project) return {};
  return {
    title: project.metaTitle ?? `${project.title} | أبو أصاله`,
    description: project.metaDescription ?? undefined,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = await getProjectBySlug((await params).slug);
  if (!project) notFound();

  const cover = project.afterImage ?? project.gallery[0] ?? project.beforeImage;
  const hasBeforeAfter = Boolean(project.beforeImage && project.afterImage);

  return (
    <Shell>
      <article className="mx-auto w-[min(1180px,calc(100%-48px))] py-[75px] pb-[110px]">
        <div className="mb-[18px] text-xs text-[var(--text-3)]">
          <Link className="text-[var(--text-2)] no-underline" href="/">الرئيسية</Link> / <Link className="text-[var(--text-2)] no-underline" href="/اعمالنا">أعمالنا</Link> / {project.title}
        </div>
        <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">
          {projectTypeLabels[project.projectType]} · الرياض
          {project.service ? ` · ${project.service.name}` : ""}
          {project.area ? ` · ${project.area.name}` : ""}
        </p>
        <h1 className="m-0 text-[clamp(39px,5vw,68px)] leading-[1.2] tracking-[-2px]">{project.title}</h1>
        {project.durationNote && (
          <p className="max-w-[680px] text-[19px] text-[var(--text-2)]">مدة التنفيذ: {project.durationNote}</p>
        )}

        {hasBeforeAfter ? (
          <div className="mt-[25px] grid grid-cols-2 gap-[18px] max-[760px]:grid-cols-1">
            <div>
              <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">قبل</p>
              <Image
                className="h-auto w-full rounded-[14px] object-cover"
                src={project.beforeImage!}
                alt={`${project.title} قبل`}
                width={700}
                height={500}
              />
            </div>
            <div>
              <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">بعد</p>
              <Image
                className="h-auto w-full rounded-[14px] object-cover"
                src={project.afterImage!}
                alt={`${project.title} بعد`}
                width={700}
                height={500}
              />
            </div>
          </div>
        ) : (
          cover && (
            <Image
              className="mt-[25px] h-[min(65vw,650px)] w-full rounded-[22px] object-cover"
              src={cover}
              alt={project.title}
              width={1400}
              height={850}
              priority
            />
          )
        )}

        {project.gallery.length > 0 && (
          <section className="mx-auto grid grid-cols-2 gap-[18px] pb-[110px] max-[760px]:grid-cols-1">
            {project.gallery.map((src) => (
              <div className="overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface)] transition-[0.3s] hover:-translate-y-1 hover:shadow-[var(--shadow)]" key={src}>
                <Image
                  className="h-[340px] w-full object-cover max-[760px]:h-[290px]"
                  src={src}
                  alt={project.title}
                  width={720}
                  height={560}
                />
              </div>
            ))}
          </section>
        )}

        {(project.challenge || project.solution) && (
          <div className="grid grid-cols-2 gap-[60px] px-[8%] py-[55px] max-[760px]:grid-cols-1 max-[760px]:gap-2.5 max-[760px]:px-0 max-[760px]:py-[35px]">
            {project.challenge && (
              <div>
                <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">التحدي</p>
                <h2 className="text-[25px] leading-[1.4]">{project.challenge}</h2>
              </div>
            )}
            {project.solution && (
              <div>
                <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">الحل</p>
                <h2 className="text-[25px] leading-[1.4]">{project.solution}</h2>
              </div>
            )}
          </div>
        )}

        <section className="flex items-center justify-between bg-[var(--bg-deep)] p-[35px] text-[23px] max-[760px]:block max-[760px]:p-[25px]">
          <p>تريد نتيجة مشابهة لمكانك؟</p>
          <Link
            className="relative mt-3 inline-flex items-center justify-center gap-5 overflow-hidden rounded-full bg-white px-6 py-[15px] text-sm font-semibold text-[var(--accent)] no-underline transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(23,22,28,0.22)] max-[760px]:mt-3"
            href="/اتصل-بنا"
          >
            اطلب عرض سعر <span className="text-[19px] leading-none">←</span>
          </Link>
        </section>
      </article>
    </Shell>
  );
}
