import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  city: { type: String },
  cvUrl: { type: String }, // store uploaded file URL (e.g. from Google Drive)
  status: {
    type: String,
    enum: ["unread", "called", "rejected", "accepted"],
    default: "unread",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Applicant", applicantSchema);
