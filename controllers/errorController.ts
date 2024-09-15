import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

const sendErrorDev = (err: ErrorWithStatus, req: Request, res: Response) => {
  return res.status(err.statusCode || 500).json({ error: err });
};

const sendErrorProd = (err: ErrorWithStatus, req: Request, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      title: 'Something went wrong',
      msg: err.message,
    });
  }

  return res.status(500).json({
    title: 'Something went wrong',
    msg: 'Please try again later.',
  });
};

const globalErrorHandler = (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'production') {
    const error = { ...err };
    sendErrorProd(error, req, res);
  } else {
    sendErrorDev(err, req, res);
  }
};

export default globalErrorHandler;
