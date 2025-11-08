import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useStatsStore } from "../store/statsStore";
import { User, Receipt, DollarSign } from "lucide-react";

const CustomerStats = () => {
  const { userId } = useParams();
  const { customerStats, loading, error, fetchCustomerStats } = useStatsStore();

  useEffect(() => {
    if (userId) fetchCustomerStats(userId);
  }, [userId, fetchCustomerStats]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading customer stats...
      </div>
    );

  if (error)
    return (
  <><div className="flex gap-20 mt-30 items-center mb-10 flex-col">
    <Link
          to="/admin/customer-stats"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow"
        >
          ⬅ Back to Customer - Stats
        </Link>
    <div className=" flex items-center justify-center text-gray-500 text-lg">
        No stats available for this customer.
      </div>
        

      </div>
      </>
    );

  if (!customerStats)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        No stats available for this customer.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <User className="text-blue-500 w-8 h-8" /> Customer Statistics
        </h1>
        <Link
          to="/admin/customer-stats"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow"
        >
          ⬅ Back to Customer - Stats
        </Link>
      </div>

      {/* Card */}
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <User className="w-10 h-10 text-blue-500" />
          </div>

          <h2 className="text-2xl font-semibold text-gray-800">
            👤 Customer ID: {customerStats.user_id}
          </h2>

          <div className="mt-6 flex flex-col gap-3">
            <div className="flex justify-center items-center gap-2 text-lg text-green-600">
              <Receipt className="w-6 h-6" />
              <span>Total Orders: {customerStats.totalOrders}</span>
            </div>

            <div className="flex justify-center items-center gap-2 text-lg text-emerald-600">
              <DollarSign className="w-6 h-6" />
              <span>Total Spent: ₹{customerStats.totalSpent}</span>
            </div>
          </div>

          <div className="mt-6">
            <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-medium">
              Customer ⭐
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerStats;
