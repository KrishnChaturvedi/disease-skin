import ScanModel from "../models/ScanModel.js";
import { Symptom } from "../models/Symptoms.js";
import { generateAndUploadPDF } from "../utils/pdfService.js";
import axios from "axios";

export const createScan = async (req, res) => {
  try {
    const imageUrl = req.file.path;
    const publicId = req.file.filename;
    const { symptomId, language } = req.body;

    if (!symptomId) {
      return res.status(400).json({ success: false, message: "symptomId is required." });
    }

    const userSymptoms = await Symptom.findById(symptomId);
    if (!userSymptoms) {
      return res.status(404).json({ success: false, message: "Symptoms not found in DB." });
    }

    // 1. Create the pending scan
    const scan = await ScanModel.create({
      user: req.user._id,
      symptomId: symptomId,
      image: {
        url: imageUrl,
        publicId: publicId,
        originalName: req.file.originalname,
      },
      status: "pending",
    });

    // 2. Call the Python FastAPI Service
    const pythonApiUrl = process.env.ML_SERVICE_URL || "http://ml:8000/analyze";

    const mlResponse = await axios.post(pythonApiUrl, {
      imageUrl: imageUrl,
      symptoms: userSymptoms,
      scanId: scan._id.toString(),
      language: language || "English" 
    });

    const { disease, confidence, report } = mlResponse.data;

    // extract plain text from report
    const reportText = Array.isArray(report)
      ? report
          .filter(item => item.type === 'text')
          .map(item => item.text || '')
          .join('\n')
          .trim()
      : (typeof report === 'string' ? report : JSON.stringify(report));

    // 3. Save the Python Results
    scan.mlResult = {
      disease: disease || "Unknown",
      confidence: confidence || 0,
      heatmapUrl: ""
    };
    
    // ✅ NEW: Strip all Markdown stars (**) so the PDF is clean
    scan.report = reportText.replace(/\*\*/g, ""); 

    // 4. Calculate Risk
    const highRiskDiseases = ["Melanoma", "Basal Cell Carcinoma", "Squamous Cell Carcinoma"];
    const mediumRiskDiseases = ["Psoriasis", "Eczema", "Acne", "Rosacea"];

    let calculatedRisk = "low";
    
    // Matches: "Risk Level: High", "Severity: Medium", "गंभीरता: मध्यम", "जोखिम स्तर: मध्यम"
    const aiRiskMatch = scan.report.match(/[•\-*]?\s*(?:Risk\s*Level|Severity|गंभीरता|जोखिम\s*स्तर)\s*[:\-]\s*(low|medium|high|कम|मध्यम|उच्च)/i);
    
    if (aiRiskMatch) {
      const val = aiRiskMatch[1].toLowerCase();
      if (['high', 'उच्च'].includes(val)) calculatedRisk = "high";
      else if (['medium', 'मध्यम'].includes(val)) calculatedRisk = "medium";
      else calculatedRisk = "low";
    } else {
      // Fallback
      if (highRiskDiseases.includes(scan.mlResult.disease)) {
        calculatedRisk = "high";
      } else if (mediumRiskDiseases.includes(scan.mlResult.disease)) {
        calculatedRisk = "medium";
      }
    }

    scan.riskLevel = calculatedRisk;
    scan.status = "report_done";
    await scan.save();

    // 5. Generate PDF
    const pdfUrl = await generateAndUploadPDF(scan);
    scan.pdfUrl = pdfUrl;
    scan.status = "complete";
    await scan.save();

    res.status(201).json({
      success: true,
      message: "Analysis and PDF Generation Complete",
      scan,
    });

  } catch (error) {
    console.error("Scan error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getUserHistory = async (req, res) => {
  try {
    const history = await ScanModel.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch history",
      error: error.message,
    });
  }
};