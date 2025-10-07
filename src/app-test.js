import express from 'express';
import homeRouter from './routes/home.js';
import experienceRouter from './routes/experience.js';
import { errorsHandler } from './middlewares/errorsHandler.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/home', homeRouter);
app.use('/api/experience', experienceRouter);

// Catch 404 manually
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use(errorsHandler);

export default app;
