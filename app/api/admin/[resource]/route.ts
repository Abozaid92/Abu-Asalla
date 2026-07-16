import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getModel, isValidResource, createSchemas, tags, orderField, requireAdmin, unauthorized } from "../_shared";

export async function GET(_: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!isValidResource(resource) || !(await requireAdmin())) return unauthorized();

  const model = getModel(resource);
  const data =
    resource === "settings"
      ? // findUnique ممكن يرجّع null لو الصف مش موجود في الداتابيز (لو الـ
        // seed ما اتشغلش مثلًا) — upsert هنا بيضمن إن فيه صف دايمًا بدل ما
        // نرجّع null ويعلّق الكلاينت على "جارٍ التحميل..." للأبد.
        await prisma.siteSettings.upsert({
          where: { id: 1 },
          update: {},
          create: { id: 1 },
        })
      : await model.findMany({ orderBy: { [orderField[resource]]: "desc" } });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!isValidResource(resource) || !(await requireAdmin())) return unauthorized();

  const schema = createSchemas[resource];
  if (!schema) {
    return NextResponse.json({ error: "هذا المورد يُحدّث من صفحة مخصصة" }, { status: 400 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = await getModel(resource).create({ data: parsed.data });
  revalidateTag(tags[resource]);
  return NextResponse.json(data, { status: 201 });
}
