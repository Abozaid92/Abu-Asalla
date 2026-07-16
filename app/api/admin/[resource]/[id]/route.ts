import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getModel, isValidResource, createSchemas, tags, requireAdmin, unauthorized, type Resource } from "../../_shared";

// كل الموديلات التانية عندها id من نوع String (cuid)، لكن SiteSettings.id
// من نوع Int (@id @default(1)) — لازم نحوّله وإلا Prisma هيرمي validation
// error ("Expected Int, provided String") في كل عملية PATCH/GET/DELETE
// عليه، لأن params.id بييجي دايمًا كـ string من الـ URL.
function idFor(resource: Resource, rawId: string): string | number {
  return resource === "settings" ? Number(rawId) : rawId;
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  if (!isValidResource(resource) || !(await requireAdmin())) return unauthorized();
  const data = await getModel(resource).findUnique({ where: { id: idFor(resource, id) } });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  if (!isValidResource(resource) || !(await requireAdmin())) return unauthorized();

  const schema = createSchemas[resource];
  if (!schema) {
    return NextResponse.json({ error: "هذا المورد يُحدّث من صفحة مخصصة" }, { status: 400 });
  }

  // partial() عشان PATCH تقدر تبعت حقول جزئية بس (مش كل الحقول زي POST).
  const parsed = (schema as any).partial().safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = await getModel(resource).update({ where: { id: idFor(resource, id) }, data: parsed.data });
  revalidateTag(tags[resource]);
  return NextResponse.json(data);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  if (!isValidResource(resource) || !(await requireAdmin())) return unauthorized();
  await getModel(resource).delete({ where: { id: idFor(resource, id) } });
  revalidateTag(tags[resource]);
  return new NextResponse(null, { status: 204 });
}
