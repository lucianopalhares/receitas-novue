import { Router } from 'express';
import type { AuthController } from './AuthController';

export function authRoutes(controller: AuthController) {

  const router = Router();

  router.post('/usuarios', controller.cadastrar);
  router.post('/auth/login', controller.login);
  router.get('/auth/me', controller.me);
  router.post('/auth/logout', controller.logout);

  return router;

}
