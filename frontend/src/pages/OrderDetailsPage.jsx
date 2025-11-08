import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useOrderStore from "../store/orderStore";
import { toast } from "react-hot-toast";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { orderDetails, fetchOrderDetails, loading, error } = useOrderStore();

  useEffect(() => {
    if (id) fetchOrderDetails(id);
  }, [id, fetchOrderDetails]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading order details...
      </div>
    );

  if (!orderDetails)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No details found for this order.
      </div>
    );

  // Status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "preparing":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Order #{orderDetails.order_id}
        </h1>
        <Link
          to="/orders"
          className="text-rose-600 hover:underline font-medium"
        >
          ← Back to Orders
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <p className="font-medium text-gray-700">Status:</p>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              orderDetails.order_status
            )}`}
          >
            {orderDetails.order_status || "Unknown"}
          </span>
        </div>

        <p>
          <span className="font-medium">Total Amount:</span> ₹
          {orderDetails.total_amount || 0}
        </p>
        <p>
          <span className="font-medium">Payment Method:</span>{" "}
          {orderDetails.payment_method || "N/A"}
        </p>
        <p>
          <span className="font-medium">Date:</span>{" "}
          {orderDetails.order_date
            ? new Date(orderDetails.order_date).toLocaleString()
            : "N/A"}
        </p>

        {orderDetails.address && (
          <p>
            <span className="font-medium">Delivery Address:</span>{" "}
            {orderDetails.address}
          </p>
        )}

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Items Ordered:</h2>
          {orderDetails.items && orderDetails.items.length > 0 ? (
            <ul className="space-y-2">
              {orderDetails.items.map((item) => (
                <li
                  key={item.item_id}
                  className="border p-3 rounded-lg flex justify-between"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No items found for this order.</p>
          )}
        </div>
      </div>
    </div>
  );
}
