import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import connectDB from './configs/db.js';
import { errorsHandler } from './middlewares/errorsHandler.js';
import blogRouter from './routes/blog.js';
import experienceRouter from './routes/experience.js';
import homeRouter from './routes/home.js';

config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/home', homeRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/blog', blogRouter);

// Catch 404 manually
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use(errorsHandler);

export default app;
