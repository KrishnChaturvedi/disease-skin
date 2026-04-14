import mongoose from "mongoose";

const ScanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  symptomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Symptom",
    required: true 
  },
  patientName: { type: String, default: "Unknown" },
  age: { type: Number },
  gender: { type: String, default: "unknown" },
  village: { type: String, default: "Unknown" },
  phone: { type: String },
  image: {
    url: { type: String, required: true },        
    publicId: { type: String, required: true },   
    originalName: { type: String },               
  },
  mlResult: {
    disease: { type: String },                    
    confidence: { type: Number },                 
    heatmapUrl: { type: String },                 
  },
  report: { type: String },
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