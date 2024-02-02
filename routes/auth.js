import express from "express";
import {
  checkAuth,
  deleteUser,
  getAllUsers,
  getUserById,
  googleLogin,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  updateUserAdmin,
} from "../controllers/auth.js";
import authMiddleware from "../middlewares/auth.js";
import adminMiddleware from "../middlewares/admin.js";

const router = express.Router();

router.get("/auth", checkAuth);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.get("/logout", logoutUser);
router.post("/update", authMiddleware, updateUser);

router.get("/all", adminMiddleware, getAllUsers);
router.post("/get", adminMiddleware, getUserById);
router.post("/update-admin", adminMiddleware, updateUserAdmin);
router.post("/delete", adminMiddleware, deleteUser);

export default router;
