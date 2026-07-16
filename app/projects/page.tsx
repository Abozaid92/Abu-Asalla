import { Shell } from "@/components/site-shell";
import { Reveal } from "@/components/reveal";
import { ProjectsGallery } from "@/components/projects-gallery";
import { getAllProjects, projectTypeLabels } from "@/lib/data/projects";

export const revalidate = 86400;
export const metadata = { title: "أعمال أبو أصاله | دهانات وديكور الرياض" };

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  const items = projects
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      cover: p.gallery[0] ?? p.afterImage ?? p.beforeImage,
      typeLabel: projectTypeLabels[p.projectType],
    }))
    .filter((p): p is { slug: string; title: string; cover: string; typeLabel: string } => Boolean(p.cover));

  return (
    <Shell>
      <section className="relative mx-auto w-[min(1180px,calc(100%-48px))] overflow-hidden pt-[105px] pb-[70px] max-[760px]:pt-[65px] max-[760px]:pb-[45px]">
        <Reveal>
          <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">معرض الأعمال</p>
          <h1 className="m-0 text-[clamp(39px,5vw,68px)] leading-[1.2] tracking-[-2px]">
            تنفيذات حقيقية
            <br />
            بتفاصيل واضحة.
          </h1>
          <p className="max-w-[600px] text-[17px] text-[var(--text-2)]">
            نماذج مختارة من أعمال الدهان والديكور المنفذة في الرياض.
          </p>
        </Reveal>
      </section>
      <section className="mx-auto w-[min(1180px,calc(100%-48px))]">
        <ProjectsGallery projects={items} />
      </section>
    </Shell>
  );
}
