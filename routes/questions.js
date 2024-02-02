import express from "express";
import {
  getQuestionByLetter,
  getAZQuestions,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questions.js";
import adminMiddleware from "../middlewares/admin.js";

const router = express.Router();

router.get("/", getAZQuestions);
router.get("/all", adminMiddleware, getAllQuestions);
router.post("/get", adminMiddleware, getQuestionById);
router.post("/update", adminMiddleware, updateQuestion);
router.post("/delete", adminMiddleware, deleteQuestion);
router.get("/:letter", getQuestionByLetter);

export default router;
