import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, fetchCart, updateQuantity, removeItem, clearCart } = useCartStore();

  useEffect(() => {
    if (user?.id) fetchCart(user.id);
  }, [user?.id, fetchCart]);

  const total = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.cart_id} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-4">
                  <img src={item.image_url || "https://via.placeholder.com/60"} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-500">₹{item.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.cart_id, parseInt(e.target.value, 10), user.id)}
                    className="w-16 border rounded p-1 text-center"
                  />
                  <button onClick={() => removeItem(item.cart_id, user.id)} className="text-red-600 hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h3 className="text-xl font-semibold">Total: ₹{total.toFixed(2)}</h3>

            <div className="flex gap-3">
              <button onClick={() => clearCart(user.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                Clear Cart
              </button>

              <button
                onClick={() => navigate("/checkout")}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
