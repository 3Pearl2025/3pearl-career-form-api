import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  ip: String,
  endpoint: String,
  method: String,
  message: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Log", logSchema);
