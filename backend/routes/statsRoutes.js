// routes/statsRoutes.js
import express from "express";
import {
  getDashboardStats,
  getCustomerStats,
  getTopSellingItem,
} from "../controllers/statsController.js";

const router = express.Router();

// Dashboard overview (admin)
router.get("/dashboard", getDashboardStats);

// Customer-specific stats
router.get("/customer/:user_id", getCustomerStats);

// Top-selling item
router.get("/top-item", getTopSellingItem);

export default router;
