import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/cart'; 

const useCartStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,

  // Get cart for a specific user
  fetchCart: async (userId) => {
    try {
      set({ loading: true });
      const res = await axios.get(`${API_URL}/${userId}`);
      set({ items: res.data, loading: false });
    } catch (err) {
      console.error(err);
      set({ loading: false, error: err.message });
    }
  },

  // Add to cart
  addToCart: async (user_id, item_id, quantity = 1) => {
    console.log("CART ITEM FOR USER : ",user_id)
    try {
      await axios.post(`${API_URL}/add`, { user_id, item_id, quantity });
      await get().fetchCart(user_id);
    } catch (err) {
      console.error(err);
      set({ error: err.message });
    }
  },

  // Update item quantity
  updateQuantity: async (cartId, quantity, userId) => {
    try {
      await axios.put(`${API_URL}/update/${cartId}`, { quantity });
      await get().fetchCart(userId);
    } catch (err) {
      console.error(err);
      set({ error: err.message });
    }
  },

  // Remove item
  removeItem: async (cartId, userId) => {
    try {
      await axios.delete(`${API_URL}/remove/${cartId}`);
      await get().fetchCart(userId);
    } catch (err) {
      console.error(err);
      set({ error: err.message });
    }
  },

  // Clear entire cart
  clearCart: async (userId) => {
    try {
      await axios.delete(`${API_URL}/clear/${userId}`);
      set({ items: [] });
    } catch (err) {
      console.error(err);
      set({ error: err.message });
    }
  },
}));

export default useCartStore;