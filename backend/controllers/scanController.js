import ScanModel from "../models/ScanModel.js";

// POST /api/scan
export const createScan = async (req, res) => {
  try {
    // ── Step 1: Get image info from Cloudinary (populated by multer) ─────────
    const imageUrl = req.file.path;         
    const publicId = req.file.filename;     

    // ── Step 2: Grab the ID from Nikhil's saved symptoms ─────────────────────
    const { symptomId } = req.body;

    if (!symptomId) {
      return res.status(400).json({ success: false, message: "symptomId is required to link the image to the quiz answers." });
    }

    // ── Step 3: Create a new scan document in MongoDB ────────────────────────
    const scan = await ScanModel.create({
      user: req.user._id,        
      symptomId: symptomId, // <--- Relational database magic!
      image: {
        url: imageUrl,
        publicId: publicId,
        originalName: req.file.originalname,
      },
      status: "pending",
    });

    // ── Step 4: Call ML service (Python FastAPI) ──────────────────────────────
    // TODO: uncomment when mlService.js is ready
    // const mlResult = await callMLService(imageUrl);
    // scan.mlResult = mlResult;
    // scan.status = "ml_done";
    // await scan.save();

    // ── Step 5: Call Gemini API to generate report ────────────────────────────
    // TODO: uncomment when geminiService.js is ready
    // const report = await callGeminiService(mlResult, symptomId);
    // scan.report = report;
    // scan.riskLevel = calculateRiskLevel(mlResult.confidence);
    // scan.status = "report_done";
    // await scan.save();

    // ── Step 6: Generate PDF ──────────────────────────────────────────────────
    // TODO: uncomment when pdfService.js is ready
    // const pdfUrl = await generatePDF(scan);
    // scan.pdfUrl = pdfUrl;
    // scan.status = "complete";
    // await scan.save();

    res.status(201).json({
      success: true,
      message: "Image uploaded and linked to symptoms successfully!",
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