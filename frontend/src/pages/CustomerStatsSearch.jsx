import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, User } from "lucide-react";

const CustomerStatsSearch = () => {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId.trim()) {
      navigate(`/admin/customer-stats/${userId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-3xl mb-10">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <User className="text-blue-500 w-8 h-8" /> Customer Statistics Lookup
        </h1>
        <Link
          to="/admin/stats"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow"
        >
          ⬅ Back to Stats
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center hover:shadow-2xl transition">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Customer ID..."
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-3 px-4 pl-10 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerStatsSearch;
