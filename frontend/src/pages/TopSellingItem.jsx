import React, { useEffect } from "react";
import { useStatsStore } from "../store/statsStore";
import { TrendingUp, Star, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";

const TopSellingItem = () => {
  const { topItem, loading, error, fetchTopItem } = useStatsStore();

  useEffect(() => {
    fetchTopItem();
  }, [fetchTopItem]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading top item...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );

  if (!topItem)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        No data available.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="text-blue-500 w-8 h-8" />
          Top Selling Item
        </h1>
        <Link
          to="/admin/stats"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow"
        >
          ⬅ Back to Stats
        </Link>
      </div>

      {/* Card */}
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition">
        <img
          src={topItem.image_url}
          alt={topItem.name}
          className="w-48 h-48 object-cover rounded-full mx-auto border-4 border-blue-200 mb-6"
        />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <Star className="text-yellow-500" /> {topItem.name}
        </h2>
        <p className="text-gray-600 mb-3">{topItem.description}</p>
        <div className="flex justify-center items-center gap-2 text-lg font-bold text-green-600">
          <IndianRupee className="w-5 h-5" /> {topItem.price}
        </div>

        <div className="mt-6 flex justify-center">
          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full font-medium">
            Best Seller 🚀
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopSellingItem;
