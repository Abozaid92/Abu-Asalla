import type { Metadata } from "next";
import "./globals.css";
import "./additions.css";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "أبو أصاله للدهانات والديكور | الرياض",
  description:
    "دهانات وديكورات عصرية في الرياض. اطلب عرض سعر مخصص وتواصل مباشرة مع أبو أصاله.",
};

const LOGO_URL =
  "https://res.cloudinary.com/dfhecwiib/image/upload/v1784031234/d82583e4-9a7c-4dee-9398-388c62a6dbde_jncrys.png";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  const phone = `+${settings.whatsappNumber.replace(/[^0-9]/g, "")}`;

  // Schema.org LocalBusiness structured data — يساعد جوجل يفهم هوية
  // الشركة ونشاطها الحقيقي (اسم، صورة، رقم تواصل، نطاق الخدمة)، وده
  // من أهم عناصر E-E-A-T الفعلية بدل النصوص وحدها.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "أبو أصاله للدهانات والديكور",
    image: LOGO_URL,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "شارع عرفات، حي الدار البيضاء",
      addressLocality: "الرياض",
      addressCountry: "SA",
    },
    areaServed: "الرياض",
    ...(settings.instagramUrl ? { sameAs: [settings.instagramUrl] } : {}),
  };

  return (
    <html lang="ar" dir="rtl">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
