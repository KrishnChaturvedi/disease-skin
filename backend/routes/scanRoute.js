import express from 'express';
import { userAuth } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.js';

import { createScan, getUserHistory } from '../controllers/scanController.js';
import { handleChat } from '../controllers/chatController.js'; 

const scanRouter = express.Router();

scanRouter.post('/', userAuth, upload.single("skinImage"), createScan);
scanRouter.get('/history', userAuth, getUserHistory);


scanRouter.post('/chat', userAuth, handleChat);

export default scanRouter;