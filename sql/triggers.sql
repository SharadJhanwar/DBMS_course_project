
/*whenever order_status is completed and payment_mode was cash cash a trigger will be called updating status of payment_status to completed*/
//

DELIMITER $$
CREATE TRIGGER after_order_completed
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
  IF NEW.order_status = 'completed' THEN
    UPDATE payments
    SET payment_status = 'successful',
        payment_date = CURRENT_TIMESTAMP
    WHERE order_id = NEW.order_id 
      AND payment_method = 'cash';
  END IF;
END$$
DELIMITER ;

/*Whever payment_status is successful add that into purchase_history*/
DELIMITER $$
CREATE TRIGGER after_payment_success
AFTER UPDATE ON payments
FOR EACH ROW
BEGIN
  IF NEW.payment_status = 'successful' THEN
    INSERT INTO purchase_history (user_id, order_id, payment_id)
    SELECT o.user_id, o.order_id, NEW.payment_id
    FROM orders o
    WHERE o.order_id = NEW.order_id;
  END IF;
END$$
DELIMITER ;


/*Whenever an item from menu is deleted it should be deleted from all users cart*/
DELIMITER $$

CREATE TRIGGER after_menu_item_delete
AFTER DELETE ON menu_items
FOR EACH ROW
BEGIN
  -- Remove deleted menu item from all user carts
  DELETE FROM cart_items
  WHERE item_id = OLD.item_id;
END$$

DELIMITER ;

