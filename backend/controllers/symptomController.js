import { Symptom } from '../models/Symptoms.js'
import Joi from 'joi';

// File: backend/controllers/symptomController.js



const schema = Joi.object({
  mainConcern:        Joi.string().required(),
  durationDays:       Joi.string().required(),
  symptoms:           Joi.string().required(),
  priorTreatment:     Joi.string().required(),
  allergies:          Joi.string().required(),
  skincareRoutine:    Joi.string().required(),
  currentMedications: Joi.string().required(),
  familyHistory:      Joi.string().required(), 
  sunExposure:        Joi.string().required(),
  physicalChanges:    Joi.string().required(),
}).unknown(true);

export const saveSymptoms = async (req, res) => {
  try {
    // 1. Validate the body
    const { error, value } = schema.validate(req.body, { 
      convert: true, 
      stripUnknown: true 
    });
    
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    // 2. CRITICAL: Use 'value' (the validated data), NOT 'req.body'
    const newSymptom = new Symptom(value); 
    
    // 3. Save to Database
    await newSymptom.save();

    res.status(201).json({ success: true, data: newSymptom });
  } catch (err) {
    // This catches the Mongoose "Path durationDays is required" error
    console.error("Mongoose Error:", err.message);
    res.status(400).json({ success: false, error: err.message });
  }
};
