import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string; orderId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!params.orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    const order = await prismadb.order.findUnique({
      where: {
        id: params.orderId,
        storeId: params.storeId,
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
        trackingUpdates: {
          orderBy: {
            timestamp: 'desc',
          },
        },
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const transformedOrder = {
      id: order.id,
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      county: order.county,
      customerEmail: order.customerEmail,
      trackingId: order.trackingId,
      deliveryStatus: order.deliveryStatus,
      isPaid: order.isPaid,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: order.orderItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          images: item.product.images,
        },
      })),
      trackingUpdates: order.trackingUpdates.map(update => ({
        id: update.id,
        status: update.status,
        location: update.location,
        note: update.note,
        timestamp: update.timestamp,
      })),
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error("[ORDER_BY_ID_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}