import { Symptom } from '../models/Symptoms.js'
import Joi from 'joi';



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

    const { error, value } = schema.validate(req.body, { 
      convert: true, 
      stripUnknown: true 
    });
    
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }


    const newSymptom = new Symptom(value); 
    

    await newSymptom.save();

    res.status(201).json({ success: true, data: newSymptom });
  } catch (err) {
    
    console.error("Mongoose Error:", err.message);
    res.status(400).json({ success: false, error: err.message });
  }
};
