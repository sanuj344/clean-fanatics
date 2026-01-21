import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { completeBooking } from "../controllers/booking.controller.js";

const router = express.Router();

/**
 * PATCH /api/customer/bookings/:bookingId/complete
 * CUSTOMER → Mark booking as COMPLETED
 */
router.patch(
  "/bookings/:bookingId/complete",
  authenticate,
  authorizeRoles("CUSTOMER"),
  completeBooking
);

export default router;

