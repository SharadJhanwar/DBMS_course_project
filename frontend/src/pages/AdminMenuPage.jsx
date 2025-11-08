import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminMenuPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
    is_available: true,
  });
  const [editingId, setEditingId] = useState(null);
  const API_URL = "http://localhost:5000/api/items";

  // Fetch items & categories
  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (err) {
      console.error("❌ Error fetching menu items:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("❌ Error fetching categories:", err);
    }
  };

  // Handle add/edit submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        alert("✅ Item updated successfully");
      } else {
        await axios.post(API_URL, formData);
        alert("✅ Item added successfully");
      }
      setFormData({
        name: "",
        description: "",
        price: "",
        image_url: "",
        category_id: "",
        is_available: true,
      });
      setEditingId(null);
      fetchItems();
    } catch (err) {
      console.error("❌ Error saving item:", err);
    }
  };

  // Edit item
  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      image_url: item.image_url,
      category_id: item.category_id,
      is_available: item.is_available,
    });
    setEditingId(item.item_id);
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("🗑️ Item deleted successfully");
      fetchItems();
    } catch (err) {
      console.error("❌ Error deleting item:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🍽 Manage Menu Items</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="Item Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 rounded-md"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="border p-2 rounded-md"
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="border p-2 rounded-md col-span-1 md:col-span-2"
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="border p-2 rounded-md col-span-1 md:col-span-2"
        ></textarea>

        {/* Category */}
        <select
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          className="border p-2 rounded-md"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.category_name}
            </option>
          ))}
        </select>

        {/* Availability */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.is_available}
            onChange={(e) =>
              setFormData({ ...formData, is_available: e.target.checked })
            }
          />
          <span>Available</span>
        </label>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 md:col-span-2"
        >
          {editingId ? "Update Item" : "Add Item"}
        </button>
      </form>

      {/* Items Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Available</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.item_id} className="border-t hover:bg-gray-50">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.category_name}</td>
                <td className="p-3">₹{item.price}</td>
                <td className="p-3">
                  {item.is_available ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-500 font-semibold">No</span>
                  )}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.item_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
