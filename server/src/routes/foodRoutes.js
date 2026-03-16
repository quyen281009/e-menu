import express from "express";
import {
  getFoods,
  createFood,
  updateFood,
  deleteFood,
} from "../controllers/foodController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getFoods);
router.post("/", protectAdmin, createFood);
router.put("/:id", protectAdmin, updateFood);
router.delete("/:id", protectAdmin, deleteFood);

export default router;

