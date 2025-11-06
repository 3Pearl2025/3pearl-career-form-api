import express from "express";
import { getLogs } from "../controllers/logController.js";

const router = express.Router();

// GET - View logs (supports filters)
router.get("/", getLogs);

export default router;
