import ScanModel from "../models/ScanModel.js";

// POST /api/scan
export const createScan = async (req, res) => {
  try {
    // ── Step 1: Get image info from Cloudinary (populated by multer) ─────────
    const imageUrl = req.file.path;         // Cloudinary secure_url
    const publicId = req.file.filename;     // Cloudinary public_id

    // ── Step 2: Get symptom answers from request body ────────────────────────
    const { age, duration, itches, bleeds, sunExposure, familyHistory } = req.body;

    // ── Step 3: Create a new scan document in MongoDB (status: pending) ──────
    const scan = await ScanModel.create({
      user: req.user._id,        // comes from verifyToken middleware
      symptoms: {
        age,
        duration,
        itches,
        bleeds,
        sunExposure,
        familyHistory,
      },
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
    // const report = await callGeminiService(mlResult, scan.symptoms);
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

    // ── Step 7: Send response back to frontend ────────────────────────────────
    res.status(201).json({
      success: true,
      message: "Scan created successfully",
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
