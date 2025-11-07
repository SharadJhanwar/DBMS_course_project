import db from "../config/db.js";

// Helper function to call SQL function
async function callFunction(funcName, params = []) {
  const placeholders = params.map(() => "?").join(",");
  const [rows] = await db.query(`SELECT ${funcName}(${placeholders}) AS result`, params);
  return rows[0].result;
}

export const getDashboardStats = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1; // JS months are 0-indexed
    const currentYear = new Date().getFullYear();

    const [
      totalCustomers,
      totalOrders,
      totalRevenue,
      avgOrderValue,
      avgOrdersPerCustomer,
      totalMenuItems,
      pendingOrders,
      monthlyOrders,
      monthlyRevenue,
    ] = await Promise.all([
      callFunction("total_customers"),
      callFunction("total_orders"),
      callFunction("total_revenue"),
      callFunction("avg_order_value"),
      callFunction("avg_orders_per_customer"),
      callFunction("total_menu_items"),
      callFunction("pending_orders_count"),
      callFunction("orders_by_month", [currentMonth, currentYear]),
      callFunction("revenue_by_month", [currentMonth, currentYear]),
    ]);

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalOrders,
        totalRevenue,
        avgOrderValue,
        avgOrdersPerCustomer,
        totalMenuItems,
        pendingOrders,
        monthlyOrders,
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
};


export const getCustomerStats = async (req, res) => {
  console.log(req.params)
  const { user_id } = req.params;
  const userId = user_id
  try {
    // Check if user exists
    const [user] = await db.query("SELECT * FROM users WHERE user_id = ?", [userId]);

    if (user.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Fetch stats
    const [orders] = await db.query("SELECT total_orders_by_customer(?) AS totalOrders", [userId]);
    const [spent] = await db.query("SELECT total_spent_by_customer(?) AS totalSpent", [userId]);

    res.json({
      user_id: userId,
      totalOrders: orders[0].totalOrders,
      totalSpent: spent[0].totalSpent,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getTopSellingItem = async (req, res) => {
  try {
    const itemId = await callFunction("top_selling_item");

    // Join with menu_items table for details
    const [rows] = await db.query("SELECT * FROM menu_items WHERE item_id = ?", [itemId]);
    res.json({ success: true, topItem: rows[0] || null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching top selling item" });
  }
};
