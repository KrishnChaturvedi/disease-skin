import mongoose from "mongoose";

const ScanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // NEW: This single line links Harshit's image to Nikhil's quiz!
  symptomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Symptom",
    required: true
  },

  image: {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    originalName: { type: String }
  },

  mlResult: {
    disease: { type: String },
    confidence: { type: Number },
    heatmapUrl: { type: String },
  },

  report: {
    whatWasFound: { type: String },
    whatItCouldMean: { type: String },
    whatToDoNext: { type: String },
  },

  riskLevel: {
    type: String,
    enum: ["low", "medium", "high"],
  },

  pdfUrl: { type: String }, 

  status: {
    type: String,
    enum: ["pending", "ml_done", "report_done", "complete", "failed"],
    default: "pending",
  },

  errorMessage: { type: String },
}, { timestamps: true });

const ScanModel = mongoose.model("Scan", ScanSchema);

export default ScanModel;