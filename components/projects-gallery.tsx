"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type ProjectItem = {
  slug: string;
  title: string;
  cover: string;
  typeLabel: string;
};

type View = "grid" | "list" | "masonry";

export function ProjectsGallery({ projects }: { projects: ProjectItem[] }) {
  const [view, setView] = useState<View>("grid");

  return (
    <>
      <div className="mb-[30px] inline-flex gap-1 rounded-full border border-[var(--border)] p-1">
        <button
          className={`rounded-full border-0 bg-transparent px-5 py-[9px] text-[13px] font-semibold text-[var(--text-2)] transition-[0.25s] ease-out cursor-pointer ${
            view === "grid" ? "bg-[var(--accent)] text-white" : ""
          }`}
          onClick={() => setView("grid")}
        >
          شبكة
        </button>
        <button
          className={`rounded-full border-0 bg-transparent px-5 py-[9px] text-[13px] font-semibold text-[var(--text-2)] transition-[0.25s] ease-out cursor-pointer ${
            view === "masonry" ? "bg-[var(--accent)] text-white" : ""
          }`}
          onClick={() => setView("masonry")}
        >
          موزاييك
        </button>
        <button
          className={`rounded-full border-0 bg-transparent px-5 py-[9px] text-[13px] font-semibold text-[var(--text-2)] transition-[0.25s] ease-out cursor-pointer ${
            view === "list" ? "bg-[var(--accent)] text-white" : ""
          }`}
          onClick={() => setView("list")}
        >
          قائمة
        </button>
      </div>

      {view === "grid" && (
        <div className="grid grid-cols-2 gap-[18px] pb-[110px] max-[760px]:grid-cols-1">
          {projects.map((p, i) => (
            <Link
              className="group fade-in-item block overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface)] text-inherit no-underline transition-[0.3s] hover:-translate-y-1 hover:shadow-[var(--shadow)]"
              href={`/اعمالنا/${p.slug}`}
              key={p.slug}
              style={{ animationDelay: `${(i % 8) * 0.06}s` }}
            >
              <div className="overflow-hidden">
                <Image
                  className="h-[340px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06] max-[760px]:h-[290px]"
                  src={p.cover}
                  alt={p.title}
                  width={720}
                  height={560}
                />
              </div>
              <div className="p-5">
                <p className="m-0 text-xs text-[var(--text-3)]">{p.typeLabel} · الرياض</p>
                <h2 className="mb-[15px] mt-1 text-[23px]">{p.title}</h2>
                <span className="inline-block text-[13px] text-[var(--accent-warm)] transition-transform duration-300 group-hover:-translate-x-1">
                  عرض المشروع ←
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {view === "masonry" && (
        <div className="columns-3 gap-[18px] max-[900px]:columns-2 max-[560px]:columns-1">
          {projects.map((p, i) => (
            <Link
              className="group fade-in-item mb-[18px] block break-inside-avoid overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface)] text-inherit no-underline transition-[0.3s] hover:-translate-y-1 hover:shadow-[var(--shadow)]"
              href={`/اعمالنا/${p.slug}`}
              key={p.slug}
              style={{ animationDelay: `${(i % 8) * 0.06}s` }}
            >
              <div className="overflow-hidden">
                <img
                  className="w-full transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  src={p.cover}
                  alt={p.title}
                  width={720}
                  height={0}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <div className="p-5">
                <p className="m-0 text-xs text-[var(--text-3)]">{p.typeLabel} · الرياض</p>
                <h2 className="mb-[15px] mt-1 text-[23px]">{p.title}</h2>
                <span className="inline-block text-[13px] text-[var(--accent-warm)] transition-transform duration-300 group-hover:-translate-x-1">
                  عرض المشروع ←
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {view === "list" && (
        <div className="flex flex-col gap-4">
          {projects.map((p, i) => (
            <Link
              className="group fade-in-item grid min-h-[220px] grid-cols-[1.15fr_0.85fr] overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--surface)] text-inherit no-underline transition-[0.3s] hover:-translate-y-1 hover:shadow-[var(--shadow)] max-[760px]:grid-cols-1"
              href={`/اعمالنا/${p.slug}`}
              key={p.slug}
              style={{ animationDelay: `${(i % 8) * 0.06}s` }}
            >
              <div className="p-[47px] max-[760px]:p-7">
                <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">
                  {p.typeLabel} · الرياض
                </p>
                <h2 className="m-0 text-[31px]">{p.title}</h2>
                <span className="mt-3 inline-block border-b border-[var(--accent-warm)] pb-[5px] text-sm font-semibold text-[var(--text-1)] no-underline">
                  عرض المشروع ←
                </span>
              </div>
              <div className="overflow-hidden max-[760px]:order-first max-[760px]:h-[240px]">
                <Image
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  src={p.cover}
                  alt={p.title}
                  width={500}
                  height={350}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
