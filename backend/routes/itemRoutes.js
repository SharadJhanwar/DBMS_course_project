import express from "express";
import db from "../config/db.js";

const router = express.Router();

// ✅ GET all menu items
router.get("/", async (req, res) => {
  console.log(req.method,"HEELO")
  try {
    const [rows] = await db.query(`
      SELECT 
        m.item_id, 
        m.name, 
        m.description, 
        m.price, 
        m.image_url, 
        m.is_available, 
        c.category_name
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.category_id
      ORDER BY m.item_id DESC
    `);
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching menu items:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ ADD new menu item
router.post("/", async (req, res) => {
  try {
    const { name, description, price, image_url, category_id, is_available } = req.body;
    if (!name || !price) return res.status(400).json({ message: "Name and price are required" });

    const [result] = await db.query(
      `INSERT INTO menu_items (name, description, price, image_url, category_id, is_available)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, price, image_url, category_id || null, is_available ?? true]
    );

    res.status(201).json({ message: "Item added successfully", id: result.insertId });
  } catch (err) {
    console.error("❌ Error adding item:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE menu item
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, category_id, is_available } = req.body;

    await db.query(
      `UPDATE menu_items
       SET name=?, description=?, price=?, image_url=?, category_id=?, is_available=?
       WHERE item_id=?`,
      [name, description, price, image_url, category_id || null, is_available ?? true, id]
    );

    res.status(200).json({ message: "Item updated successfully" });
  } catch (err) {
    console.error("❌ Error updating item:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE menu item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM menu_items WHERE item_id=?", [id]);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting item:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
