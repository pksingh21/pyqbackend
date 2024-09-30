import { RequestHandler } from 'express';

export default interface RouteConfig {
  method: 'get' | 'post' | 'patch' | 'delete';
  path: string;
  authLevel: 'admin' | 'user';
  controller?: RequestHandler;
  validator?: any;
}
