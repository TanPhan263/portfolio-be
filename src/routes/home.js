import express from "express";

import {
  getHome,
  createHome,
  updateHome,
} from "../controllers/homeController.js";

const router = express.Router();

router.get("/", getHome);
router.post("/", createHome);
router.patch("/:id", updateHome);

export default router;
