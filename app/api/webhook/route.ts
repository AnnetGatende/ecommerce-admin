import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = body.event;
    const data = body.data;

    console.log("🔔 Event Received:", event);
    console.log("📦 Data:", JSON.stringify(data, null, 2));

    if (event === "charge.success") {
      const metadata = data.metadata;
      const orderId = metadata?.orderId;

      if (!orderId) {
        console.error("❌ No orderId in metadata");
        return new NextResponse("Missing orderId", { status: 400 });
      }

      // Generate a tracking ID, e.g. TRACK-XXXXXX (6 random uppercase letters/numbers)
      const trackingId = `TRACK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const updatedOrder = await prismadb.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          trackingId,  // assign the tracking ID here
        },
        include: {
          orderItems: true,
        },
      });

      console.log("✅ Order marked as paid with trackingId:", updatedOrder.id, trackingId);
    }

    return new NextResponse("Webhook received", { status: 200 });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new NextResponse("Webhook failed", { status: 500 });
  }
}