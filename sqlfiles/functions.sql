-- Total Customers
DELIMITER $$
CREATE FUNCTION total_customers()
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total INT DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET total = 0;

    SELECT COUNT(*) INTO total FROM users WHERE role = 'customer';
    RETURN total;
END $$
DELIMITER ;


-- Total Orders
DELIMITER $$
CREATE FUNCTION total_orders()
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total INT DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET total = 0;

    SELECT COUNT(*) INTO total FROM orders;
    RETURN total;
END $$
DELIMITER ;


-- Total revenue (Sum of Successful payments)
DELIMITER $$
CREATE FUNCTION total_revenue()
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE revenue DECIMAL(10,2) DEFAULT 0.00;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET revenue = 0.00;

    SELECT IFNULL(SUM(amount), 0) INTO revenue
    FROM payments
    WHERE payment_status = 'successful';

    RETURN revenue;
END $$
DELIMITER ;


-- Average Order Value
DELIMITER $$
CREATE FUNCTION avg_order_value()
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE avg_value DECIMAL(10,2) DEFAULT 0.00;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET avg_value = 0.00;

    SELECT IFNULL(AVG(total_amount), 0) INTO avg_value
    FROM orders
    WHERE order_status IN ('completed', 'preparing');

    RETURN avg_value;
END $$
DELIMITER ;


-- Average Orders per Customer
DELIMITER $$
CREATE FUNCTION avg_orders_per_customer()
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE avg_orders DECIMAL(10,2) DEFAULT 0.00;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET avg_orders = 0.00;

    SELECT IFNULL(COUNT(*) / NULLIF((SELECT COUNT(*) FROM users WHERE role='customer'),0), 0)
    INTO avg_orders
    FROM orders;

    RETURN avg_orders;
END $$
DELIMITER ;


-- Total Menu Items
DELIMITER $$
CREATE FUNCTION total_menu_items()
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total INT DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET total = 0;

    SELECT COUNT(*) INTO total FROM menu_items;
    RETURN total;
END $$
DELIMITER ;


-- Total Orders by Specific Customer
DELIMITER $$
CREATE FUNCTION total_orders_by_customer(p_user_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total INT DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET total = 0;

    SELECT COUNT(*) INTO total FROM orders WHERE user_id = p_user_id;
    RETURN total;
END $$
DELIMITER ;
/* Example:
SELECT total_orders_by_customer(3);
*/


-- Total Spent by a Customer
DELIMITER $$
CREATE FUNCTION total_spent_by_customer(p_user_id INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE total_spent DECIMAL(10,2) DEFAULT 0.00;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET total_spent = 0.00;

    SELECT IFNULL(SUM(p.amount), 0) INTO total_spent
    FROM payments p
    JOIN orders o ON p.order_id = o.order_id
    WHERE o.user_id = p_user_id AND p.payment_status = 'successful';

    RETURN total_spent;
END $$
DELIMITER ;


-- Top Selling Item ID
DELIMITER $$
CREATE FUNCTION top_selling_item()
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE item INT DEFAULT NULL;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET item = NULL;

    SELECT item_id INTO item
    FROM order_items
    GROUP BY item_id
    ORDER BY SUM(quantity) DESC
    LIMIT 1;

    RETURN item;
END $$
DELIMITER ;
/* Example:
SELECT name FROM menu_items WHERE item_id = top_selling_item();
*/


-- Get Pending Orders Count
DELIMITER $$
CREATE FUNCTION pending_orders_count()
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total INT DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET total = 0;

    SELECT COUNT(*) INTO total FROM orders WHERE order_status = 'pending';
    RETURN total;
END $$
DELIMITER ;


-- Orders by Month, Year
DELIMITER $$
CREATE FUNCTION orders_by_month(month_val INT, year_val INT)
RETURNS INT
DETERMINISTIC
BEGIN
  DECLARE total INT DEFAULT 0;
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET total = 0;

  SELECT COUNT(*) INTO total
  FROM orders
  WHERE MONTH(order_date) = month_val
    AND YEAR(order_date) = year_val;

  RETURN total;
END $$
DELIMITER ;


-- Revenue by Month, Year (fixed variables)
DELIMITER $$
CREATE FUNCTION revenue_by_month(month_val INT, year_val INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
  DECLARE total DECIMAL(10,2) DEFAULT 0.00;
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET total = 0.00;
  
  SELECT IFNULL(SUM(total_amount), 0.00) INTO total
  FROM orders
  WHERE MONTH(order_date) = month_val
    AND YEAR(order_date) = year_val
    AND order_status = 'completed';

  RETURN total;
END $$
DELIMITER ;