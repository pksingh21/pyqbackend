import { Request, Response, NextFunction } from 'express';

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestStr = `${req.method} - ${req.url}`;

  console.log(`+${'-'.repeat(requestStr.length + 2)}+`);
  console.log(`| ${requestStr} |`);
  console.log(`+${'-'.repeat(requestStr.length + 2)}+`);
  console.log('body: ');
  console.dir(req.body, { depth: null, colors: true });
  console.log('query: ');
  console.dir(req.query, { depth: null, colors: true });
  console.log('params: ');
  console.dir(req.params, { depth: null, colors: true });
  console.log('x -----------------------');

  next();
};

export default requestLogger;
