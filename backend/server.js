import dotenv from 'dotenv';
import express from 'express'
import connectDB from './config/db.js';
import User from './models/UserModel.js';
import userRouter from './routes/user.routes.js';
import scanRouter from './routes/scanRoute.js';
import symptomRoutes from './routes/symptomRoute.js';
import ashaRouter from './routes/ashaRoutes.js';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api', symptomRoutes);
app.use('/api/users', userRouter);
app.use('/api/scan', scanRouter);
app.use('/api/asha', ashaRouter);

app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});