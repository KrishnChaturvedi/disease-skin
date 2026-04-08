import express from 'express';
import { saveSymptoms } from '../controllers/symptomController.js';
const router = express.Router();

router.post('/submit-symptoms', saveSymptoms);
export default router;