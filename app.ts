import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import globalErrorHandler from './controller/errorController';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import tagRoutes from './routes/tagRoutes';
import questionsRoutes from './routes/questionRoutes';
import questionChoiceRoutes from './routes/questionChoiceRoutes';
import testRoutes from './routes/testRoutes';
import paperQuestionChoiceRoutes from './routes/paperQuestionsRoutes';
import paperRoutes from './routes/paperRoutes';
import testQuestionStatusRoutes from './routes/testQuestionStatusRoutes';

import requestLogger from './utils/requestLogger';
import AppError from './utils/appError';

const app = express();

app.use(express.static(path.join(__dirname, '../frontend/build')));

const whitelist = process.env.CORS_WHITELIST ? process.env.CORS_WHITELIST.split(',') : [];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin!) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

if (process.env.USE_CORS) {
  app.use(cors(corsOptions));
}

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/question', questionsRoutes);
app.use('/api/questionChoice', questionChoiceRoutes);
app.use('/api/test', testRoutes);
app.use('/api/paper', paperRoutes);
app.use('/api/paperQuestionChoice', paperQuestionChoiceRoutes);
app.use('/api/testQuestionStatusRoutes.ts', testQuestionStatusRoutes);

// Serve the React frontend
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Handle undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
