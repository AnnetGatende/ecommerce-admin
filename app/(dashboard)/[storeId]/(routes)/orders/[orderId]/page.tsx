// app/(dashboard)/[storeId]/(routes)/orders/[orderId]/page.tsx

import prismadb from "@/lib/prismadb";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AdminTracking from "../../tracker/page"; // Adjust path if needed

const OrderDetailPage = async ({ 
  params 
}: { 
  params: { storeId: string; orderId: string } 
}) => {
  // Fetch the order with nested relations
  const order = await prismadb.order.findFirst({
    where: {
      id: params.orderId,
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              images: true,       // Product images
              sizes: true,        // Array of available sizes
              colors: true,       // Array of available colors
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
    notFound();
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center gap-4">
          <Link href={`/${params.storeId}/orders`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Order Tracking</h1>
        </div>

        {/* Pass the order to AdminTracking */}
        <AdminTracking order={order} storeId={params.storeId} />
      </div>
    </div>
  );
};

export default OrderDetailPage;
