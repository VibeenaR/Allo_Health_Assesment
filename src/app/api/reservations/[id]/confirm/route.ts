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
      return NextResponse.json({ error: 'Invalid reservation identifier structure' }, { status: 400 });
    }

    await prisma.$transaction(async (tx: any) => {
      const reservation = await tx.reservation.findUnique({
        where: { id: reservationId },
      });

      if (!reservation || reservation.status !== 'PENDING') {
        throw new Error('RESERVATION_NOT_ELIGIBLE');
      }

      if (new Date() > new Date(reservation.expiresAt)) {
        throw new Error('RESERVATION_EXPIRED');
      }

      await tx.$executeRaw`
        UPDATE stocks 
        SET total_units = total_units - ${reservation.quantity},
            reserved_units = reserved_units - ${reservation.quantity}
        WHERE product_id = ${reservation.productId} AND warehouse_id = ${reservation.warehouseId}
      `;

      await tx.reservation.update({
        where: { id: reservationId },
        data: { status: 'CONFIRMED' },
      });
    });

    return NextResponse.json({ message: 'Transaction checkout completed successfully' }, { status: 200 });

  } catch (error: any) {
    if (error.message === 'RESERVATION_EXPIRED') {
      return NextResponse.json({ error: 'The temporary stock hold window has expired' }, { status: 410 });
    }
    if (error.message === 'RESERVATION_NOT_ELIGIBLE') {
      return NextResponse.json({ error: 'Reservation is not active or already finalized' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal capture execution failure' }, { status: 500 });
  }
}