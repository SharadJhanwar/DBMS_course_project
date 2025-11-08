import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useStatsStore } from "../store/statsStore";
import {
  Users,
  ShoppingCart,
  DollarSign,
  BarChart2,
  List,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const StatsDashboard = () => {
  const { dashboard, loading, error, fetchDashboard } = useStatsStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Loading dashboard...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );

  if (!dashboard) return null;

  const stats = [
    {
      title: "Total Customers",
      value: dashboard.totalCustomers,
      icon: <Users className="w-8 h-8 text-blue-500" />,
      color: "bg-blue-100",
    },
    {
      title: "Total Orders",
      value: dashboard.totalOrders,
      icon: <ShoppingCart className="w-8 h-8 text-green-500" />,
      color: "bg-green-100",
    },
    {
      title: "Total Revenue",
      value: `₹${dashboard.totalRevenue}`,
      icon: <DollarSign className="w-8 h-8 text-emerald-500" />,
      color: "bg-emerald-100",
    },
    {
      title: "Average Order Value",
      value: `₹${dashboard.avgOrderValue}`,
      icon: <BarChart2 className="w-8 h-8 text-indigo-500" />,
      color: "bg-indigo-100",
    },
    {
      title: "Avg Orders / Customer",
      value: dashboard.avgOrdersPerCustomer,
      icon: <List className="w-8 h-8 text-orange-500" />,
      color: "bg-orange-100",
    },
    {
      title: "Pending Orders",
      value: dashboard.pendingOrders,
      icon: <Clock className="w-8 h-8 text-yellow-500" />,
      color: "bg-yellow-100",
    },
    {
      title: "Total Menu Items",
      value: dashboard.totalMenuItems,
      icon: <List className="w-8 h-8 text-pink-500" />,
      color: "bg-pink-100",
    },
  ];

  // Dummy monthly trends (you can later fetch from backend)
  const monthlyTrends = [
    { month: "Jan", revenue: 12000, orders: 150 },
    { month: "Feb", revenue: 14500, orders: 180 },
    { month: "Mar", revenue: 17500, orders: 200 },
    { month: "Apr", revenue: 19800, orders: 240 },
    { month: "May", revenue: 22500, orders: 260 },
    { month: "Jun", revenue: 24300, orders: 290 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          📊 Restaurant Statistics
        </h1>
        <button
          onClick={fetchDashboard}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
        >
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-5 hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${stat.color}`}
            >
              {stat.icon}
            </div>
            <div>
              <h2 className="text-gray-600 text-sm font-semibold uppercase">
                {stat.title}
              </h2>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Trend Visualization */}
      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-blue-500" /> Revenue by Month
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-500" /> Orders Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#10b981"
                strokeWidth={3}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-12 bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">🔗 Quick Links</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/top-item"
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium px-4 py-2 rounded-lg transition"
          >
            View Top Selling Item
          </Link>
          <Link
            to="/admin/customer-stats"
            className="bg-green-100 hover:bg-green-200 text-green-800 font-medium px-4 py-2 rounded-lg transition"
          >
            View Customer Stats
          </Link>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-12 bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">💡 Insights</h2>
        <p className="text-gray-600 leading-relaxed">
          Your restaurant has served{" "}
          <strong>{dashboard.totalOrders}</strong> orders so far, generating a
          total revenue of{" "}
          <strong>₹{dashboard.totalRevenue}</strong> from{" "}
          <strong>{dashboard.totalCustomers}</strong> customers. Each customer
          makes an average of{" "}
          <strong>{dashboard.avgOrdersPerCustomer}</strong> orders, with an
          average order value of{" "}
          <strong>₹{dashboard.avgOrderValue}</strong>. Keep it up! 🚀
        </p>
      </div>
    </div>
  );
};

export default StatsDashboard;
