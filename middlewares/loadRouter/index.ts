import express, { RequestHandler } from 'express';
import RouteConfig from '../../types/RouteConfig';

import AppError from '../../utils/appError';

import { validateRequest, routeNameLogger } from '..';

import { protectAuthLevel } from '../../controllers/authController';

const router = express.Router();

const loadRouter = (routeConfig: { [key: string]: RouteConfig }, controller: any, validator: any) => {
  Object.keys(routeConfig).forEach((routeName: string) => {
    const { method, path, authLevel } = routeConfig[routeName];
    const routeController = controller[routeName];
    const routeValidator = validator[routeName];

    if (!routeController) {
      return new AppError(`controller for '${routeName}' not defined`, 500);
    }

    if (routeValidator && authLevel) {
      router[method](
        path,
        routeNameLogger(routeName),
        protectAuthLevel(authLevel),
        validateRequest(routeValidator, routeName),
        routeController
      );
    } else if (authLevel) {
      router[method](path, routeNameLogger(routeName), protectAuthLevel(authLevel), routeController);
    } else {
      router[method](path, routeNameLogger(routeName), routeController);
    }
  });

  return router;
};

export default loadRouter;
