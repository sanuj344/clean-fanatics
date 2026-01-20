import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { addRating } from "../controllers/rating.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("CUSTOMER"),
  addRating
);

export default router;
