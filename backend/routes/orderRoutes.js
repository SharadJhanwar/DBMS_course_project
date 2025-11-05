// backend/routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
  getAllOrders
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/user/:userId", getUserOrders);
router.get("/details/:orderId", getOrderDetails);
router.put("/status/:orderId", updateOrderStatus);
router.get("/all", getAllOrders);


export default router;
