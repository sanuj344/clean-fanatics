import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { addRating, getRatingByBooking } from "../controllers/rating.controller.js";

const router = express.Router();

/**
 * POST /api/ratings
 * CUSTOMER → Create rating for a completed booking
 */
router.post(
  "/",
  authenticate,
  authorizeRoles("CUSTOMER"),
  addRating
);

/**
 * GET /api/ratings/booking/:bookingId
 * Get rating for a specific booking (if exists)
 * Used to check if booking is already rated
 */
router.get(
  "/booking/:bookingId",
  authenticate,
  getRatingByBooking
);

export default router;
