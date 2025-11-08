import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateLogin } from "../middleware/validateLogin.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", validateLogin, login);

router.post("/logout", protect, logout);

// Example of protected route
router.get("/profile", protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
