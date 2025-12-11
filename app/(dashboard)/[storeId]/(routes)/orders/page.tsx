import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              sizes: true,
              colors: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    county: item.county,
    customerName: item.customerName,
    idNumber: item.idNumber,
    customerEmail: item.customerEmail ?? "",
    trackingId: item.trackingId ?? "",
    products: item.orderItems
      .map((orderItem) => {
        const sizeNames = orderItem.product.sizes?.map((s) => s.name).join("/") || "No size";
        const colorNames = orderItem.product.colors?.map((c) => c.name).join("/") || "No color";
        return `${orderItem.product.name} (${orderItem.quantity}) [${sizeNames}] [${colorNames}]`;
      })
      .join(", "),
    sizes: Array.from(
      new Set(
        item.orderItems
          .flatMap((orderItem) => orderItem.product.sizes?.map((s) => s.name) || [])
      )
    ).join(", "),
    colors: Array.from(
      new Set(
        item.orderItems
          .flatMap((orderItem) => orderItem.product.colors?.map((c) => c.name) || [])
      )
    ).join(", "),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.product.price) * item.quantity;
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
