import mongoose from "mongoose";

const ScanSchema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // ── Links exactly to Nikhil's code ─
  symptomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Symptom",
    required: true 
  },

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

 report: { type: String },  // Plain text from Python agent


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