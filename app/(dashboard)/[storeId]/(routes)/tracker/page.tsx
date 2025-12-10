"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Clock, User, Phone, Mail, CreditCard } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { Decimal } from "@prisma/client/runtime/library";

interface Product {
  id: string;
  name: string;
  price: Decimal; // Use Prisma's Decimal type
  storeId: string;
  categoryId: string;
  isFeatured: boolean;
  isArchived: boolean;
  sizeId: string;
  colorId: string;
  createdAt: Date;
  updatedAt: Date;
  images: { 
    id: string;
    url: string; 
    createdAt: Date;
    productId: string;
    updatedat: Date;
  }[];
}

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  product: Product;
}

interface TrackingUpdate {
  id: string;
  orderId: string;
  status: string;
  location: string | null;
  note: string | null;
  timestamp: Date;
}

interface Order {
  id: string;
  storeId: string;
  phone: string;
  address: string;
  county: string;
  customerName: string;
  idNumber: string;
  isPaid: boolean;
  customerEmail: string | null;
  trackingId: string | null;
  deliveryStatus: string;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItem[];
  trackingUpdates: TrackingUpdate[];
}

interface AdminTrackingProps {
  order: Order;
  storeId: string;
}

const AdminTracking = ({ order, storeId }: AdminTrackingProps) => {
  const [trackingId, setTrackingId] = useState(order.trackingId || "");
  const [newStatus, setNewStatus] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newNote, setNewNote] = useState(""); // Changed from newDescription to newNote
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate total price from order items
  const totalPrice = order.orderItems.reduce((total, item) => {
    return total + (item.quantity * Number(item.product.price.toString()));
  }, 0);

  const handleUpdateTracking = async () => {
    if (!newStatus.trim()) {
      toast.error("Status is required");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/${storeId}/orders/${order.id}/tracking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          location: newLocation || null,
          note: newNote || null, // Changed from description to note
        }),
      });

      if (response.ok) {
        toast.success("Tracking updated successfully");
        setNewStatus("");
        setNewLocation("");
        setNewNote(""); // Changed from setNewDescription
        // Refresh the page to show new updates
        window.location.reload();
      } else {
        toast.error("Failed to update tracking");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignTrackingId = async () => {
    if (!trackingId.trim()) {
      toast.error("Tracking ID is required");
      return;
    }

    try {
      const response = await fetch(`/api/${storeId}/orders/${order.id}/tracking-id`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trackingId: trackingId,
        }),
      });

      if (response.ok) {
        toast.success("Tracking ID assigned successfully");
        window.location.reload();
      } else {
        toast.error("Failed to assign tracking ID");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Customer:</span>
              <span className="text-sm">{order.customerName || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Phone:</span>
              <span className="text-sm">{order.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm">{order.customerEmail || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Address:</span>
              <span className="text-sm">{order.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">County:</span>
              <span className="text-sm">{order.county}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Total:</span>
              <span className="text-sm font-semibold">KSh {totalPrice.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={order.isPaid ? "default" : "destructive"}>
              {order.isPaid ? "Paid" : "Pending Payment"}
            </Badge>
            <Badge variant="outline">
              Order #{order.id.slice(-8)}
            </Badge>
            <Badge variant="outline">
              {format(new Date(order.createdAt), "MMM dd, yyyy")}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                {item.product.images[0] && (
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity} × KSh {Number(item.product.price.toString()).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    KSh {(item.quantity * Number(item.product.price.toString())).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tracking ID Management */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking ID</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter tracking ID"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
            />
            <Button onClick={handleAssignTrackingId}>
              {order.trackingId ? "Update" : "Assign"} Tracking ID
            </Button>
          </div>
          {order.trackingId && (
            <p className="mt-2 text-sm text-gray-600">
              Current Tracking ID: <span className="font-mono">{order.trackingId}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Add Tracking Update */}
      <Card>
        <CardHeader>
          <CardTitle>Add Tracking Update</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Input
                placeholder="e.g., In Transit, Delivered, etc."
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                placeholder="e.g., Nairobi Hub, Out for Delivery"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Note</label>
            <Textarea
              placeholder="Additional details about this update..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
          </div>
          <Button onClick={handleUpdateTracking} disabled={isUpdating}>
            {isUpdating ? "Adding Update..." : "Add Tracking Update"}
          </Button>
        </CardContent>
      </Card>

      {/* Tracking History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Tracking History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {order.trackingUpdates.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No tracking updates yet. Add the first update above.
            </p>
          ) : (
            <div className="space-y-4">
              {order.trackingUpdates.map((update, index) => (
                <div key={update.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    {index < order.trackingUpdates.length - 1 && (
                      <div className="w-px h-16 bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{update.status}</Badge>
                      {update.location && (
                        <span className="text-sm text-gray-500">• {update.location}</span>
                      )}
                    </div>
                    {update.note && (
                      <p className="text-sm text-gray-600 mb-1">{update.note}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {format(new Date(update.timestamp), "MMM dd, yyyy 'at' HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTracking;