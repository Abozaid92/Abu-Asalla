import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(8).max(25),
  service: z.string().max(120).optional(),
  notes: z.string().max(2000).optional(),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(`quote-request:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "طلبات كتير في وقت قصير، حاول تاني بعد شوية" }, { status: 429 });
  }

  try {
    const data = schema.parse(await request.json());
    const service = data.service
      ? await prisma.service.findFirst({ where: { name: data.service }, select: { id: true } })
      : null;

    const quote = await prisma.quoteRequest.create({
      data: { name: data.name, phone: data.phone, serviceId: service?.id, notes: data.notes },
    });

    return NextResponse.json({ id: quote.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "بيانات الطلب غير مكتملة" }, { status: 400 });
    }
    return NextResponse.json({ error: "تعذر حفظ الطلب" }, { status: 500 });
  }
}
