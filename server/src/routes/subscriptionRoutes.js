import express from "express";
import Joi from "joi";
import Subscription from "../models/Subscription.js";
import Plan from "../models/Plan.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// POST /api/subscribe/:planId
router.post("/subscribe/:planId", auth, async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const now = new Date();
    const end = new Date(now);
    end.setDate(now.getDate() + plan.duration);

    // Mark existing subs as expired
    await Subscription.updateMany(
      { user_id: req.user.id, status: "active" },
      { status: "expired" }
    );

    const subscription = await Subscription.create({
      user_id: req.user.id,
      plan_id: plan._id,
      start_date: now,
      end_date: end,
      status: "active",
    });

    res.status(201).json(subscription);
  } catch (err) {
    next(err);
  }
});

// GET /api/my-subscription
router.get("/my-subscription", auth, async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ user_id: req.user.id })
      .sort({ createdAt: -1 })
      .populate("plan_id");

    if (!sub) {
      return res.json({ status: "none" });
    }

    const now = new Date();
    const status = sub.end_date < now ? "expired" : "active";

    res.json({
      status,
      subscription: sub,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/subscriptions
router.get(
  "/admin/subscriptions",
  auth,
  requireRole("admin"),
  async (req, res, next) => {
    try {
      const subs = await Subscription.find()
        .populate("user_id", "name email")
        .populate("plan_id", "name price duration");

      res.json(subs);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
