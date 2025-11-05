import db from "../config/db.js";

// Get full profile info
export const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    // User basic info
    const [user] = await db.query("SELECT user_id, name, email, role FROM users WHERE user_id = ?", [userId]);

    if (user.length === 0) return res.status(404).json({ message: "User not found" });

    // Profile info
    const [profile] = await db.query("SELECT * FROM user_profiles WHERE user_id = ?", [userId]);

    // Addresses
    const [addresses] = await db.query("SELECT * FROM user_addresses WHERE user_id = ?", [userId]);

    res.json({
      user: user[0],
      profile: profile[0] || null,
      addresses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

// Create or update profile 
export const upsertUserProfile = async (req, res) => {
  console.log(req.body);
  const { userId } = req.params;
  const { phone, gender, date_of_birth, profile_image, bio } = req.body;

  try {
    // Convert empty strings to NULL (important for MySQL)
    const safePhone = phone?.trim() || null;
    const safeGender = gender?.trim() || "Other";
    const safeDob = date_of_birth && date_of_birth.trim() !== "" ? date_of_birth : null;
    const safeImg = profile_image?.trim() || null;
    const safeBio = bio?.trim() || null;

    const [existing] = await db.query("SELECT * FROM user_profiles WHERE user_id = ?", [userId]);

    if (existing.length > 0) {
      await db.query(
        `UPDATE user_profiles 
         SET phone=?, gender=?, date_of_birth=?, profile_image=?, bio=? 
         WHERE user_id=?`,
        [safePhone, safeGender, safeDob, safeImg, safeBio, userId]
      );
      return res.json({ message: "Profile updated successfully" });
    } else {
      await db.query(
        `INSERT INTO user_profiles (user_id, phone, gender, date_of_birth, profile_image, bio) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, safePhone, safeGender, safeDob, safeImg, safeBio]
      );
      return res.json({ message: "Profile created successfully" });
    }
  } catch (err) {
    console.error("Error updating/creating profile:", err);
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};


// Add address
export const addAddress = async (req, res) => {
  const { userId } = req.params;
  const { address_line1, address_line2, city, state, postal_code, country, label, phone, is_default } = req.body;

  try {
    if (is_default) {
      await db.query("UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?", [userId]);
    }

    await db.query(
      `INSERT INTO user_addresses 
       (user_id, address_line1, address_line2, city, state, postal_code, country, label, phone, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, address_line1, address_line2, city, state, postal_code, country, label, phone, is_default || false]
    );

    res.json({ message: "Address added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding address" });
  }
};

// Get all addresses
export const getAddresses = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM user_addresses WHERE user_id = ?", [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching addresses" });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  const { addressId } = req.params;
  const { address_line1, address_line2, city, state, postal_code, country, label, phone, is_default, user_id } = req.body;

  try {
    if (is_default) {
      await db.query("UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?", [user_id]);
    }

    await db.query(
      `UPDATE user_addresses
       SET address_line1=?, address_line2=?, city=?, state=?, postal_code=?, country=?, label=?, phone=?, is_default=? 
       WHERE address_id=?`,
      [address_line1, address_line2, city, state, postal_code, country, label, phone, is_default, addressId]
    );

    res.json({ message: "Address updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating address" });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  const { addressId } = req.params;
  try {
    await db.query("DELETE FROM user_addresses WHERE address_id = ?", [addressId]);
    res.json({ message: "Address deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting address" });
  }
};

// Set address as default
export const setDefaultAddress = async (req, res) => {
  const { addressId } = req.params;
  const { userId } = req.body;

  try {
    await db.query("UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?", [userId]);
    await db.query("UPDATE user_addresses SET is_default = TRUE WHERE address_id = ?", [addressId]);

    res.json({ message: "Default address updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error setting default address" });
  }
};
