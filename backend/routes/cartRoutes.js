import express from 'express';
import {
  getCartByUser,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/:userId', getCartByUser);
router.post('/add', addToCart);
router.put('/update/:cartId', updateCartItem);
router.delete('/remove/:cartId', removeCartItem);
router.delete('/clear/:userId', clearCart);

export default router;
