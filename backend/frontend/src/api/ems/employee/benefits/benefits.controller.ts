import { Request, Response, NextFunction } from 'express';

import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { HttpStatus } from '@/lib/config';
import { BenefitsService } from './benefits.service';
import { SchemaType } from '@/drizzle/drizzle.schema';

export class BenefitsController {
  private benefitService: BenefitsService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.benefitService = new BenefitsService(pool);
  }

  async createBenefit(req: Request, res: Response, next: NextFunction) {
    try {
      const employee_id = Number(req.params.employee_id);
      const {
        name,
        start,
        end,
        benefits_type,
        frequency,
        amount,
        description,
      } = req.body;

      await this.benefitService.createBenefits({
        employee_id,
        name,
        start,
        end,
        benefits_type,
        frequency,
        amount,
        description,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ message: 'Benefit Successfully Created' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateBenefit(req: Request, res: Response, next: NextFunction) {
    try {
      const { benefits_id, employee_id } = req.params;
      const {
        name,
        start,
        end,
        frequency,
        benefits_type,
        amount,
        description,
      } = req.body;

      await this.benefitService.updateBenefits(
        {
          name,
          start,
          end,
          benefits_type,
          frequency,
          amount,
          description,
        },
        employee_id,
        benefits_id,
      );
      res
        .status(HttpStatus.OK.code)
        .json({ message: 'Benefits Updated Successfully' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error' });
      next(error);
    }
  }

  async getAllBenefits(req: Request, res: Response, next: NextFunction) {
    const benefitTypes = (req.query.benefits_type as string) || undefined;
    const employee_id = req.params.employee_id;
    try {
      const data = await this.benefitService.getAllBenefits(
        benefitTypes,
        employee_id,
      );
      res.status(HttpStatus.OK.code).json({ data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error' });
      next(error);
    }
  }

  async getBenefitsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { benefits_id, employee_id } = req.params;
      const data = await this.benefitService.getBenefitsById(
        employee_id,
        benefits_id,
      );
      res.status(200).json({ message: data });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async deleteBenefitsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { benefits_id, employee_id } = req.params;
      await this.benefitService.deleteBenefits(employee_id, benefits_id);
      res.status(200).json({
        message: `Benefit ID:${benefits_id} is deleted successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error' });
      next(error);
    }
  }
}
