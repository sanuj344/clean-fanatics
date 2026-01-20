import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/admin-only",
  authenticate,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

router.get(
  "/provider-only",
  authenticate,
  authorizeRoles("PROVIDER"),
  (req, res) => {
    res.json({ message: "Welcome Provider" });
  }
);

router.get(
  "/customer-only",
  authenticate,
  authorizeRoles("CUSTOMER"),
  (req, res) => {
    res.json({ message: "Welcome Customer" });
  }
);

export default router;
