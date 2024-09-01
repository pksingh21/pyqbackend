import { Request, Response, NextFunction } from 'express';

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestStr = `${req.method} - ${req.url}`;

  console.log(`+${'-'.repeat(requestStr.length + 2)}+`);
  console.log(`| ${requestStr} |`);
  console.log(`+${'-'.repeat(requestStr.length + 2)}+`);
  console.log('body: ');
  console.log(req.body);
  console.log('x -----------------------');

  next();
};

export default requestLogger;
