import { Request, Response, NextFunction } from 'express';

import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { HttpStatus } from '@/lib/config';
import { BenefitsService } from './benefits.service';

export class BenefitsController {
  private benefitService: BenefitsService;

  constructor(pool: MySql2Database) {
    this.benefitService = new BenefitsService(pool);
  }

  async createBenefit(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id, start, end, benefits_type, amount, description } =
        req.body;

      await this.benefitService.createBenefits({
        employee_id,
        start,
        end,
        benefits_type,
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
      const { benefits_id } = req.params;
      const { employee_id, start, end, benefits_type, amount, description } =
        req.body;

      await this.benefitService.updateBenefits(
        {
          employee_id,
          start,
          end,
          benefits_type,
          amount,
          description,
        },
        Number(benefits_id),
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
    try {
      const data = await this.benefitService.getAllBenefits(benefitTypes);
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
      const { benefits_id } = req.params;
      const data = await this.benefitService.getBenefitsById(
        Number(benefits_id),
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
      const { benefits_id } = req.params;
      await this.benefitService.deleteBenefits(Number(benefits_id));
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
