import mongoose from 'mongoose';

const symptomSchema = new mongoose.Schema({
  // Flat schema matching the questionnaire fields
  age: { type: Number, required: true },
  durationDays: { type: Number, required: true },
  evolution: { type: String, required: true },
  itchingLevel: { type: String, required: true },
  // Align field name with frontend `physicalChanges`
  physicalChanges: { type: String, required: true },
  sunExposure: { type: String, required: true },
  familyHistory: { type: String, required: true },
  // Placeholder to update later in Step 5/6
  mlResult: { type: Object, default: null },
  createdAt: { type: Date, default: Date.now }
});

export const Symptom = mongoose.model('Symptom', symptomSchema);