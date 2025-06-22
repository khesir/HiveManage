import { Router } from 'express';
import { AuthenticationController } from './auth.controller';
import { validateRequest } from '@/src/middlewares';
import { loginSchema } from './auth.model';

const authRoute = Router();
const authController = new AuthenticationController();

authRoute.post(
  '/sign-in',
  validateRequest({ body: loginSchema }),
  authController.login.bind(authController),
);

authRoute.get('/sign-out', authController.logout.bind(authController));

authRoute.get('/user', authController.getUser.bind(authController));
authRoute.get('/session', authController.getSession.bind(authController));

export default authRoute;
