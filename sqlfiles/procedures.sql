
/*To get full user profile*/
DELIMITER $$

CREATE PROCEDURE GetUserFullProfile(IN p_user_id INT)
BEGIN
    -- Basic User Info
    SELECT user_id, name, email, role 
    FROM users 
    WHERE user_id = p_user_id;

    -- Profile Info
    SELECT * 
    FROM user_profiles 
    WHERE user_id = p_user_id;

    -- Addresses
    SELECT * 
    FROM user_addresses 
    WHERE user_id = p_user_id;
END $$

DELIMITER ;


/*This goes through each order and prints its user + total amount.*/

DELIMITER //

CREATE PROCEDURE list_orders_with_total()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE o_id INT;
    DECLARE u_id INT;
    DECLARE amt DECIMAL(10,2);

    DECLARE order_cursor CURSOR FOR
        SELECT order_id, user_id, total_amount FROM orders;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN order_cursor;

    read_loop: LOOP
        FETCH order_cursor INTO o_id, u_id, amt;
        IF done THEN
            LEAVE read_loop;
        END IF;

        SELECT CONCAT('Order ID: ', o_id, ' | User: ', u_id, ' | Total: ₹', amt) AS order_summary;
    END LOOP;

    CLOSE order_cursor;
END //

DELIMITER ;

-- Run it: CALL list_orders_with_total();


/*This one iterates through all customers and calculates their total spent.*/
DELIMITER //

CREATE PROCEDURE total_spent_per_customer()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE c_id INT;
    DECLARE total_spent DECIMAL(10,2);

    DECLARE customer_cursor CURSOR FOR
        SELECT user_id FROM users WHERE role = 'customer';

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN customer_cursor;

    read_loop: LOOP
        FETCH customer_cursor INTO c_id;
        IF done THEN
            LEAVE read_loop;
        END IF;

        SELECT c_id AS customer_id,
               IFNULL(SUM(p.amount),0) AS total_spent
        FROM payments p
        JOIN orders o ON o.order_id = p.order_id
        WHERE o.user_id = c_id AND p.payment_status = 'successful';
    END LOOP;

    CLOSE customer_cursor;
END //

DELIMITER ;

-- Run it: CALL total_spent_per_customer();


/*find the top 2 customers by total spend*/

DELIMITER //

CREATE PROCEDURE top_2_customers_cursor()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE c_id INT;
    DECLARE c_name VARCHAR(100);
    DECLARE total_spent DECIMAL(10,2);

    -- Variables to hold top 2
    DECLARE t1_id INT; DECLARE t1_name VARCHAR(100); DECLARE t1_amt DECIMAL(10,2) DEFAULT 0;
    DECLARE t2_id INT; DECLARE t2_name VARCHAR(100); DECLARE t2_amt DECIMAL(10,2) DEFAULT 0;

    -- Cursor to fetch all customers
    DECLARE customer_cursor CURSOR FOR
        SELECT user_id, name FROM users WHERE role = 'customer';

    -- Handler for end of cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN customer_cursor;

    read_loop: LOOP
        FETCH customer_cursor INTO c_id, c_name;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Calculate total spent by this customer
        SELECT IFNULL(SUM(p.amount),0)
        INTO total_spent
        FROM payments p
        JOIN orders o ON p.order_id = o.order_id
        WHERE o.user_id = c_id AND p.payment_status = 'successful';

        -- Top 2 logic
        IF total_spent > t1_amt THEN
            SET t2_id = t1_id; SET t2_name = t1_name; SET t2_amt = t1_amt;
            SET t1_id = c_id; SET t1_name = c_name; SET t1_amt = total_spent;
        ELSEIF total_spent > t2_amt THEN
            SET t2_id = c_id; SET t2_name = c_name; SET t2_amt = total_spent;
        END IF;

    END LOOP;

    CLOSE customer_cursor;

    -- Show top 2
    SELECT t1_id AS user_id, t1_name AS name, t1_amt AS total_spent
    UNION ALL
    SELECT t2_id, t2_name, t2_amt;

END //

DELIMITER ;

-- Run it: CALL top_2_customers_cursor();