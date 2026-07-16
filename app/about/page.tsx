import Image from "next/image";
import { Shell } from "@/components/site-shell";
import { Reveal } from "@/components/reveal";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/settings";
import { getGeneralFaqs } from "@/lib/data/faqs";

export const revalidate = 86400;
export const metadata = { title: "من نحن | أبو أصاله للدهانات والديكور" };

const sectionHead =
  "mb-14 flex items-end justify-between gap-10 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-4";
const eyebrow =
  "mb-[17px] text-xs font-semibold tracking-[0.05em] text-[var(--accent-warm)]";
const trustCard =
  "rounded-[var(--radius-project-sm)] border border-[var(--border)] bg-[var(--surface)] px-6 py-[26px] transition-[transform,box-shadow] duration-[250ms] ease hover:-translate-y-[3px] hover:shadow-[var(--shadow-project)]";
const eeatCard =
  "rounded-[var(--radius-project-sm)] border border-[var(--border)] bg-[var(--surface)] p-[26px]";
const stepRow = "flex gap-[22px] border-t border-[var(--border)] py-[18px]";
const timelineStep =
  "relative flex gap-[22px] border-t border-[var(--border)] py-[18px] before:absolute before:right-[-31px] before:top-6 before:h-2.5 before:w-2.5 before:rounded-full before:bg-[var(--accent-warm)] before:content-['']";

// ملحوظة: نص "قصة أبو أصاله" وسنين الخبرة والضمان لسه بيانات مفتوحة محتاجة
// تأكيد من العميل (REQUIREMENTS.md §9). الأرقام هنا مسحوبة من الإعدادات فقط
// (لو محطوطة)، ومفيش أي رقم أو ادعاء مختلق في هذا الملف.
export default async function AboutPage() {
  const [projects, settings, faqs] = await Promise.all([
    getFeaturedProjects(1),
    getSiteSettings(),
    getGeneralFaqs(),
  ]);
  const image =
    projects[0]?.gallery[0] ??
    projects[0]?.afterImage ??
    projects[0]?.beforeImage;
  const number = settings.whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <Shell>
      <section className="mx-auto grid w-[min(1180px,calc(100%-48px))] grid-cols-2 items-center gap-[60px] py-20 max-[760px]:grid-cols-1 max-[760px]:gap-[27px] max-[760px]:py-[55px]">
        <Reveal>
          <p className={eyebrow}>عن أبو أصاله</p>
          <h1 className="m-0 text-[clamp(39px,5vw,68px)] leading-[1.2] tracking-[-2px]">
            تنفيذ يحترم الفكرة
            <br />
            والتفاصيل.
          </h1>
          <p className="max-w-[530px] text-[17px] text-[var(--text-2)]">
            أبو أصاله للدهانات والديكور يقدم حلول تشطيب وديكور في الرياض، مع
            تركيز على النتيجة النظيفة والتنسيق الذي يخدم المكان. نعمل مباشرة مع
            أصحاب المنازل والفلل والمكاتب من أول معاينة إلى التسليم.
          </p>
        </Reveal>
        {image && (
          <Image
            className="h-[460px] w-full rounded-[20px] object-cover max-[760px]:h-[300px]"
            src={image}
            alt="تفاصيل ديكور منفذة"
            width={720}
            height={560}
          />
        )}
      </section>

      <section className="mx-auto grid w-[min(1180px,calc(100%-48px))] grid-cols-[1.1fr_0.9fr] gap-[100px] py-[90px] max-[760px]:grid-cols-1 max-[760px]:gap-[45px] max-[760px]:py-[60px]">
        <Reveal>
          <p className={eyebrow}>أسلوب العمل</p>
          <h2 className="m-0 mb-[19px] text-[34px] leading-[1.3]">
            وضوح من أول تواصل إلى التسليم.
          </h2>
          <p className="max-w-[650px] text-base text-[var(--text-2)]">
            لا نعامل كل مشروع كنسخة من السابق. نبدأ من طابع المساحة واستخدامها،
            ثم نرتب الخيارات والخطوات بحيث تحصل على تنفيذ مفهوم ومنظم. كل مشروع
            يمر بمعاينة، اتفاق واضح على الخامات والتكلفة، ثم تنفيذ بجدول زمني
            محدد.
          </p>
        </Reveal>
        <aside>
          <p className={eyebrow}>ما نلتزم به</p>
          <div className={stepRow}>
            <b className="text-[13px] text-[var(--accent-warm)]">01</b>
            <span>تنسيق واضح قبل التنفيذ</span>
          </div>
          <div className={stepRow}>
            <b className="text-[13px] text-[var(--accent-warm)]">02</b>
            <span>خامات وتفاصيل مناسبة للمكان</span>
          </div>
          <div className={stepRow}>
            <b className="text-[13px] text-[var(--accent-warm)]">03</b>
            <span>تواصل مباشر ونتيجة نظيفة</span>
          </div>
        </aside>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-48px))] py-[120px] max-[760px]:py-[70px]">
        <Reveal className={sectionHead}>
          <div>
            <p className={eyebrow}>خبرتنا في الأرقام</p>
            <h2 className="m-0 text-[clamp(31px,3.4vw,49px)] font-semibold leading-[1.22] tracking-[-1.5px]">
              نتائج ملموسة
              <br />
              وليست وعودًا فقط.
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3.5">
          {settings.yearsExperience && (
            <div className={trustCard}>
              <strong className="block text-[22px] text-[var(--accent-warm)]">
                +{settings.yearsExperience}
              </strong>
              <span className="mt-1 block text-[12.5px] text-[var(--text-3)]">
                سنوات خبرة في سوق الرياض
              </span>
            </div>
          )}
          {settings.projectsCount && (
            <div className={trustCard}>
              <strong className="block text-[22px] text-[var(--accent-warm)]">
                +{settings.projectsCount}
              </strong>
              <span className="mt-1 block text-[12.5px] text-[var(--text-3)]">
                مشروع دهانات وديكور منفذ
              </span>
            </div>
          )}
          <div className={trustCard}>
            <strong className="block text-[22px] text-[var(--accent-warm)]">
              الرياض
            </strong>
            <span className="mt-1 block text-[12.5px] text-[var(--text-3)]">
              نطاق التنفيذ الأساسي وضواحيها
            </span>
          </div>
          <div className={trustCard}>
            <strong className="block text-[22px] text-[var(--accent-warm)]">
              معاينة مجانية
            </strong>
            <span className="mt-1 block text-[12.5px] text-[var(--text-3)]">
              قبل تحديد نطاق العمل والتكلفة
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-48px))] py-[120px] max-[760px]:py-[70px]">
        <Reveal className={sectionHead}>
          <div>
            <p className={eyebrow}>لماذا تختار أبو أصاله</p>
            <h2 className="m-0 text-[clamp(31px,3.4vw,49px)] font-semibold leading-[1.22] tracking-[-1.5px]">
              خبرة عملية
              <br />
              وليست نظرية.
            </h2>
          </div>
          <p className="m-0 max-w-[330px] text-[15px] text-[var(--text-2)]">
            مصداقية التنفيذ تظهر في التفاصيل الصغيرة قبل الكبيرة — من حماية
            الأرضيات أثناء العمل، إلى تسليم مكان نظيف جاهز للاستخدام.
          </p>
        </Reveal>
        <div className="grid grid-cols-3 gap-[18px] max-[760px]:grid-cols-1">
          <Reveal className="reveal-1">
            <div className={eeatCard}>
              <h3 className="m-0 mb-[10px] text-[16.5px]">
                خبرة ميدانية مباشرة
              </h3>
              <p className="m-0 text-[13.5px] leading-[1.85] text-[var(--text-2)]">
                فريق ينفذ بنفسه أعمال الدهانات والديكور، ويتابع كل مشروع من
                المعاينة وحتى التسليم النهائي — وليس مجرد وسيط بين العميل
                والعمالة.
              </p>
            </div>
          </Reveal>
          <Reveal className="reveal-2">
            <div className={eeatCard}>
              <h3 className="m-0 mb-[10px] text-[16.5px]">
                خامات معروفة المصدر
              </h3>
              <p className="m-0 text-[13.5px] leading-[1.85] text-[var(--text-2)]">
                نستخدم دهانات وخامات ديكور معروفة في السوق السعودي، ونوضح للعميل
                نوع الخامة المستخدمة قبل البدء في التنفيذ وليس بعده.
              </p>
            </div>
          </Reveal>
          <Reveal className="reveal-3">
            <div className={eeatCard}>
              <h3 className="m-0 mb-[10px] text-[16.5px]">تسعير واضح مسبقًا</h3>
              <p className="m-0 text-[13.5px] leading-[1.85] text-[var(--text-2)]">
                يحصل العميل على عرض سعر مكتوب يوضح نطاق العمل قبل أي التزام،
                بدون تكاليف مفاجئة أثناء التنفيذ.
              </p>
            </div>
          </Reveal>
          <Reveal className="reveal-4">
            <div className={eeatCard}>
              <h3 className="m-0 mb-[10px] text-[16.5px]">
                تواصل مباشر بدون وسيط
              </h3>
              <p className="m-0 text-[13.5px] leading-[1.85] text-[var(--text-2)]">
                التواصل مباشرة معنا عبر واتساب أو الاتصال، ومتابعة فعلية لحالة
                الطلب من أول رسالة حتى التسليم.
              </p>
            </div>
          </Reveal>
          <Reveal className="reveal-5">
            <div className={eeatCard}>
              <h3 className="m-0 mb-[10px] text-[16.5px]">
                أعمال موثقة بالصور
              </h3>
              <p className="m-0 text-[13.5px] leading-[1.85] text-[var(--text-2)]">
                كل مشروع في معرض أعمالنا مرفق بصور حقيقية من التنفيذ الفعلي في
                الرياض، وليست صورًا تسويقية عامة.
              </p>
            </div>
          </Reveal>
          <Reveal className="reveal-6">
            <div className={eeatCard}>
              <h3 className="m-0 mb-[10px] text-[16.5px]">
                متابعة بعد التسليم
              </h3>
              <p className="m-0 text-[13.5px] leading-[1.85] text-[var(--text-2)]">
                لا ينتهي التزامنا عند التسليم — نتابع مع العميل بعد التنفيذ
                للاطمئنان على النتيجة النهائية.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-48px))] py-[120px] max-[760px]:py-[70px]">
        <Reveal className={sectionHead}>
          <div>
            <p className={eyebrow}>كيف نعمل معك</p>
            <h2 className="m-0 text-[clamp(31px,3.4vw,49px)] font-semibold leading-[1.22] tracking-[-1.5px]">
              أربع خطوات
              <br />
              من الفكرة للتسليم.
            </h2>
          </div>
        </Reveal>
        <div className="flex flex-col border-s-2 border-[var(--border)] ms-1.5 ps-[26px]">
          <div className={timelineStep}>
            <b className="text-[13px] text-[var(--accent-warm)]">01</b>
            <span>
              تواصل أولي عبر واتساب أو نموذج طلب عرض السعر، وتحديد نوع الخدمة
              والمساحة.
            </span>
          </div>
          <div className={timelineStep}>
            <b className="text-[13px] text-[var(--accent-warm)]">02</b>
            <span>
              معاينة الموقع (أو مراجعة الصور المرسلة) واقتراح الخامات والحلول
              المناسبة.
            </span>
          </div>
          <div className={timelineStep}>
            <b className="text-[13px] text-[var(--accent-warm)]">03</b>
            <span>
              اتفاق واضح على التكلفة والجدول الزمني قبل بدء أي عمل فعلي.
            </span>
          </div>
          <div className={timelineStep}>
            <b className="text-[13px] text-[var(--accent-warm)]">04</b>
            <span>
              تنفيذ منظم، ثم تسليم نظيف ومتابعة بعد التسليم لأي ملاحظة.
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-48px))] py-[120px] max-[760px]:py-[70px]">
        <Reveal className={sectionHead}>
          <div>
            <p className={eyebrow}>تحقق من هويتنا</p>
            <h2 className="m-0 text-[clamp(31px,3.4vw,49px)] font-semibold leading-[1.22] tracking-[-1.5px]">
              معلومات تواصل
              <br />
              حقيقية وواضحة.
            </h2>
          </div>
          <p className="m-0 max-w-[330px] text-[15px] text-[var(--text-2)]">
            يمكنك التأكد من هويتنا والتواصل معنا مباشرة عبر أي من القنوات
            التالية.
          </p>
        </Reveal>
        <div className="grid grid-cols-3 gap-[18px] max-[760px]:grid-cols-1">
          <div className={eeatCard}>
            <h3 className="m-0 mb-[10px] text-[16.5px]">الهاتف / واتساب</h3>
            <p
              className="m-0 text-[13.5px] leading-[1.85] text-[var(--text-2)]"
              dir="ltr"
            >
              +{number}
            </p>
          </div>
          {settings.instagramUrl && (
            <div className={eeatCard}>
              <h3 className="m-0 mb-[10px] text-[16.5px]">إنستغرام</h3>
              <p className="m-0 text-[13.5px] leading-[1.85] text-[var(--text-2)]">
                <a href={settings.instagramUrl} target="_blank" rel="noopener">
                  صفحتنا الرسمية
                </a>
              </p>
            </div>
          )}
          <div className={eeatCard}>
            <h3 className="m-0 mb-[10px] text-[16.5px]">نطاق العمل</h3>
            <p className="m-0 text-[13.5px] leading-[1.85] text-[var(--text-2)]">
              الرياض، حي الدار البيضاء، شارع عرفات — وضواحي المدينة
            </p>
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="mx-auto w-[min(1180px,calc(100%-48px))] py-[120px] max-[760px]:py-[70px]">
          <Reveal className={sectionHead}>
            <div>
              <p className={eyebrow}>أسئلة شائعة عن الشركة</p>
              <h2 className="m-0 text-[clamp(31px,3.4vw,49px)] font-semibold leading-[1.22] tracking-[-1.5px]">
                إجابات مباشرة
                <br />
                عن أسلوب عملنا.
              </h2>
            </div>
          </Reveal>
          <div className="mx-auto flex max-w-[780px] flex-col gap-3">
            {faqs.map((f) => (
              <details
                className="group overflow-hidden rounded-[var(--radius-project-sm)] border border-[var(--border)] bg-[var(--surface)]"
                key={f.id}
              >
                <summary className="flex list-none cursor-pointer items-center justify-between gap-4 px-6 py-5 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <i className="flex-none not-italic text-[var(--accent-warm)] transition-transform duration-250 ease group-open:rotate-45">
                    +
                  </i>
                </summary>
                <p className="m-0 px-6 pb-[22px] text-sm leading-[1.9] text-[var(--text-2)]">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}
    </Shell>
  );
}
