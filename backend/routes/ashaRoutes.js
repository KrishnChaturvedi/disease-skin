import express from 'express';
import { registerAsha, loginAsha, getAshaStats } from '../controllers/ashaController.js';
import { userAuth } from '../middlewares/auth.middleware.js'; 

const router = express.Router();

router.post('/register', registerAsha);
router.post('/login', loginAsha);
router.get('/stats', userAuth, getAshaStats);

export default router;