import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Use the shared client

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { stocks: { include: { warehouse: true } } },
    });
    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("API Error:", error);
    // Returning JSON here prevents the "Unexpected token '<'" error
    return NextResponse.json(
      { error: error.message || "Failed to load inventory" },
      { status: 500 }
    );
  }
}