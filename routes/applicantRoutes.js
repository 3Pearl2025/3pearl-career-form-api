import express from "express";
import upload from "../middleware/upload.js";
import {
  createApplicant,
  deleteApplicant,
  getApplicants,
  updateApplicantStatus,
} from "../controllers/applicantController.js";
import {
  applicantValidationRules,
  validateApplicant,
} from "../middleware/validateApplicant.js";

const router = express.Router();

router.post(
  "/",
  upload.single("cvFile"),
  applicantValidationRules,
  validateApplicant,
  createApplicant
);

// GET - list all applicants
router.get("/", getApplicants);

// DELETE - remove applicant by ID
router.delete("/:id", deleteApplicant);

// PATCH - update status
router.patch("/:id/status", updateApplicantStatus);

export default router;
