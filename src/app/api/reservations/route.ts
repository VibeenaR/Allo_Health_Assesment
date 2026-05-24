import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { productId, warehouseId, quantity } = await req.json();

  try {
    const reservation = await prisma.$transaction(async (tx) => {
      // Atomic update: only succeeds if stock >= reserved + quantity
      const stock = await tx.stock.findUnique({ where: { productId_warehouseId: { productId, warehouseId } }});
      
      const available = (stock?.totalUnits || 0) - (stock?.reservedUnits || 0);
      if (available < quantity) throw new Error("INSUFFICIENT_STOCK");

      await tx.stock.update({
        where: { productId_warehouseId: { productId, warehouseId } },
        data: { reservedUnits: { increment: quantity } }
      });

      return await tx.reservation.create({
        data: { 
          productId, 
          warehouseId, 
          quantity, 
          expiresAt: new Date(Date.now() + 600000) // 10 mins
        },
      });
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error: any) {
    if (error.message === "INSUFFICIENT_STOCK") {
      return NextResponse.json({ error: "Stock exhausted" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}