import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getAllBookings, overrideBooking } from "../controllers/admin.controller.js";

const router = express.Router();

router.get(
  "/bookings",
  authenticate,
  authorizeRoles("ADMIN"),
  getAllBookings
);

router.post(
  "/bookings/:bookingId/override",
  authenticate,
  authorizeRoles("ADMIN"),
  overrideBooking
);

export default router;
