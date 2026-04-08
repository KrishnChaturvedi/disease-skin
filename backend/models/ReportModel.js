import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  // 1. Who took the test
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // 2. Link to Nikhil's saved Quiz Data
  symptomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Symptom', required: true },
  
  // 3. From Friend 2's ML Scan
  mlResult: {
    disease: String,
    confidence: Number,
    heatmapUrl: String     
  },
  
  // 4. Your Gemini AI Generation
  geminiReport: {
    whatFound: String,
    whatItMeans: String,
    nextSteps: String
  },
  riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  pdfUrl: String, 

}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
export default Report;