import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import {
  createCreditOrder,
  verifyPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post(
  "/create-order",
  authenticate,
  authorizeRoles("CUSTOMER"),
  createCreditOrder
);

router.post(
  "/verify",
  authenticate,
  authorizeRoles("CUSTOMER"),
  verifyPayment
);

export default router;
