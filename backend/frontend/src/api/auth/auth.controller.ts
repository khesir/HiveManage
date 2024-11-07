import { Request, Response } from 'express';

import { AuthenticationService } from './auth.service';

export class AuthenticationController {
  private authService: AuthenticationService;

  constructor() {
    this.authService = new AuthenticationService();
  }

  async login(req: Request, res: Response) {
    try {
      const result = await this.authService.login({
        email: req.body.email,
        password: req.body.password,
      });
      res.status(200).json({ message: 'Login Sucessfull', data: result.data });
    } catch (error) {
      console.log(error);
      res.status(403).json({ message: 'Invalid Credentials' });
    }
  }
  async logout(req: Request, res: Response) {
    try {
      await this.authService.logout();
      res.status(200).json({ message: 'Logout Sucessfull' });
    } catch (error) {
      console.log(error);
      res.status(403).json({ message: 'Invalid Credentials' });
    }
  }
  async getUser(req: Request, res: Response) {
    try {
      const user = await this.authService.getCurrentUser();

      res.status(200).json({ data: user });
    } catch (error) {
      console.log(error);
      res.status(403).json({ message: 'Unable to fetch user' });
    }
  }
}
