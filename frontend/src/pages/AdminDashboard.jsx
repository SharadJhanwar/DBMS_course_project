import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-11/12 max-w-5xl">
        {/* Manage Menu */}
        <Link
          to="/admin/menu"
          className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3595/3595455.png"
            alt="Menu Icon"
            className="w-20 h-20 mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700">Manage Menu Items</h2>
          <p className="text-gray-500 text-center mt-2">
            Add, edit, or delete menu items for ZaikaRestro.
          </p>
        </Link>

        {/* Manage Orders */}
        <Link
          to="/admin/orders"
          className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2942/2942077.png"
            alt="Orders Icon"
            className="w-20 h-20 mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700">Manage Orders</h2>
          <p className="text-gray-500 text-center mt-2">
            View, update status, and track all customer orders.
          </p>
        </Link>

        {/* 📊 View Stats */}
        <Link
          to="/admin/stats"
          className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/991/991952.png"
            alt="Stats Icon"
            className="w-20 h-20 mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700">View Statistics</h2>
          <p className="text-gray-500 text-center mt-2">
            Check total revenue, orders, and customer insights.
          </p>
        </Link>
      </div>
    </div>
  );
}
