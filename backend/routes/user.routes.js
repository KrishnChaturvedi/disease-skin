import express from 'express';
import { registerUser, loginUser } from '../controllers/user.controller.js';

const router = express.Router();

//Register user
router.post('/register',registerUser);

//login User
router.post('/login',loginUser);


export default router;