import express from "express";
import { addLeaderboard, getLeaderboard } from "../controllers/leaderboard.js";

const router = express.Router();

router.get("/", getLeaderboard);
router.post("/add", addLeaderboard);

export default router;
