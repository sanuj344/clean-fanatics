import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { overrideBooking } from "../controllers/admin.controller.js";

const router = express.Router();

router.post(
  "/bookings/:bookingId/override",
  authenticate,
  authorizeRoles("ADMIN"),
  overrideBooking
);

export default router;
