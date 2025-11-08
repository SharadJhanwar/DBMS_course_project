import React, { useEffect, useState } from "react";
import useOrderStore from "../store/orderStore";
import { toast } from "react-hot-toast";

export default function AdminOrderManage() {
  const { orders, loading, fetchAllOrders, updateOrderStatus, error } = useOrderStore();
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    console.log("FETCHING ")
    fetchAllOrders();
  }, [fetchAllOrders]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleStatusChange = async (orderId, new_status) => {
    setUpdatingId(orderId);
    try {
      const result = await updateOrderStatus(orderId, new_status);
      if (result?.ok) {
        toast.success("Order status updated");
        await fetchAllOrders();
      } else {
        toast.error(result?.error || "Failed to update order");
      }
    } catch (err) {
      toast.error("Failed to update order");
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading all orders...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Manage Customer Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found yet.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-rose-600 text-white text-left">
                <th className="p-3">Order ID</th>
                <th className="p-3">User ID</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.order_id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium text-gray-700">{order.order_id}</td>
                  <td className="p-3 text-gray-600">{order.user_id}</td>
                  <td className="p-3 text-gray-600">₹{order.total_amount}</td>
                  <td className="p-3">
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
                  </td>
                  <td className="p-3 text-gray-500">
                    {new Date(order.order_date).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <select
                      disabled={updatingId === order.order_id}
                      onChange={(e) =>
                        handleStatusChange(order.order_id, e.target.value)
                      }
                      value={order.order_status}
                      className="border rounded-lg p-1 text-sm focus:ring-2 focus:ring-rose-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}