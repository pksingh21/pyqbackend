import questionController from '../controllers/questionController';
import { questionValidator } from '../validators';
import { loadRouter } from '../middlewares';

import RouteConfig from '../types/RouteConfig';

const routeConfig: { [key: string]: RouteConfig } = {
  createQuestions: {
    method: 'post',
    path: '/',
    authLevel: 'admin',
  },
  getQuestionsCount: {
    method: 'get',
    path: '/count',
    authLevel: 'user',
  },
  getQuestion: {
    method: 'get',
    path: '/:id',
    authLevel: 'user',
  },
  getQuestions: {
    method: 'get',
    path: '/',
    authLevel: 'user',
  },
  updateQuestion: {
    method: 'patch',
    path: '/:id',
    authLevel: 'admin',
  },
  deleteQuestion: {
    method: 'delete',
    path: '/:id',
    authLevel: 'admin',
  },
  deleteQuestionWithChoices: {
    method: 'get',
    path: '/withChoices/:id',
    authLevel: 'admin',
  },
  updateQuestionChoiceForQuestion: {
    method: 'post',
    path: '/questionChoice',
    authLevel: 'admin',
  },
};

const router = loadRouter(routeConfig, questionController, questionValidator);

export default router;
