import db from "../config/db.js";

// Create Order
export const createOrder = async (req, res) => {
  const { user_id, items, total_amount, payment_method } = req.body;

  if (!user_id || !items?.length || !total_amount) {
    return res.status(400).json({ message: "Missing order data" });
  }

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // Create order record
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total_amount, order_status) VALUES (?, ?, 'pending')`,
      [user_id, total_amount]
    );
    const order_id = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items (order_id, item_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [order_id, item.item_id, item.quantity, item.price]
      );
    }
    let payment_status;
    // Create payment record
    if(payment_method == 'upi' || payment_method == 'card'){
      payment_status = 'completed'
    }
    await connection.query(
      `INSERT INTO payments (order_id, payment_method, amount, payment_status)
       VALUES (?, ?, ?, ?)`,
      [order_id, payment_method || "cash", total_amount,payment_status]
    );

    // Record order status history
    await connection.query(
      `INSERT INTO order_status_history (order_id, new_status, note)
       VALUES (?, 'pending', 'Order placed')`,
      [order_id]
    );

    await connection.commit();
    console.log("NEW ORDER : ",order_id)

    res.json({
      message: "Order created successfully",
      order_id,
    });
  } catch (err) {
    await connection.rollback();
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Error creating order" });
  } finally {
    connection.release();
  }
};

// Get all orders by user
export const getUserOrders = async (req, res) => {
  const { userId } = req.params;
  try {
    const [orders] = await db.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC`,
      [userId]
    );
    res.json(orders);
    console.log(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Get single order with items
export const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;
  try {
    const [[order]] = await db.query(`SELECT * FROM orders WHERE order_id = ?`, [orderId]);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const [items] = await db.query(
      `SELECT oi.*, mi.name, mi.image_url 
       FROM order_items oi 
       JOIN menu_items mi ON oi.item_id = mi.item_id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    res.json({ order, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching order details" });
  }
};

// Admin: update order status
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { new_status, admin_id, note } = req.body;

  try {
    const [[order]] = await db.query(`SELECT order_status FROM orders WHERE order_id = ?`, [orderId]);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await db.query(`UPDATE orders SET order_status = ? WHERE order_id = ?`, [new_status, orderId]);

    // record in history
    await db.query(
      `INSERT INTO order_status_history (order_id, previous_status, new_status, changed_by, note)
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, order.order_status, new_status, admin_id || null, note || null]
    );
    // also we have added trigger in sql so now whenever order_status is completed and payment_mode was cash cash a trigger will be called updating status of payment_status to completed

    res.json({ message: "Order status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating order status" });
  }
};

// get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o
       JOIN users u ON o.user_id = u.user_id
       ORDER BY o.order_date DESC`
    );
    res.json(orders);
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};
