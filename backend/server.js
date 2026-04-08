import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import connectDB from './config/db.js';
import User from './models/UserModel.js';
import userRouter from './routes/user.routes.js';

const app = express();

app.use(express.json());

//db connection
connectDB();


 app.use('/api/users', userRouter);


app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});