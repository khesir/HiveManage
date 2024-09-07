import { Request, Response, NextFunction } from 'express';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';

import { HttpStatus } from '../../../../../lib/config';
import { SignatoryService } from './signatory.service';

export class SignatoryController {
  private signatoryService: SignatoryService;

  constructor(pool: MySql2Database) {
    this.signatoryService = new SignatoryService(pool);
  }

  async createSignatory(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id, signatory_name, role, permission_level } = req.body;
      await this.signatoryService.createSignatory({
        employee_id,
        signatory_name,
        role,
        permission_level
      });
      res.status(HttpStatus.CREATED.code).json({
        message: 'Signatory Created',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }

  async getSignatory(req: Request, res: Response, next: NextFunction) {
    try {
      const { signatory_id } = req.params;
      const { employee_id } = req.query;
      const result = await this.signatoryService.getSignatory(
        Number(signatory_id),
        Number(signatory_id)
      );

      res.status(HttpStatus.OK.code).json({ data: result });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send({ message: 'Internal Server Error' });
      next(error);
    }
  }

  async updateSignatory(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { signatory_id } = req.params;
      const { employee_id, signatory_name, role, permission_level } = req.body;
      await this.signatoryService.updateSignatory(
        {
          employee_id,
          signatory_name, 
          role, 
          permission_level,
        },
        Number(signatory_id),
      );
      res.status(HttpStatus.OK.code).json({
        message: 'Salary Information Updated succesfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }

  async deleteSignatory(req: Request, res: Response, next: NextFunction) {
    try {
      const { signatory_id } = req.params;
      console.log("Params-controller: " + req.params);
      await this.signatoryService.deleteSignatory(Number(signatory_id));
      res.status(HttpStatus.OK.code).json({ message: 'Signatory deleted successfully' });
    } catch (error) {
      next(error); 
    }
  }
}
