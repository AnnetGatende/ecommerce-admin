import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { storeId: string; orderId: string } }
) {
  try {
    const body = await req.json();
    const { trackingId } = body;

    if (!trackingId) {
      return new NextResponse("Tracking ID is required", { status: 400 });
    }

    // Verify that the order exists and belongs to the store
    const existingOrder = await prismadb.order.findFirst({
      where: {
        id: params.orderId,
        storeId: params.storeId,
      },
    });

    if (!existingOrder) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Check if tracking ID is already in use by another order
    const existingTrackingId = await prismadb.order.findFirst({
      where: {
        trackingId: trackingId,
        storeId: params.storeId,
        NOT: {
          id: params.orderId, // Exclude current order
        },
      },
    });

    if (existingTrackingId) {
      return new NextResponse("Tracking ID already in use", { status: 400 });
    }

    // Update the order with the new tracking ID
    const updatedOrder = await prismadb.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        trackingId: trackingId,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.log("[TRACKING_ID_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}