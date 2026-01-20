import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getAssignedBookings } from "../controllers/provider.controller.js";

const router = express.Router();

router.get(
  "/bookings",
  authenticate,
  authorizeRoles("PROVIDER"),
  getAssignedBookings
);


router.post(
  "/bookings/:bookingId/accept",
  authenticate,
  authorizeRoles("PROVIDER"),
  acceptBooking
);

router.post(
  "/bookings/:bookingId/reject",
  authenticate,
  authorizeRoles("PROVIDER"),
  rejectBooking
);


export default router;
