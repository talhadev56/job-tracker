import mongoose from "mongoose";

export const APPLICATION_STATUSES = ["applied", "interview", "offer", "rejected"];

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: APPLICATION_STATUSES,
        message: "Status must be one of: applied, interview, offer, rejected",
      },
      default: "applied",
    },
    dateApplied: {
      type: Date,
      default: Date.now,
    },
    jobLink: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => !value || /^https?:\/\/.+/i.test(value),
        message: "Job link must be a valid URL",
      },
    },
    salary: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export default mongoose.model("Application", applicationSchema);
