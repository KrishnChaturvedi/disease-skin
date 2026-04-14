// File: backend/models/Symptoms.js
import mongoose from 'mongoose';

const symptomSchema = new mongoose.Schema({
  mainConcern:        { type: String, required: true },
  durationDays:       { type: String, required: true },
  symptoms:           { type: String, required: true },
  priorTreatment:     { type: String, required: true },
  allergies:          { type: String, required: true },
  skincareRoutine:    { type: String, required: true },
  currentMedications: { type: String, required: true },
  familyHistory:      { type: String, required: true },
  sunExposure:        { type: String, required: true },
  physicalChanges:    { type: String, required: true },
  mlResult:           { type: Object, default: null },
  createdAt:          { type: Date,   default: Date.now },
});

export const Symptom = mongoose.model('Symptom', symptomSchema);