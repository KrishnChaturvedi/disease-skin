import mongoose from "mongoose"

const ScanSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
  },

  symptoms:{
    age:{type:Number, required: true},
    duration:{type: String, required: true},
    itches: {type:Boolean, required: true},
    bleeds: {type: Boolean, required: true},
    sunExposure: {
      type: String,
      enum: ["low", "moderate", "high"],
      required: true,
    },
    familyHistory: { type: Boolean, required: true },
  },

  image:{
    url:{type:String, required:true},
    publicId:{type:String, required:true},
    originalName: {type:String}
  },

  mlResult:{
    disease:{type: String},
    confidence:{type: Number},
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
},{timestamps:true,});

const ScanModel = mongoose.model("Scan", ScanSchema);

export default ScanModel;