"use client";
import { FormEvent, useState } from "react";

type ServiceOption = { slug: string; name: string };

export function QuoteForm({ services = [] as ServiceOption[] }: { services?: ServiceOption[] }) {
  const [state, setState] = useState<"idle" | "sent" | "error">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const result = await fetch("/api/quote-request", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    setState(result.ok ? "sent" : "error");
  }

  if (state === "sent") {
    return (
      <div className="col-span-2 bg-[#393934] p-[25px]">شكرًا لك. تم استلام طلبك وسنتواصل معك قريبًا.</div>
    );
  }

  const inputClasses =
    "mt-[5px] block w-full border border-[#66635e] bg-transparent p-3 text-[14px] font-inherit text-white outline-none placeholder:text-[#aaa]";

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-[17px] max-[480px]:grid-cols-1">
      <label className="text-xs text-[#d8d6d1]">
        الاسم
        <input required name="name" placeholder="اكتب اسمك" className={inputClasses} />
      </label>
      <label className="text-xs text-[#d8d6d1]">
        رقم الجوال
        <input required name="phone" inputMode="tel" placeholder="05XXXXXXXX" className={inputClasses} />
      </label>
      <label className="col-span-2 text-xs text-[#d8d6d1] max-[480px]:col-span-1">
        نوع الخدمة
        <select name="service" defaultValue="" className={`${inputClasses} [&_option]:text-[#111]`}>
          <option value="" disabled>
            اختر الخدمة
          </option>
          {services.map((s) => (
            <option key={s.slug}>{s.name}</option>
          ))}
        </select>
      </label>
      <label className="col-span-2 text-xs text-[#d8d6d1] max-[480px]:col-span-1">
        نبذة عن المشروع
        <textarea name="notes" placeholder="المساحة، الحي، وما تحتاجه…" rows={3} className={`${inputClasses} resize-y`} />
      </label>
      {state === "error" && (
        <p className="form-error col-span-2 m-0 text-[13px] text-[#ffb7a3] max-[480px]:col-span-1">تعذر إرسال الطلب. تواصل معنا عبر واتساب.</p>
      )}
      <button
        className="col-span-2 relative mt-1 inline-flex w-max items-center justify-center gap-5 overflow-hidden rounded-full bg-white px-6 py-[15px] text-sm font-semibold text-[var(--accent)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(23,22,28,0.22)] max-[480px]:col-span-1 max-[480px]:w-full"
        type="submit"
      >
        إرسال طلب عرض السعر <span className="relative text-[19px] leading-none">←</span>
      </button>
    </form>
  );
}
