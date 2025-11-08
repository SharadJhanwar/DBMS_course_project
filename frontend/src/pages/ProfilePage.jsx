import React, { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useProfileStore from "../store/profileStore";

const AddressForm = ({ initial = {}, onSave, onCancel }) => {
  const [form, setForm] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    label: "Home",
    phone: "",
    is_default: false,
    ...initial,
  });

  useEffect(() => {
    setForm((prev) => {
      const same =
        JSON.stringify(prev) === JSON.stringify({ ...prev, ...initial });
      return same ? prev : { ...prev, ...initial };
    });
  }, [JSON.stringify(initial)]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <input
        className="w-full mb-2 p-2 border"
        name="address_line1"
        value={form.address_line1}
        onChange={handleChange}
        placeholder="Address line 1"
      />
      <input
        className="w-full mb-2 p-2 border"
        name="address_line2"
        value={form.address_line2}
        onChange={handleChange}
        placeholder="Address line 2"
      />
      <div className="flex gap-2">
        <input
          className="flex-1 mb-2 p-2 border"
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
        />
        <input
          className="flex-1 mb-2 p-2 border"
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
        />
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 mb-2 p-2 border"
          name="postal_code"
          value={form.postal_code}
          onChange={handleChange}
          placeholder="Postal code"
        />
        <input
          className="flex-1 mb-2 p-2 border"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
      </div>
      <div className="flex items-center gap-3 mb-2">
        <select
          name="label"
          value={form.label}
          onChange={handleChange}
          className="p-2 border"
        >
          <option>Home</option>
          <option>Work</option>
          <option>Other</option>
        </select>
        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Country"
          className="p-2 border flex-1"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_default"
            checked={form.is_default}
            onChange={handleChange}
          />
          Default
        </label>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onSave(form)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const {
    profile,
    addresses,
    loading,
    fetchProfile,
    saveProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefault,
  } = useProfileStore();

  const [showEditor, setShowEditor] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addingAddress, setAddingAddress] = useState(false);

  useEffect(() => {
    if (user?.id) fetchProfile(user.id);
  }, [user?.id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">Please log in to view your profile.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* USER INFO */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-xs text-gray-400">
              Member since:{" "}
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <hr className="my-4" />

        <h3 className="font-semibold mb-2">Profile</h3>

        {!showEditor ? (
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <strong>Phone:</strong> {profile?.phone || "-"}
            </p>
            <p>
              <strong>Gender:</strong> {profile?.gender || "-"}
            </p>
            <p>
              <strong>DOB:</strong> {profile?.date_of_birth || "-"}
            </p>
            <p>
              <strong>Bio:</strong> {profile?.bio || "-"}
            </p>
            <div className="mt-3">
              <button
                onClick={() => setShowEditor(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Update Profile
              </button>
            </div>
          </div>
        ) : (
          <ProfileEditor
            initial={profile}
            onSave={(data) => {
              saveProfile(user.id, data);
              setShowEditor(false);
            }}
            onCancel={() => setShowEditor(false)}
          />
        )}
      </div>

      {/* ADDRESSES */}
      <div className="bg-white shadow rounded p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Addresses</h3>
          <button
            onClick={() => setAddingAddress(true)}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Add Address
          </button>
        </div>

        {addingAddress && (
          <AddressForm
            onSave={(data) => {
              addAddress(user.id, data);
              setAddingAddress(false);
            }}
            onCancel={() => setAddingAddress(false)}
          />
        )}

        {addresses.length === 0 ? (
          <p className="text-gray-500">No saved addresses.</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((a) => (
              <div
                key={a.address_id}
                className="border rounded p-3 flex justify-between items-center"
              >
                <div>
                  <div className="text-sm font-semibold">
                    {a.label}{" "}
                    {a.is_default ? (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 rounded ml-2">
                        Default
                      </span>
                    ) : null}
                  </div>
                  <div className="text-sm text-gray-700">
                    {a.address_line1}
                    {a.address_line2 ? `, ${a.address_line2}` : ""}
                  </div>
                  <div className="text-xs text-gray-500">
                    {a.city} {a.state ? `, ${a.state}` : ""}{" "}
                    {a.postal_code ? ` - ${a.postal_code}` : ""}
                  </div>
                  <div className="text-xs text-gray-500">{a.phone}</div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingAddress(a)}
                      className="text-sm bg-gray-200 px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteAddress(a.address_id)}
                      className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                  {!a.is_default && (
                    <button
                      onClick={() => setDefault(a.address_id)}
                      className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded"
                    >
                      Make Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {editingAddress && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Edit Address</h4>
            <AddressForm
              initial={editingAddress}
              onSave={(data) => {
                updateAddress(editingAddress.address_id, data);
                setEditingAddress(null);
              }}
              onCancel={() => setEditingAddress(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// SMALL PROFILE EDITOR
const ProfileEditor = ({ initial = {}, onSave, onCancel }) => {
  const [form, setForm] = useState({
    phone: initial?.phone || "",
    gender: initial?.gender || "Other",
    date_of_birth: initial?.date_of_birth || "",
    profile_image: initial?.profile_image || "",
    bio: initial?.bio || "",
  });

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="border rounded p-4 bg-gray-50">
      <input
        name="phone"
        value={form.phone}
        onChange={onChange}
        className="w-full p-2 mb-2 border"
        placeholder="Phone"
      />
      <select
        name="gender"
        value={form.gender}
        onChange={onChange}
        className="w-full p-2 mb-2 border"
      >
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
      <input
        name="date_of_birth"
        type="date"
        value={form.date_of_birth}
        onChange={onChange}
        className="w-full p-2 mb-2 border"
      />
      <input
        name="profile_image"
        value={form.profile_image}
        onChange={onChange}
        className="w-full p-2 mb-2 border"
        placeholder="Profile image URL"
      />
      <textarea
        name="bio"
        value={form.bio}
        onChange={onChange}
        className="w-full p-2 mb-2 border"
        placeholder="Short bio"
      />
      <div className="flex gap-2">
        <button
          onClick={() => onSave(form)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
