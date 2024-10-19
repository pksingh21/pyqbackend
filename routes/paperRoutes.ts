import paperController from '../controllers/paperController';
import { paperValidator } from '../validators';
import { loadRouter } from '../middlewares';

import RouteConfig from '../types/RouteConfig';

const routeConfig: { [key: string]: RouteConfig } = {
  createPaper: {
    method: 'post',
    path: '/',
    authLevel: 'admin',
  },
  getPaperCount: {
    method: 'get',
    path: '/count',
    authLevel: 'admin',
  },
  getPaper: {
    method: 'get',
    path: '/:id',
    authLevel: 'admin',
  },
  getPapers: {
    method: 'get',
    path: '/',
    authLevel: 'admin',
  },
  updatePaper: {
    method: 'patch',
    path: '/:id',
    authLevel: 'admin',
  },
  deletePaper: {
    method: 'delete',
    path: '/:id',
    authLevel: 'admin',
  },
  updateTagsForPaper: {
    method: 'post',
    path: '/tags',
    authLevel: 'admin',
  },
};

const router = loadRouter(routeConfig, paperController, paperValidator);

export default router;
