import db from '../config/db.js';

// 🟢 Get user cart
export const getCartByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT c.cart_id, c.quantity, m.item_id, m.name, m.price, m.image_url 
       FROM cart_items c 
       JOIN menu_items m ON c.item_id = m.item_id 
       WHERE c.user_id = ?`, 
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};

// 🟢 Add item to cart
export const addToCart = async (req, res) => {
  const { user_id, item_id, quantity } = req.body;

  try {
    // Check if already exists
    const [existing] = await db.query(
      `SELECT * FROM cart_items WHERE user_id = ? AND item_id = ?`, 
      [user_id, item_id]
    );

    if (existing.length > 0) {
      // Update quantity
      await db.query(
        `UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND item_id = ?`,
        [quantity, user_id, item_id]
      );
    } else {
      await db.query(
        `INSERT INTO cart_items (user_id, item_id, quantity) VALUES (?, ?, ?)`,
        [user_id, item_id, quantity]
      );
    }
    res.json({ message: 'Item added/updated in cart' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
};

// 🟢 Update quantity
export const updateCartItem = async (req, res) => {
  const { cartId } = req.params;
  const { quantity } = req.body;

  try {
    await db.query(`UPDATE cart_items SET quantity = ? WHERE cart_id = ?`, [quantity, cartId]);
    res.json({ message: 'Quantity updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating cart item', error: err.message });
  }
};

// 🟢 Remove item
export const removeCartItem = async (req, res) => {
  const { cartId } = req.params;
  try {
    await db.query(`DELETE FROM cart_items WHERE cart_id = ?`, [cartId]);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing item', error: err.message });
  }
};

// 🟢 Clear entire cart
export const clearCart = async (req, res) => {
  const { userId } = req.params;
  try {
    await db.query(`DELETE FROM cart_items WHERE user_id = ?`, [userId]);
    res.json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing cart', error: err.message });
  }
};
