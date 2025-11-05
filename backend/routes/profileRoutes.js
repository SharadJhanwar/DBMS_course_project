import express from "express";
import {
  getUserProfile,
  upsertUserProfile,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/profileController.js";

const router = express.Router();

// Profile routes
router.get("/:userId", getUserProfile);
router.post("/:userId", upsertUserProfile);

// Address routes
router.post("/:userId/address", addAddress);
router.get("/:userId/address", getAddresses);
router.put("/address/:addressId", updateAddress);
router.delete("/address/:addressId", deleteAddress);
router.patch("/address/:addressId/default", setDefaultAddress);

export default router;
