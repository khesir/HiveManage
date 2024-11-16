import { NextFunction, Request, Response } from 'express';

import { AuthenticationService } from './auth.service';
import { HttpStatus } from '@/lib/HttpStatus';

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
  async getSession(req: Request, res: Response) {
    try {
      const session = await this.authService.getCurrentSession();

      res.status(200).json({ data: session });
    } catch (error) {
      console.log(error);
      res.status(403).json({ message: 'Unable to fetch session' });
    }
  }
  async getAllUser(req: Request, res: Response, next: NextFunction) {
    const sort = (req.query.sort as string) || 'desc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const role_id = (req.query.role_id as string) || undefined;
    const user_id = (req.query.user_id as string) || undefined;
    const fullname = (req.query.fullname as string) || undefined;
    const status = (req.query.status as string) || undefined;
    const employee_id = (req.query.employee_id as string) || undefined;
    const position_id = (req.query.position_id as string) || undefined;
    try {
      const data = await this.authService.getAllUser(
        sort,
        limit,
        offset,
        status,
        role_id,
        employee_id,
        user_id,
        fullname,
        position_id,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.employeeaccountWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
}
