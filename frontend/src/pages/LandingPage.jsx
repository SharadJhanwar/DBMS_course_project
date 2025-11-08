import React from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-orange-50 to-white text-gray-800">
      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center h-[85vh] text-center px-6 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-white"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Welcome to <span className="text-amber-400">ZaikaRestro</span> 🍴
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto">
            Experience the authentic flavors of India — delivered hot & fresh to
            your doorstep.
          </p>
          <a
            href="/menu"
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md"
          >
            Order Now
          </a>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8 md:px-20 text-center">
        <h2 className="text-3xl font-bold text-amber-700 mb-10">
          Why Choose ZaikaRestro?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png"
              alt="Fast Delivery"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Get your meals delivered quickly with our optimized delivery system.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png"
              alt="Fresh Ingredients"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Fresh Ingredients</h3>
            <p className="text-gray-600">
              We use only handpicked, quality ingredients in every dish.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/4359/4359927.png"
              alt="Great Taste"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Unforgettable Taste</h3>
            <p className="text-gray-600">
              From spicy curries to sweet desserts — every bite is a celebration.
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
