import { Router } from 'express';
import { AuthenticationController } from './auth.controller';
import { validateRequest } from '@/src/middlewares';
import { loginSchema } from './auth.model';

const authRoute = Router();
const authController = new AuthenticationController();

authRoute.post(
  '/login',
  validateRequest({ body: loginSchema }),
  authController.login.bind(authController),
);

authRoute.get('/logout', authController.logout.bind(authController));

authRoute.get('/user', authController.getUser.bind(authController));

export default authRoute;
