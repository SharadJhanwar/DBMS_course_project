import { create } from "zustand";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/profile";

const useProfileStore = create((set) => ({
  profile: null,
  addresses: [],
  loading: false,

  // Fetch profile + addresses together
  fetchProfile: async (userId) => {
    console.log(userId)
    if (!userId) return;
    set({ loading: true });
    try {
      const res = await axios.get(`${API_BASE}/${userId}`);
      set({
        profile: res.data.profile || null,
        addresses: res.data.addresses || [],
        loading: false,
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      set({ loading: false });
    }
  },

  // Upsert (save) profile
  saveProfile: async (userId, payload) => {
    console.log(userId)
    try {
      const res = await axios.post(`${API_BASE}/${userId}`, payload);
      set({ profile: res.data.profile });
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  },

  // Add address
  addAddress: async (userId, payload) => {
    try {
      const res = await axios.post(`${API_BASE}/${userId}/address`, payload);
      set((state) => ({ addresses: [res.data.address, ...state.addresses] }));
    } catch (err) {
      console.error("Error adding address:", err);
    }
  },

  // Update address
  updateAddress: async (addressId, payload) => {
    try {
      const res = await axios.put(`${API_BASE}/address/${addressId}`, payload);
      set((state) => ({
        addresses: state.addresses.map((a) =>
          a.address_id === addressId ? res.data.address : a
        ),
      }));
    } catch (err) {
      console.error("Error updating address:", err);
    }
  },

  // Delete address
  deleteAddress: async (addressId) => {
    try {
      await axios.delete(`${API_BASE}/address/${addressId}`);
      set((state) => ({
        addresses: state.addresses.filter((a) => a.address_id !== addressId),
      }));
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  },

  // Set default
  setDefault: async (addressId) => {
    try {
      await axios.patch(`${API_BASE}/address/${addressId}/default`);
      set((state) => ({
        addresses: state.addresses.map((a) => ({
          ...a,
          is_default: a.address_id === addressId ? 1 : 0,
        })),
      }));
    } catch (err) {
      console.error("Error setting default address:", err);
    }
  },
}));

export default useProfileStore;
