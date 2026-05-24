import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reservationId = parseInt(id);

    if (isNaN(reservationId)) {
      return NextResponse.json({ error: 'Malformed path identifier argument' }, { status: 400 });
    }

    await prisma.$transaction(async (tx: any) => {
      const reservation = await tx.reservation.findUnique({
        where: { id: reservationId },
      });

      if (!reservation || reservation.status !== 'PENDING') {
        throw new Error('CANNOT_RELEASE');
      }

      await tx.$executeRaw`
        UPDATE stocks 
        SET reserved_units = reserved_units - ${reservation.quantity}
        WHERE product_id = ${reservation.productId} AND warehouse_id = ${reservation.warehouseId}
      `;

      await tx.reservation.update({
        where: { id: reservationId },
        data: { status: 'RELEASED' },
      });
    });

    return NextResponse.json({ message: 'Stock reservation successfully released' }, { status: 200 });

  } catch (error: any) {
    if (error.message === 'CANNOT_RELEASE') {
      return NextResponse.json({ error: 'Reservation hold cannot be dropped at this stage' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal cancellation routine failed' }, { status: 500 });
  }
}