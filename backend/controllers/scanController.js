import ScanModel from "../models/ScanModel.js";
import { Symptom } from "../models/Symptoms.js";
import { generateAndUploadPDF } from "../utils/pdfService.js";
import axios from "axios";

export const createScan = async (req, res) => {
  try {
    const imageUrl = req.file.path;
    const publicId = req.file.filename;
    const { symptomId, language, patientName, age, gender, village, phone } = req.body;

    if (!symptomId) {
      return res.status(400).json({ success: false, message: "symptomId is required." });
    }

    const userSymptoms = await Symptom.findById(symptomId);
    if (!userSymptoms) {
      return res.status(404).json({ success: false, message: "Symptoms not found in DB." });
    }

    const scan = await ScanModel.create({
      user: req.user._id,
      symptomId: symptomId,
      patientName: patientName || "Unknown",
      age: age || null,
      gender: gender || "unknown",
      village: village || "Unknown",
      phone: phone || "",
      image: {
        url: imageUrl,
        publicId: publicId,
        originalName: req.file.originalname,
      },
      status: "pending",
    });

    const pythonApiUrl = process.env.ML_SERVICE_URL || "http://ml:8000/analyze";

    const mlResponse = await axios.post(pythonApiUrl, {
      imageUrl: imageUrl,
      symptoms: userSymptoms,
      scanId: scan._id.toString(),
      language: language || "English" 
    });

    const { disease, confidence, report } = mlResponse.data;

    let extractedReport = "";
    
    if (typeof report === 'object' && report !== null && !Array.isArray(report)) {
      extractedReport = report.output || report.text || report.report || JSON.stringify(report);
    } else if (Array.isArray(report)) {
      extractedReport = report.filter(item => item.type === 'text').map(item => item.text || '').join('\n');
    } else {
      extractedReport = String(report);
    }

    try {
      const parsed = JSON.parse(extractedReport);
      if (parsed && typeof parsed === 'object') {
        extractedReport = parsed.output || parsed.text || parsed.report || extractedReport;
      }
    } catch (e) {}

    const cleanReportText = extractedReport
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\*\*/g, "")
      .trim();

    scan.mlResult = {
      disease: disease || "Unknown",
      confidence: confidence || 0,
      heatmapUrl: ""
    };
    
    scan.report = cleanReportText; 

    const highRiskDiseases = ["Melanoma", "Basal Cell Carcinoma", "Squamous Cell Carcinoma"];
    const mediumRiskDiseases = ["Psoriasis", "Eczema", "Acne", "Rosacea"];

    let calculatedRisk = "low";
    
    const aiRiskMatch = scan.report.match(/[•\-*]?\s*(?:Risk\s*Level|Severity|गंभीरता|जोखिम\s*स्तर)\s*[:\-]\s*(low|medium|high|कम|मध्यम|उच्च)/i);
    
    if (aiRiskMatch) {
      const val = aiRiskMatch[1].toLowerCase();
      if (['high', 'उच्च'].includes(val)) calculatedRisk = "high";
      else if (['medium', 'मध्यम'].includes(val)) calculatedRisk = "medium";
      else calculatedRisk = "low";
    } else {
      if (highRiskDiseases.includes(scan.mlResult.disease)) {
        calculatedRisk = "high";
      } else if (mediumRiskDiseases.includes(scan.mlResult.disease)) {
        calculatedRisk = "medium";
      }
    }

    scan.riskLevel = calculatedRisk;
    scan.status = "report_done";
    await scan.save();

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