import express from "express";

import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";

const router = express.Router();

router.get("/", getExperiences);
router.post("/", createExperience);
router.patch("/:id", updateExperience);
router.delete("/:id", deleteExperience);

export default router;
