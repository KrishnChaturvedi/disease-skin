import mongoose from "mongoose";

const ScanSchema = new mongoose.Schema({
  
  // ── Who submitted this scan ──────────────────────────────────────────────
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // ── Reference to symptom document (saved by Nikhil's controller) ─────────
  symptomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Symptom",
    required: true // <-- The crucial fix for a stable pipeline!
  },

  // ── Uploaded image (populated by multer + Cloudinary) ────────────────────
  image: {
    url: { type: String, required: true },        // Cloudinary secure_url
    publicId: { type: String, required: true },   // Cloudinary public_id
    originalName: { type: String },               // original filename from phone
  },

  // ── ML model output (populated by Python FastAPI) ─────────────────────────
  mlResult: {
    disease: { type: String },                    // e.g. "Melanoma"
    confidence: { type: Number },                 // e.g. 88.5
    heatmapUrl: { type: String },                 // Grad-CAM image URL
  },

  // ── Gemini report (5 fields to match Gemini prompt output) ───────────────
  report: {
    whatWasFound: { type: String },
    clinicalContext: { type: String },
    actionPlan: { type: String },
    questionsForDoctor: { type: String },
    preventionFocus: { type: String },
  },

  // ── Risk level badge ──────────────────────────────────────────────────────
  riskLevel: {
    type: String,
    enum: ["low", "medium", "high"],
  },

  // ── Generated PDF URL ─────────────────────────────────────────────────────
  pdfUrl: { type: String },

  // ── Pipeline status ───────────────────────────────────────────────────────
  status: {
    type: String,
    enum: ["pending", "ml_done", "report_done", "complete", "failed"],
    default: "pending",
  },

  errorMessage: { type: String },

}, { timestamps: true });

const ScanModel = mongoose.model("Scan", ScanSchema);

export default ScanModel;