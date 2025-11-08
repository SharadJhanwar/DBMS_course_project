import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useOrderStore from "../store/orderStore";
import { toast } from "react-hot-toast";

const OrdersPage = () => {
  const { user } = useAuthStore();
  const { orders, loading, fetchOrdersByUser, error } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) fetchOrdersByUser(user.id);
  }, [user, fetchOrdersByUser]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading your orders...
      </div>
    );

  if (!orders || orders.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        You haven’t placed any orders yet.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className="border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg text-gray-800">
                Order #{order.order_id}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.order_status === "completed"
                    ? "bg-green-100 text-green-700"
                    : order.order_status === "preparing"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.order_status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {order.order_status}
              </span>
            </div>

            <div className="mt-3 text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Total:</span> ₹{order.total_amount}
              </p>
              <p>
                <span className="font-medium">Placed on:</span>{" "}
                {new Date(order.order_date).toLocaleString()}
              </p>
              {order.address && (
                <p>
                  <span className="font-medium">Delivery Address:</span>{" "}
                  {order.address}
                </p>
              )}
            </div>

            {/* View details */}
            <button
              onClick={() => navigate(`/orders/${order.order_id}`)}
              className="mt-4 text-rose-600 font-medium hover:underline"
            >
              View Details →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
