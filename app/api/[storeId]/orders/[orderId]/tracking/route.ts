import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string; orderId: string } }
) {
  try {
    const body = await req.json();
    const { status, location, note } = body;

    if (!status) {
      return new NextResponse("Status is required", { status: 400 });
    }

    // Verify that the order exists and belongs to the store
    const order = await prismadb.order.findFirst({
      where: {
        id: params.orderId,
        storeId: params.storeId,
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Create the tracking update
    const trackingUpdate = await prismadb.trackingUpdate.create({
      data: {
        orderId: params.orderId,
        status,
        location: location || null,
        note: note || null,
        timestamp: new Date(),
      },
    });

    return NextResponse.json(trackingUpdate);
  } catch (error) {
    console.log("[TRACKING_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}