import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X } from "lucide-react";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [cartReady, setCartReady] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const { user } = useAuthStore();
  const { items: cart, addToCart, updateQuantity, fetchCart, removeItem } =
    useCartStore();

  // 🟢 Fetch menu items
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/items");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error fetching menu:", err);
      } finally {
        setMenuLoading(false);
      }
    };
    loadMenu();
  }, []);

  // 🟢 Fetch cart items for user
  useEffect(() => {
    const loadCart = async () => {
      if (user?.id) {
        await fetchCart(user.id);
        setCartReady(true);
      }
    };
    loadCart();
  }, [user, fetchCart]);

  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category_name).filter(Boolean));
    return ["All", ...cats];
  }, [items]);

  const getCartItem = (itemId) => cart.find((c) => c.item_id === itemId);

  const handleAddToCart = async (itemId) => {
    if (!user) return alert("Please log in first!");
    try {
      await addToCart(user.id, itemId, 1);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleQuantityChange = async (cartId, newQty, itemId) => {
    try {
      if (newQty < 1) {
        await removeItem(cartId, user.id);
      } else {
        await updateQuantity(cartId, newQty, user.id);
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // 🧠 Apply filters + search
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCategory =
        selectedCategory === "All" || item.category_name === selectedCategory;
      const matchSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchPrice =
        item.price >= priceRange[0] && item.price <= priceRange[1];
      const matchAvailable = showAvailableOnly ? item.is_available === 1 : true;
      return matchCategory && matchSearch && matchPrice && matchAvailable;
    });
  }, [items, search, selectedCategory, priceRange, showAvailableOnly]);

  if (menuLoading || !cartReady)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="border-4 border-t-orange-500 border-gray-300 rounded-full w-10 h-10"
        ></motion.div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 🧭 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-orange-600 text-center sm:text-left">
          Explore Our Menu 🍽️
        </h1>

        {/* 🔍 Search */}
        <div className="flex items-center bg-white border rounded-lg shadow-sm px-3 py-1.5 w-full sm:w-80">
          <Search className="text-gray-500 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search dishes..."
            className="w-full focus:outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <X
              className="text-gray-400 cursor-pointer"
              size={16}
              onClick={() => setSearch("")}
            />
          )}
        </div>
      </div>

      {/* 🎚️ Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center justify-center sm:justify-start">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full border transition text-sm font-medium ${
              selectedCategory === cat
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white border-gray-300 text-gray-700 hover:bg-orange-50"
            }`}
          >
            {cat}
          </button>
        ))}

        <div className="flex items-center space-x-2 ml-auto sm:ml-4">
          <label className="text-sm text-gray-700 font-medium">
            Available Only
          </label>
          <input
            type="checkbox"
            checked={showAvailableOnly}
            onChange={(e) => setShowAvailableOnly(e.target.checked)}
          />
        </div>
      </div>

      {/* 🏷️ Price Range */}
      <div className="flex items-center gap-3 mb-8 justify-center sm:justify-start">
        <span className="text-gray-600 text-sm">₹{priceRange[0]}</span>
        <input
          type="range"
          min="0"
          max="1000"
          value={priceRange[1]}
          className="w-56 accent-orange-500"
          onChange={(e) => setPriceRange([0, +e.target.value])}
        />
        <span className="text-gray-600 text-sm">₹{priceRange[1]}</span>
      </div>

      {/* 🍲 Menu Grid */}
      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No items match your search or filters.
        </p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((item) => {
              const inCart = getCartItem(item.item_id);
              return (
                <motion.div
                  key={item.item_id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="border rounded-xl shadow-sm hover:shadow-lg transition bg-white overflow-hidden"
                >
                  <img
                    src={item.image_url || "https://via.placeholder.com/200"}
                    alt={item.name}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    <p className="font-bold text-orange-600 mb-3">
                      ₹{item.price}
                    </p>
                    {!inCart ? (
                      <button
                        onClick={() => handleAddToCart(item.item_id)}
                        className="w-full bg-orange-500 text-white py-1.5 rounded hover:bg-orange-600 transition text-sm"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              inCart.cart_id,
                              inCart.quantity - 1,
                              item.item_id
                            )
                          }
                          className="bg-gray-200 hover:bg-gray-300 px-2 rounded"
                        >
                          −
                        </button>
                        <span className="font-semibold text-gray-800">
                          {inCart.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              inCart.cart_id,
                              inCart.quantity + 1,
                              item.item_id
                            )
                          }
                          className="bg-gray-200 hover:bg-gray-300 px-2 rounded"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
