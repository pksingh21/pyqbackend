import userController from '../controllers/userController';
import { loadRouter } from '../middlewares';
import { userValidator } from '../validators';

import RouteConfig from '../types/RouteConfig';

const routeConfig: { [key: string]: RouteConfig } = {
  createUser: {
    method: 'post',
    path: '/',
    authLevel: 'admin',
  },
  updateProfile: {
    method: 'patch',
    path: '/',
    authLevel: 'user',
  },
  getUser: {
    method: 'get',
    path: '/:id',
    authLevel: 'admin',
  },
  updateUser: {
    method: 'patch',
    path: '/:id',
    authLevel: 'admin',
  },
  deleteUser: {
    method: 'delete',
    path: '/:id',
    authLevel: 'admin',
  },
};

const router = loadRouter(routeConfig, userController, userValidator);

export default router;
