import React from "react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest" };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-orange-500 to-red-500 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-lg text-orange-100">
            Ready to order your favorite meal from ZaikaRestro?
          </p>
          <div className="mt-6">
            <Link
              to="/menu"
              className="bg-white text-orange-600 font-semibold px-6 py-2 rounded-full hover:bg-orange-100 transition"
            >
              Explore Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Your Orders"
          desc="Track your past and active orders easily."
          link="/orders"
        />
        <DashboardCard
          title="Profile Settings"
          desc="Update your info, address, and preferences."
          link="/profile"
        />
        <DashboardCard
          title="Exclusive Offers"
          desc="Check out latest discounts and combo meals!"
          link="/offers"
        />
      </section>
    </div>
  );
};

const DashboardCard = ({ title, desc, link }) => (
  <Link
    to={link}
    className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
  >
    <h2 className="text-xl font-semibold mb-2 text-orange-600">{title}</h2>
    <p className="text-gray-600 mb-4">{desc}</p>
    <span className="text-sm font-medium text-orange-500 hover:underline">
      Go →
    </span>
  </Link>
);

export default UserDashboard;
