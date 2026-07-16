"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type ServiceItem = {
  name: string;
  slug: string;
  shortDescription?: string | null;
};

export function NavMenu({ services }: { services: ServiceItem[] }) {
  const [openMenu, setOpenMenu] = useState<"services" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<"services" | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function openNow(menu: "services") {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  }

  function closeSoon() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  }

  return (
    <>
      <header
        className={`sticky top-0 z-30 mx-auto w-[min(1180px,calc(100%-48px))] flex items-center justify-between gap-6 bg-[rgba(247,246,244,0.7)] backdrop-blur-[14px] backdrop-saturate-[1.4] transition-[box-shadow,height,background] duration-[0.35s] ease max-[900px]:w-[min(calc(100%-32px),1180px)] ${
          scrolled ?
            "h-[76px] bg-[rgba(247,246,244,0.92)] shadow-[0_10px_30px_rgba(20,18,15,0.08)]"
          : "h-[92px] max-[900px]:h-[76px]"
        }`}
        data-scrolled={scrolled}
      >
        <Link
          className="flex items-center gap-[13px] text-2xl font-bold tracking-[-1px] text-text-1 no-underline leading-none"
          href="/"
          onClick={() => setMobileOpen(false)}
        >
          <span className="h-16 w-auto grid place-items-center flex-none">
            <img
              src="https://bwmvrztnbjayktocsdvc.supabase.co/storage/v1/object/public/alrif/d5f19925-8226-458b-bfb7-ffa4753fecdc.png"
              alt="أبو أصاله"
              className="h-full w-auto min-h-0 min-w-0 object-contain"
            />
          </span>
          <span className="hidden">
            <b className="font-bold">
              <span className="text-accent-warm">أبو</span> أصاله
            </b>
            <small className="block mt-1.5 text-text-3 text-[9px] font-medium tracking-[1px]">
              للدهانات والديكور
            </small>
          </span>
        </Link>

        <nav className="flex items-center gap-[30px] max-[900px]:hidden">
          <div
            className="relative"
            onMouseEnter={() => openNow("services")}
            onMouseLeave={closeSoon}
          >
            <Link
              href="/خدمات"
              className="relative text-text-2 no-underline text-sm font-medium py-2 px-px inline-flex items-center gap-[5px] transition-colors duration-200 ease hover:text-text-1 after:content-[''] after:absolute after:right-0 after:bottom-0 after:w-0 after:h-[1.5px] after:bg-[image:var(--gold-gradient)] after:transition-[width] after:duration-[0.28s] after:ease hover:after:w-full"
            >
              خدماتنا{" "}
              <i
                className={`inline-block text-[11px] text-accent-warm transition-transform duration-[0.25s] ease${openMenu === "services" ? " rotate-180" : ""}`}
              >
                ⌄
              </i>
            </Link>
            <div
              className={`absolute top-[calc(100%+18px)] -right-5 min-w-[560px] bg-surface border border-border rounded-project shadow-[var(--shadow-lg)] p-[26px] transition-[opacity,transform,visibility] duration-[0.22s] ease ${
                openMenu === "services" ?
                  "opacity-100 visible translate-y-0"
                : "opacity-0 invisible translate-y-[10px]"
              }`}
            >
              <div className="grid grid-cols-2 gap-1">
                {services.slice(0, 8).map((s) => (
                  <Link
                    key={s.slug}
                    href={`/خدمات/${s.slug}`}
                    className="block py-3 px-3.5 rounded-lg no-underline text-text-1 transition-[background,transform] duration-200 ease hover:bg-bg-deep hover:-translate-x-0.5"
                  >
                    <b className="block text-sm font-semibold">{s.name}</b>
                    {s.shortDescription && (
                      <span className="block mt-[3px] text-xs text-text-3 overflow-hidden text-ellipsis whitespace-nowrap">
                        {s.shortDescription}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
              <Link
                href="/خدمات"
                className="flex items-center gap-2 mt-[14px] pt-[14px] border-t border-border text-[13px] font-semibold text-accent-warm no-underline"
              >
                عرض جميع الخدمات <span>←</span>
              </Link>
            </div>
          </div>

          <Link
            href="/اعمالنا"
            className="relative text-text-2 no-underline text-sm font-medium py-2 px-px inline-flex items-center gap-[5px] transition-colors duration-200 ease hover:text-text-1 after:content-[''] after:absolute after:right-0 after:bottom-0 after:w-0 after:h-[1.5px] after:bg-[image:var(--gold-gradient)] after:transition-[width] after:duration-[0.28s] after:ease hover:after:w-full"
          >
            أعمالنا
          </Link>
          <Link
            href="/المدونة"
            className="relative text-text-2 no-underline text-sm font-medium py-2 px-px inline-flex items-center gap-[5px] transition-colors duration-200 ease hover:text-text-1 after:content-[''] after:absolute after:right-0 after:bottom-0 after:w-0 after:h-[1.5px] after:bg-[image:var(--gold-gradient)] after:transition-[width] after:duration-[0.28s] after:ease hover:after:w-full"
          >
            المدونة
          </Link>
          <Link
            href="/من-نحن"
            className="relative text-text-2 no-underline text-sm font-medium py-2 px-px inline-flex items-center gap-[5px] transition-colors duration-200 ease hover:text-text-1 after:content-[''] after:absolute after:right-0 after:bottom-0 after:w-0 after:h-[1.5px] after:bg-[image:var(--gold-gradient)] after:transition-[width] after:duration-[0.28s] after:ease hover:after:w-full"
          >
            من نحن
          </Link>
          <Link
            href="/اتصل-بنا"
            className="relative text-text-2 no-underline text-sm font-medium py-2 px-px inline-flex items-center gap-[5px] transition-colors duration-200 ease hover:text-text-1 after:content-[''] after:absolute after:right-0 after:bottom-0 after:w-0 after:h-[1.5px] after:bg-[image:var(--gold-gradient)] after:transition-[width] after:duration-[0.28s] after:ease hover:after:w-full"
          >
            تواصل معنا
          </Link>
        </nav>

        <div className="flex items-center gap-[18px]">
          <a
            className="relative border-0 rounded-full inline-flex items-center justify-center gap-5 py-[15px] px-6 no-underline font-semibold text-sm cursor-pointer transition-[transform,box-shadow] duration-[0.28s] ease overflow-hidden bg-accent text-white before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.35),transparent)] before:-translate-x-[120%] before:transition-transform before:duration-[0.6s] before:ease hover:before:translate-x-[120%] hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(23,22,28,0.22)] max-[900px]:hidden"
            href="#quote"
          >
            اطلب عرض سعر{" "}
            <span className="text-[19px] leading-none relative">←</span>
          </a>
          <button
            className="hidden max-[900px]:flex flex-col justify-center gap-[5px] w-8 h-8 border-0 bg-transparent cursor-pointer p-0"
            aria-label="القائمة"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span
              className={`h-0.5 w-full bg-text-1 transition-[0.25s] ease origin-center${mobileOpen ? " translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-full bg-text-1 transition-[0.25s] ease origin-center${mobileOpen ? " opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-full bg-text-1 transition-[0.25s] ease origin-center${mobileOpen ? " -translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-x-0 top-[92px] bottom-0 z-[29] bg-surface transition-[opacity,transform,visibility] duration-[0.28s] ease overflow-y-auto max-[900px]:top-[76px] ${
          mobileOpen ?
            "opacity-100 visible translate-y-0 pointer-events-auto"
          : "opacity-0 invisible -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="flex flex-col pt-[26px] px-6 pb-[60px]">
          <button
            className="flex justify-between items-center w-full bg-transparent border-0 border-b border-border py-4 font-semibold text-[17px] text-text-1 cursor-pointer"
            onClick={() =>
              setMobileSection((v) => (v === "services" ? null : "services"))
            }
          >
            خدماتنا{" "}
            <i
              className={`text-accent-warm transition-transform duration-200 ease${mobileSection === "services" ? " rotate-180" : ""}`}
            >
              ⌄
            </i>
          </button>
          {mobileSection === "services" && (
            <div className="flex flex-col pt-1 pr-4 pb-2.5 gap-0.5">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/خدمات/${s.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-text-2 no-underline text-sm py-[9px]"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/اعمالنا"
            onClick={() => setMobileOpen(false)}
            className="text-text-1 no-underline text-[17px] font-semibold py-4 border-b border-border"
          >
            أعمالنا
          </Link>
          <Link
            href="/المدونة"
            onClick={() => setMobileOpen(false)}
            className="text-text-1 no-underline text-[17px] font-semibold py-4 border-b border-border"
          >
            المدونة
          </Link>
          <Link
            href="/من-نحن"
            onClick={() => setMobileOpen(false)}
            className="text-text-1 no-underline text-[17px] font-semibold py-4 border-b border-border"
          >
            من نحن
          </Link>
          <Link
            href="/اتصل-بنا"
            onClick={() => setMobileOpen(false)}
            className="text-text-1 no-underline text-[17px] font-semibold py-4 border-b border-border"
          >
            تواصل معنا
          </Link>
          <a
            className="relative border-0 rounded-full inline-flex items-center justify-center gap-5 py-[15px] px-6 no-underline font-semibold text-sm cursor-pointer transition-[transform,box-shadow] duration-[0.28s] ease overflow-hidden bg-accent text-white before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.35),transparent)] before:-translate-x-[120%] before:transition-transform before:duration-[0.6s] before:ease hover:before:translate-x-[120%] mt-6 justify-center"
            href="#quote"
            onClick={() => setMobileOpen(false)}
          >
            اطلب عرض سعر{" "}
            <span className="text-[19px] leading-none relative">←</span>
          </a>
        </div>
      </div>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[28] bg-[rgba(10,9,8,0.35)]"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
