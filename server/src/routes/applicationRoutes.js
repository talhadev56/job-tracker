import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getApplications,
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
  getStats,
} from "../controllers/applicationController.js";

const router = express.Router();

router.use(protect); // every route below requires auth

router.get("/stats", getStats); 

router.route("/").get(getApplications).post(createApplication);

router.route("/:id").get(getApplication).patch(updateApplication).delete(deleteApplication);

export default router;
