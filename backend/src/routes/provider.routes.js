import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import {
  getAssignedBookings,
  acceptBooking,
  rejectBooking,
} from "../controllers/provider.controller.js";
import {
  createProviderService,
  getProviderServices,
} from "../controllers/service.controller.js";

const router = express.Router();

// Provider services
router.post(
  "/services",
  authenticate,
  authorizeRoles("PROVIDER"),
  createProviderService
);

router.get(
  "/services",
  authenticate,
  authorizeRoles("PROVIDER"),
  getProviderServices
);

// Provider bookings
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
