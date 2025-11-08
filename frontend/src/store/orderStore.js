import { create } from "zustand";
import axios from "axios";

const API = "http://localhost:5000/api/orders";

const useOrderStore = create((set, get) => ({
  orders: [],
  orderDetails: null,
  loading: false,
  error: null,

  // Create a new order
  createOrder: async ({ user_id, items, total_amount, payment_method = "cash", address_id = null }) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API}/create`, {
        user_id,
        items,
        total_amount,
        payment_method,
        address_id,
      });
      set({ loading: false });
      return { ok: true, orderId: res.data.order_id };
    } catch (err) {
      console.error("createOrder error:", err);
      set({ loading: false, error: err?.response?.data?.message || err.message });
      return { ok: false, error: err?.response?.data?.message || err.message };
    }
  },

  // Fetch all orders for a specific user
  fetchOrdersByUser: async (userId) => {
    if (!userId) return;
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API}/user/${userId}`);
      set({ orders: res.data, loading: false });
      return res.data;
    } catch (err) {
      console.error("fetchOrdersByUser error:", err);
      set({ loading: false, error: err?.response?.data?.message || err.message });
    }
  },

  // Fetch details for a specific order
  fetchOrderDetails: async (orderId) => {
    if (!orderId) return;
    set({ loading: true, error: null, orderDetails: null });
    try {
      const res = await axios.get(`${API}/details/${orderId}`);
      console.log(res)
      // Normalize backend field names
      const data = {
        order_id: res.data.order.order_id,
        order_status: res.data.order.order_status || res.data.order.status,
        total_amount: res.data.order.total_amount,
        payment_method: res.data.order.payment_method,
        order_date: res.data.order.order_date || res.data.order.created_at,
        address: res.data.order.address,
        items: res.data.items || [],
      };

      set({ orderDetails: data, loading: false });
      return data;
    } catch (err) {
      console.error("fetchOrderDetails error:", err);
      set({ loading: false, error: err?.response?.data?.message || err.message });
    }
  },

  // Admin – fetch all orders
  fetchAllOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API}/all`);
      set({ orders: res.data, loading: false });
      return res.data;
    } catch (err) {
      console.error("fetchAllOrders error:", err);
      set({ loading: false, error: err?.response?.data?.message || err.message });
    }
  },

  // Admin – update order status
  updateOrderStatus: async (orderId, new_status, admin_id = null, note = null) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`${API}/status/${orderId}`, {
        new_status,
        admin_id,
        note,
      });
      set({ loading: false });
      return { ok: true, data: res.data };
    } catch (err) {
      console.error("updateOrderStatus error:", err);
      set({ loading: false, error: err?.response?.data?.message || err.message });
      return { ok: false, error: err?.response?.data?.message || err.message };
    }
  },
}));

export default useOrderStore;
