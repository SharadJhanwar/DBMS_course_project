import { create } from "zustand";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/stats"; 

export const useStatsStore = create((set) => ({
  // 📊 States
  dashboard: null,
  customerStats: null,
  topItem: null,
  loading: false,
  error: null,

  // Fetch dashboard stats
  fetchDashboard: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(`${API_BASE}/dashboard`);
      set({ dashboard: data.data, loading: false });
    } catch (err) {
      set({ error: "Failed to load dashboard stats", loading: false });
    }
  },

  // Fetch customer stats
  fetchCustomerStats: async (userId) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(`${API_BASE}/customer/${userId}`);
      
      set({ customerStats: data, loading: false });
    } catch (err) {
      set({ error: "Failed to load customer stats", loading: false });
    }
  },

  // Fetch top-selling item details
  fetchTopItem: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(`${API_BASE}/top-item`);
      set({ topItem: data.topItem, loading: false });
    } catch (err) {
      set({ error: "Failed to load top item", loading: false });
    }
  },

  //  Reset store (optional)
  reset: () => set({ dashboard: null, customerStats: null, topItem: null, error: null }),
}));
