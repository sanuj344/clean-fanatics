import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import {
  createService,
  listServices,
} from "../controllers/service.controller.js";
import { getServices } from "../controllers/service.controller.js";
const router = express.Router();

// Admin creates service
router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  createService
);

// Customer lists services
router.get("/", authenticate, listServices);
router.get("/", getServices);
export default router;
