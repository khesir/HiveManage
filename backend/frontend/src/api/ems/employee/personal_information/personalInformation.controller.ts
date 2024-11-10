import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';

import { HttpStatus } from '@/lib/config';
import { PersonalInformationService } from './personalInformation.service';
import { SchemaType } from '@/drizzle/drizzle.schema';

export class PersonalInformationController {
  private personalInformationService: PersonalInformationService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.personalInformationService = new PersonalInformationService(pool);
  }

  async getPersonalInformation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { personalInfo_id } = req.params;
      const { employee_id } = req.params;
      const result =
        await this.personalInformationService.getPersonalInformation(
          Number(personalInfo_id),
          Number(employee_id),
        );

      res.status(HttpStatus.OK.code).json({
        status: HttpStatus.OK.status,
        data: result,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send({ message: 'Internal Server Error' });
      next(error);
    }
  }
  async createPersonalInformation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const {
        birthday,
        sex,
        phone,
        address_line,
        postal_code,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_relationship,
      } = req.body;
      const { employee_id } = req.params;

      await this.personalInformationService.createPersonalInformation(
        Number(employee_id),
        {
          birthday,
          sex,
          phone,
          address_line,
          postal_code,
          emergency_contact_name,
          emergency_contact_phone,
          emergency_contact_relationship,
        },
      );
      res.status(HttpStatus.OK.code).json({
        message: 'Personal Information Created succesfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }

  async updatePersonalInformation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { personalInfo_id, employee_id } = req.params;
      const {
        birthday,
        sex,
        phone,
        address_line,
        postal_code,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_relationship,
      } = req.body;
      await this.personalInformationService.updatePersonalInformation(
        {
          employee_id,
          birthday,
          sex,
          phone,
          address_line,
          postal_code,
          emergency_contact_name,
          emergency_contact_phone,
          emergency_contact_relationship,
        },
        Number(personalInfo_id),
      );
      res.status(HttpStatus.OK.code).json({
        message: 'Financial Information Updated succesfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }

  async deleteEmploymentInformation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { personalInfo_id } = req.params;
      await this.personalInformationService.deletePersonalInformation(
        Number(personalInfo_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ message: 'Financial Information deleted succesfully' });
    } catch (error) {
      res.status(HttpStatus.OK.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
}
