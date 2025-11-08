
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
