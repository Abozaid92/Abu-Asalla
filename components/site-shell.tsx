import Link from "next/link";
import { getSiteSettings } from "@/lib/data/settings";
import { getActiveServices } from "@/lib/data/services";
import { NavMenu } from "@/components/nav-menu";

const LOGO_URL =
  "https://bwmvrztnbjayktocsdvc.supabase.co/storage/v1/object/public/alrif/d5f19925-8226-458b-bfb7-ffa4753fecdc.png";

async function Header() {
  const services = await getActiveServices();
  return <NavMenu services={services} />;
}

async function Footer() {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getActiveServices(),
  ]);
  const waNumber = settings.whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <footer className="bg-accent text-[#d7d4cd] pt-20">
      <div className="mx-auto w-[min(1180px,calc(100%-48px))] grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 pb-[60px] border-b border-white/[0.09] max-[760px]:grid-cols-2 max-[760px]:gap-x-5 max-[760px]:gap-y-8 max-[760px]:pb-10">
        <div className="max-[760px]:col-span-2">
          <Link
            href="/"
            className="flex items-center gap-[13px] text-2xl font-bold tracking-[-1px] text-text-1 no-underline leading-none"
          >
            <img
              src={LOGO_URL}
              alt="أبو أصاله"
              width={190}
              height={50}
              className="w-full h-full object-contain object-[right_center]"
            />
            <span className="hidden">
              <b className="font-bold">
                <span className="text-accent-warm">أبو</span> أصاله
              </b>
              <small className="block mt-1.5 text-text-3 text-[9px] font-medium tracking-[1px]">
                للدهانات والديكور
              </small>
            </span>
          </Link>
          <p className="text-[13.5px] leading-[1.9] text-[#a9a6a0] max-w-[300px] mt-5 mb-6">
            دهانات وديكورات متكاملة في الرياض — من الفكرة إلى التسليم، بجودة
            وتفاصيل تليق بذوقك.
          </p>
          <div className="flex gap-2.5">
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                aria-label="انستغرام"
                rel="noopener"
                className="w-[38px] h-[38px] grid place-items-center rounded-full border border-white/[0.16] text-[#e7e4de] transition-[background,color,border-color,transform] duration-[0.25s] ease-in-out hover:bg-[image:var(--gold-gradient)] hover:text-[#1c1a17] hover:border-transparent hover:-translate-y-[3px]"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.2"
                    cy="6.8"
                    r="1.1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>
            )}
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent("مرحباً، أود طلب عرض سعر")}`}
              target="_blank"
              aria-label="واتساب"
              rel="noopener"
              className="w-[38px] h-[38px] grid place-items-center rounded-full border border-white/[0.16] text-[#e7e4de] transition-[background,color,border-color,transform] duration-[0.25s] ease-in-out hover:bg-[image:var(--gold-gradient)] hover:text-[#1c1a17] hover:border-transparent hover:-translate-y-[3px]"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.3 21.7l4.85-1.27A9.8 9.8 0 1 0 12 2.2zm0 1.8a8 8 0 1 1 0 16 8 8 0 0 1-4.1-1.13l-.3-.18-2.87.75.77-2.8-.2-.3A8 8 0 0 1 12 4zm4.4 10.2c-.24-.12-1.4-.7-1.62-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94-.28.18-.52.06a6.5 6.5 0 0 1-3.24-2.83c-.24-.42.24-.39.7-1.3.08-.16.04-.3-.02-.42s-.54-1.3-.74-1.78c-.2-.46-.4-.4-.54-.4h-.46a.9.9 0 0 0-.64.3 2.7 2.7 0 0 0-.84 2 4.7 4.7 0 0 0 1 2.5 10.8 10.8 0 0 0 4.5 3.98c.63.27 1.12.44 1.5.56.63.2 1.2.17 1.65.1.5-.08 1.4-.57 1.6-1.13.2-.55.2-1.03.14-1.13-.06-.1-.22-.16-.46-.28z" />
              </svg>
            </a>
            <a
              href={`tel:+${waNumber}`}
              aria-label="اتصال"
              className="w-[38px] h-[38px] grid place-items-center rounded-full border border-white/[0.16] text-[#e7e4de] transition-[background,color,border-color,transform] duration-[0.25s] ease-in-out hover:bg-[image:var(--gold-gradient)] hover:text-[#1c1a17] hover:border-transparent hover:-translate-y-[3px]"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M4.5 4.5c1-1 2-1 2.7 0l1.3 2c.5.8.3 1.7-.3 2.3l-.9.9c.7 1.9 2.4 3.6 4.3 4.3l.9-.9c.6-.6 1.5-.8 2.3-.3l2 1.3c1 .7 1 1.7 0 2.7l-1 1c-1 1-3.6.8-6.6-2.2s-3.2-5.6-2.2-6.6l1-1z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-white text-[13px] tracking-[0.03em] mt-0 mb-1.5 relative pb-3 after:content-[''] after:absolute after:right-0 after:bottom-0 after:w-[26px] after:h-0.5 after:bg-[image:var(--gold-gradient)]">
            روابط سريعة
          </h4>
          <Link
            href="/"
            className="text-[#a9a6a0] no-underline text-[13.5px] transition-[color,padding-right] duration-200 ease w-max hover:text-accent-warm-2 hover:pr-1"
          >
            الرئيسية
          </Link>
          <Link
            href="/خدمات"
            className="text-[#a9a6a0] no-underline text-[13.5px] transition-[color,padding-right] duration-200 ease w-max hover:text-accent-warm-2 hover:pr-1"
          >
            خدماتنا
          </Link>
          <Link
            href="/اعمالنا"
            className="text-[#a9a6a0] no-underline text-[13.5px] transition-[color,padding-right] duration-200 ease w-max hover:text-accent-warm-2 hover:pr-1"
          >
            أعمالنا
          </Link>
          <Link
            href="/المدونة"
            className="text-[#a9a6a0] no-underline text-[13.5px] transition-[color,padding-right] duration-200 ease w-max hover:text-accent-warm-2 hover:pr-1"
          >
            المدونة
          </Link>
          <Link
            href="/من-نحن"
            className="text-[#a9a6a0] no-underline text-[13.5px] transition-[color,padding-right] duration-200 ease w-max hover:text-accent-warm-2 hover:pr-1"
          >
            من نحن
          </Link>
          <Link
            href="/الأسئلة-الشائعة"
            className="text-[#a9a6a0] no-underline text-[13.5px] transition-[color,padding-right] duration-200 ease w-max hover:text-accent-warm-2 hover:pr-1"
          >
            الأسئلة الشائعة
          </Link>
          <Link
            href="/اتصل-بنا"
            className="text-[#a9a6a0] no-underline text-[13.5px] transition-[color,padding-right] duration-200 ease w-max hover:text-accent-warm-2 hover:pr-1"
          >
            تواصل معنا
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-white text-[13px] tracking-[0.03em] mt-0 mb-1.5 relative pb-3 after:content-[''] after:absolute after:right-0 after:bottom-0 after:w-[26px] after:h-0.5 after:bg-[image:var(--gold-gradient)]">
            خدماتنا
          </h4>
          {services.slice(0, 6).map((s) => (
            <Link
              key={s.slug}
              href={`/خدمات/${s.slug}`}
              className="text-[#a9a6a0] no-underline text-[13.5px] transition-[color,padding-right] duration-200 ease w-max hover:text-accent-warm-2 hover:pr-1"
            >
              {s.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-white text-[13px] tracking-[0.03em] mt-0 mb-1.5 relative pb-3 after:content-[''] after:absolute after:right-0 after:bottom-0 after:w-[26px] after:h-0.5 after:bg-[image:var(--gold-gradient)]">
            تواصل معنا
          </h4>
          <a
            className="font-semibold !text-[#efe6d6]"
            href={`tel:+${waNumber}`}
            dir="ltr"
          >
            +{waNumber}
          </a>
          <a
            className="font-semibold !text-[#efe6d6]"
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener"
          >
            دردشة واتساب
          </a>
          {settings.workingHours && (
            <span className="text-[#6f6c66] text-[12.5px]">
              {settings.workingHours}
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto w-[min(1180px,calc(100%-48px))] flex items-center justify-between py-[26px] text-[#83807a] text-xs max-[760px]:flex-col max-[760px]:gap-3 max-[760px]:items-start">
        <small>
          © {new Date().getFullYear()} أبو أصاله للدهانات والديكور. جميع الحقوق
          محفوظة.
        </small>
        <div className="flex gap-[22px]">
          <Link
            href="/الشروط-والأحكام"
            className="text-xs text-[#83807a] hover:text-accent-warm-2"
          >
            الشروط والأحكام
          </Link>
          <Link
            href="/سياسة-الخصوصية"
            className="text-xs text-[#83807a] hover:text-accent-warm-2"
          >
            سياسة الخصوصية
          </Link>
        </div>
      </div>
    </footer>
  );
}

async function WhatsAppFloat() {
  const settings = await getSiteSettings();
  const number = settings.whatsappNumber.replace(/[^0-9]/g, "");
  return (
    <a
      className="fixed right-[22px] bottom-[22px] z-[5] w-14 h-14 rounded-full grid place-items-center bg-[#26a76b] text-white no-underline shadow-[0_14px_30px_rgba(20,90,60,0.35)] animate-[whatsapp-pulse_2.6s_ease-in-out_infinite] hover:scale-[1.06]"
      href={`https://wa.me/${number}?text=${encodeURIComponent("مرحباً، أود طلب عرض سعر")}`}
      target="_blank"
      aria-label="تواصل عبر واتساب"
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
        <path d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.3 21.7l4.85-1.27A9.8 9.8 0 1 0 12 2.2zm0 1.8a8 8 0 1 1 0 16 8 8 0 0 1-4.1-1.13l-.3-.18-2.87.75.77-2.8-.2-.3A8 8 0 0 1 12 4zm4.4 10.2c-.24-.12-1.4-.7-1.62-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94-.28.18-.52.06a6.5 6.5 0 0 1-3.24-2.83c-.24-.42.24-.39.7-1.3.08-.16.04-.3-.02-.42s-.54-1.3-.74-1.78c-.2-.46-.4-.4-.54-.4h-.46a.9.9 0 0 0-.64.3 2.7 2.7 0 0 0-.84 2 4.7 4.7 0 0 0 1 2.5 10.8 10.8 0 0 0 4.5 3.98c.63.27 1.12.44 1.5.56.63.2 1.2.17 1.65.1.5-.08 1.4-.57 1.6-1.13.2-.55.2-1.03.14-1.13-.06-.1-.22-.16-.46-.28z" />
      </svg>
    </a>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
