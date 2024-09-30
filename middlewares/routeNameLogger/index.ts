import { Request, Response, NextFunction } from 'express';

const routeNameLogger = (routeName: string) => (req: Request, res: Response, next: NextFunction) => {
  console.log({ routeName });

  next();
};

export default routeNameLogger;
