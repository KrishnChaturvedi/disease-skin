import express from 'express'
import { userAuth } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.js';

import { createScan, getUserHistory } from '../controllers/scanController.js';

const scanRouter = express.Router();

scanRouter.post('/', userAuth, upload.single("skinImage"), createScan);


scanRouter.get('/history', userAuth, getUserHistory);

export default scanRouter;