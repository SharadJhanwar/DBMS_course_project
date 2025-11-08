// src/pages/CheckoutPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore";
import useProfileStore from "../store/profileStore";
import useAuthStore from "../store/authStore";
import useOrderStore from "../store/orderStore";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, fetchCart } = useCartStore();
  const { addresses, fetchProfile } = useProfileStore();
  const { createOrder } = useOrderStore();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCart(user.id);
    fetchProfile(user.id);
  }, [user?.id]);

  // compute total
  const total = items.reduce((s, it) => s + (it.price || 0) * it.quantity, 0);

  const onPlaceOrder = async () => {
    if (!user?.id) return alert("Please login");
    if (items.length === 0) return alert("Cart is empty");
    // ensure address selected - optional if you want allow pickup
    if (!selectedAddressId) return alert("Please select a delivery address");

    const payload = {
      user_id: user.id,
      items: items.map((it) => ({ item_id: it.item_id, quantity: it.quantity, price: it.price })),
      total_amount: total,
      payment_method: paymentMethod,
      address_id: selectedAddressId,
    };

    setPlacing(true);
    const result = await createOrder(payload);
    setPlacing(false);

    if (result.ok) {
      alert("Order placed! Order ID: " + result.orderId);
      // navigate to user's orders page (you should have /orders route)
      navigate("/orders");
    } else {
      alert("Failed to place order: " + JSON.stringify(result.error));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Delivery Address</h2>

          {addresses.length === 0 ? (
            <p className="text-gray-500">No addresses found — add one in Profile.</p>
          ) : (
            <div className="space-y-3">
              {addresses.map((a) => (
                <label key={a.address_id} className="border rounded p-3 block">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{a.label} {a.is_default ? <span className="text-xs text-orange-700 ml-2">Default</span> : null}</div>
                      <div className="text-sm">{a.address_line1}{a.address_line2 ? `, ${a.address_line2}` : ""}</div>
                      <div className="text-xs text-gray-500">{a.city}{a.state ? `, ${a.state}` : ""} {a.postal_code ? ` - ${a.postal_code}` : ""}</div>
                    </div>
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === a.address_id}
                      onChange={() => setSelectedAddressId(a.address_id)}
                    />
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Order Summary</h2>

          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.cart_id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-xs text-gray-500">₹{it.price} × {it.quantity}</div>
                  </div>
                  <div className="font-semibold">₹{(it.price * it.quantity).toFixed(2)}</div>
                </div>
              ))}
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <div>Total</div>
                <div>₹{total.toFixed(2)}</div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="p-2 border w-full">
                  <option value="cash">Cash on Delivery</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                </select>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={onPlaceOrder}
                  disabled={placing}
                  className="bg-orange-600 text-white px-4 py-2 rounded disabled:opacity-60"
                >
                  {placing ? "Placing order..." : `Place Order — ₹${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
