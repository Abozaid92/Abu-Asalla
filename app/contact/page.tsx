import { QuoteForm } from "@/components/quote-form";
import { Shell } from "@/components/site-shell";
import { Reveal } from "@/components/reveal";
import { getSiteSettings } from "@/lib/data/settings";
import { getActiveServices } from "@/lib/data/services";

export const revalidate = 86400;
export const metadata = { title: "اتصل بنا | أبو أصاله للدهانات والديكور" };

const contactCard =
  "flex flex-col gap-[14px] rounded-[var(--radius-project-sm)] border border-[var(--border)] bg-[var(--surface)] p-[30px] text-inherit no-underline transition-[0.3s] hover:-translate-y-1 hover:shadow-[var(--shadow)]";
const contactIcon =
  "grid h-[46px] w-[46px] place-items-center rounded-full bg-[var(--gold-gradient)] text-[#1c1a17]";
const contactButton =
  "relative mt-1.5 inline-flex w-max items-center justify-center gap-5 overflow-hidden rounded-full bg-[var(--accent)] px-6 py-[15px] text-sm font-semibold text-white no-underline transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(23,22,28,0.22)]";

export default async function ContactPage() {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getActiveServices(),
  ]);
  const number = settings.whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <Shell>
      <section className="relative mx-auto w-[min(1180px,calc(100%-48px))] overflow-hidden pt-[105px] pb-[70px] max-[760px]:pt-[65px] max-[760px]:pb-[45px]">
        <Reveal>
          <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">
            تواصل معنا
          </p>
          <h1 className="m-0 text-[clamp(39px,5vw,68px)] leading-[1.2] tracking-[-2px]">
            مشروعك يبدأ
            <br />
            برسالة بسيطة.
          </h1>
          <p className="max-w-[600px] text-[17px] text-[var(--text-2)]">
            اختر الطريقة الأسهل لك، وسنرد عليك بأسرع وقت لنبدأ في تفاصيل مشروعك.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-[26px] max-[760px]:grid-cols-1">
          <Reveal className="reveal-1">
            <a
              className={contactCard}
              href={`https://wa.me/${number}`}
              target="_blank"
              rel="noopener"
            >
              <span className={contactIcon}>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.3 21.7l4.85-1.27A9.8 9.8 0 1 0 12 2.2zm0 1.8a8 8 0 1 1 0 16 8 8 0 0 1-4.1-1.13l-.3-.18-2.87.75.77-2.8-.2-.3A8 8 0 0 1 12 4zm4.4 10.2c-.24-.12-1.4-.7-1.62-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94-.28.18-.52.06a6.5 6.5 0 0 1-3.24-2.83c-.24-.42.24-.39.7-1.3.08-.16.04-.3-.02-.42s-.54-1.3-.74-1.78c-.2-.46-.4-.4-.54-.4h-.46a.9.9 0 0 0-.64.3 2.7 2.7 0 0 0-.84 2 4.7 4.7 0 0 0 1 2.5 10.8 10.8 0 0 0 4.5 3.98c.63.27 1.12.44 1.5.56.63.2 1.2.17 1.65.1.5-.08 1.4-.57 1.6-1.13.2-.55.2-1.03.14-1.13-.06-.1-.22-.16-.46-.28z" />
                </svg>
              </span>
              <h3 className="m-0 text-[17px]">دردشة واتساب</h3>
              <p className="m-0 text-sm text-[var(--text-2)]" dir="ltr">
                +{number}
              </p>
              <span className={contactButton}>تواصل الآن ←</span>
            </a>
          </Reveal>

          <Reveal className="reveal-2">
            <a className={contactCard} href={`tel:+${number}`}>
              <span className={contactIcon}>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M4.5 4.5c1-1 2-1 2.7 0l1.3 2c.5.8.3 1.7-.3 2.3l-.9.9c.7 1.9 2.4 3.6 4.3 4.3l.9-.9c.6-.6 1.5-.8 2.3-.3l2 1.3c1 .7 1 1.7 0 2.7l-1 1c-1 1-3.6.8-6.6-2.2s-3.2-5.6-2.2-6.6l1-1z" />
                </svg>
              </span>
              <h3 className="m-0 text-[17px]">اتصال مباشر</h3>
              <p className="m-0 text-sm text-[var(--text-2)]" dir="ltr">
                +{number}
              </p>
              <span className={contactButton}>اتصل الآن ←</span>
            </a>
          </Reveal>

          {settings.instagramUrl && (
            <Reveal className="reveal-3">
              <a
                className={contactCard}
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener"
              >
                <span className={contactIcon}>
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
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
                </span>
                <h3 className="m-0 text-[17px]">إنستغرام</h3>
                <p className="m-0 text-sm text-[var(--text-2)]">
                  شاهد أحدث أعمالنا يوميًا
                </p>
                <span className={contactButton}>زيارة الحساب ←</span>
              </a>
            </Reveal>
          )}

          <Reveal className="reveal-4">
            <div className={contactCard}>
              <span className={contactIcon}>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M12 21s-7-6.3-7-11.5A7 7 0 0 1 19 9.5C19 14.7 12 21 12 21z" />
                  <circle cx="12" cy="9.5" r="2.4" />
                </svg>
              </span>
              <h3 className="m-0 text-[17px]">نطاق التنفيذ</h3>
              <p className="m-0 text-sm text-[var(--text-2)]">
                نخدم مدينة الرياض وضواحيها
              </p>
              {settings.workingHours && (
                <p className="m-0 text-sm text-[var(--text-2)]">
                  {settings.workingHours}
                </p>
              )}
            </div>
          </Reveal>
        </div>

        <Reveal className="reveal-5 mt-[26px] rounded-[var(--radius-project-sm)] border border-[var(--border)] bg-[var(--surface)] p-[26px]">
          <div className="mb-4">
            <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]">
              موقعنا
            </p>
            <h3 className="mt-1.5 text-[17px]">
              الرياض، حي الدار البيضاء، شارع عرفات
            </h3>
          </div>
          <div className="h-[260px] overflow-hidden rounded-[var(--radius-project-sm)] border border-[var(--border)]">
            <iframe
              className="h-full w-full border-0 grayscale-[30%]"
              src="https://www.google.com/maps?q=الرياض+دار+البيضاء+شارع+عرفات&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع أبو أصاله على الخريطة"
            />
          </div>
        </Reveal>
      </section>

      <section className="bg-[var(--accent)] py-[105px] text-white max-[760px]:py-[60px]">
        <div className="mx-auto w-[min(1180px,calc(100%-48px))]">
          <Reveal className="rounded-[var(--radius-project)] bg-[var(--accent)] p-11 text-white max-[760px]:p-6 [&_input]:border [&_input]:border-white/15 [&_input]:bg-white/[0.06] [&_input]:text-white [&_label]:text-[#d7d4cd] [&_select]:border [&_select]:border-white/15 [&_select]:bg-white/[0.06] [&_select]:text-white [&_textarea]:border [&_textarea]:border-white/15 [&_textarea]:bg-white/[0.06] [&_textarea]:text-white">
            <p className="mb-[17px] text-xs font-semibold tracking-[0.05em] text-[#d5b188]">
              أرسل تفاصيل مشروعك
            </p>
            <h2 className="mt-0 text-[clamp(37px,4.4vw,61px)]">
              خلّنا نجهزلك
              <br />
              عرض سعر دقيق.
            </h2>
            <p className="text-[#a9a6a0]">
              الاسم، رقم الجوال، ونوع الخدمة — وسنعاود التواصل معك سريعًا.
            </p>
            <QuoteForm services={services} />
          </Reveal>
        </div>
      </section>
    </Shell>
  );
}
