import express from "express";
import Plan from "../models/Plan.js";

const router = express.Router();

// GET /api/plans
router.get("/plans", async (req, res, next) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (err) {
    next(err);
  }
});

export default router;
