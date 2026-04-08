import { Symptom } from '../models/Symptoms.js';
import Joi from 'joi';

// Validation Schema
const schema = Joi.object({
  age: Joi.number().required(),
  durationDays: Joi.number().required(),
  evolution: Joi.string().required(),
  itchingLevel: Joi.string().required(),
  physicalChanges: Joi.string().required(), // <--- This is what's triggering the error
  sunExposure: Joi.string().required(),
  familyHistory: Joi.string().required(),
});

export const saveSymptoms = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Save to MongoDB
    const newSymptom = new Symptom(value);
    await newSymptom.save();

    res.status(201).json({ success: true, data: newSymptom });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};