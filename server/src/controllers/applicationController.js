import mongoose from "mongoose";
import Application, { APPLICATION_STATUSES } from "../models/Application.js";

const ALLOWED_UPDATE_FIELDS = [
  "company",
  "role",
  "status",
  "dateApplied",
  "jobLink",
  "salary",
  "location",
  "notes",
];

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


// @route   GET /api/applications
// @access  Private
export const getApplications = async (req, res, next) => {
  try {
    const { status, search, sort } = req.query;

    const filter = { user: req.user.id };

    if (status) {
      if (!APPLICATION_STATUSES.includes(status)) {
        return res.status(400).json({ message: "Invalid status filter" });
      }
      filter.status = status;
    }

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ company: regex }, { role: regex }];
    }

    const sortOrder = sort === "oldest" ? 1 : -1; // default: newest first

    const applications = await Application.find(filter).sort({ dateApplied: sortOrder });

    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/applications
// @access  Private
export const createApplication = async (req, res, next) => {
  try {
    const { company, role, status, dateApplied, jobLink, salary, location, notes } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: "Company and role are required" });
    }

    if (status && !APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Status must be one of: applied, interview, offer, rejected" });
    }

    const application = await Application.create({
      user: req.user.id,
      company,
      role,
      status,
      dateApplied,
      jobLink,
      salary,
      location,
      notes,
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/applications/:id
// @access  Private
export const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, user: req.user.id });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/applications/:id
// @access  Private
export const updateApplication = async (req, res, next) => {
  try {
    const updates = {};
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (field in req.body) updates[field] = req.body[field];
    }

    if ("status" in updates && !APPLICATION_STATUSES.includes(updates.status)) {
      return res.status(400).json({ message: "Status must be one of: applied, interview, offer, rejected" });
    }
    if (updates.company === "") {
      return res.status(400).json({ message: "Company cannot be empty" });
    }
    if (updates.role === "") {
      return res.status(400).json({ message: "Role cannot be empty" });
    }

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true, runValidators: true, context: "query" }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/applications/:id
// @access  Private
export const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted" });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/applications/stats
// @access  Private
export const getStats = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const counts = await Application.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const stats = { total: 0, applied: 0, interview: 0, offer: 0, rejected: 0 };

    counts.forEach(({ _id, count }) => {
      stats[_id] = count;
      stats.total += count;
    });

    const responseRate =
      stats.total > 0 ? Math.round(((stats.interview + stats.offer) / stats.total) * 100) : 0;

    res.status(200).json({ ...stats, responseRate });
  } catch (error) {
    next(error);
  }
};
