import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { createBooking } from "../controllers/booking.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("CUSTOMER"),
  createBooking
);

router.get(
  "/:bookingId",
  authenticate,
  getBookingWithEvents
);


export default router;
