import { Request, Response as ExpressResponse } from 'express';
import { EmploymentInformationModel } from './employment-information.model';
import { HttpStatus } from '../../../../lib/config';
import Response from '../../../../lib/response';
import { Pool } from 'mysql2/promise';

export class EmploymentInformationController {
  private model: EmploymentInformationModel;

  constructor(pool: Pool) {
    this.model = new EmploymentInformationModel(pool);
  }

  async createEmploymentInformation(req: Request, res: ExpressResponse) {
    try {
      console.log('Creating employmentInformation');
      const {
        employee_id,
        department_id,
        designation_id,
        employee_type,
        employee_status,
      } = req.body;

      if (
        !employee_id ||
        !department_id ||
        !designation_id ||
        !employee_type ||
        !employee_status
      ) {
        return res
          .status(HttpStatus.BAD_REQUEST.code)
          .send(
            new Response(
              HttpStatus.BAD_REQUEST.code,
              HttpStatus.BAD_REQUEST.status,
              'Missing required fields',
              null,
            ),
          );
      }

      const info = {
        employee_id,
        department_id,
        designation_id,
        employee_type,
        employee_status,
      };

      const insertId = await this.model.createEmploymentInformation(info);
      return res
        .status(HttpStatus.CREATED.code)
        .send(
          new Response(
            HttpStatus.CREATED.code,
            HttpStatus.CREATED.status,
            'Employment information created successfully',
            { employement_information_id: insertId },
          ),
        );
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(
          new Response(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            HttpStatus.INTERNAL_SERVER_ERROR.status,
            'Internal server error',
            null,
          ),
        );
    }
  }

  async getEmploymentInformationByEmployeeId(
    req: Request,
    res: ExpressResponse,
  ) {
    try {
      console.log('Request received for getEmploymentInformationByEmployeeId');
      const { employeeId } = req.params;
      console.log('Fetching data for employeeId:', employeeId);
      const employmentInfo =
        await this.model.getEmploymentInformationByEmployeeId(
          Number(employeeId),
        );

      if (!employmentInfo) {
        return res
          .status(HttpStatus.NOT_FOUND.code)
          .send(
            new Response(
              HttpStatus.NOT_FOUND.code,
              HttpStatus.NOT_FOUND.status,
              'Employment information not found',
              null,
            ),
          );
      }

      return res
        .status(HttpStatus.OK.code)
        .send(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            'Employment information retrieved successfully',
            employmentInfo,
          ),
        );
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(
          new Response(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            HttpStatus.INTERNAL_SERVER_ERROR.status,
            'Internal server error',
            null,
          ),
        );
    }
  }

  async updateEmploymentInformationById(req: Request, res: ExpressResponse) {
    try {
      const { id } = req.params;
      const {
        employee_id,
        department_id,
        designation_id,
        employee_type,
        employee_status,
      } = req.body;

      if (
        !employee_id ||
        !department_id ||
        !designation_id ||
        !employee_type ||
        !employee_status
      ) {
        return res
          .status(HttpStatus.BAD_REQUEST.code)
          .send(
            new Response(
              HttpStatus.BAD_REQUEST.code,
              HttpStatus.BAD_REQUEST.status,
              'Missing required fields',
              null,
            ),
          );
      }

      const info = {
        employee_id,
        department_id,
        designation_id,
        employee_type,
        employee_status,
      };

      await this.model.updateEmploymentInformationById(Number(id), info);
      return res
        .status(HttpStatus.OK.code)
        .send(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            'Employment information updated successfully',
            null,
          ),
        );
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(
          new Response(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            HttpStatus.INTERNAL_SERVER_ERROR.status,
            'Internal server error',
            null,
          ),
        );
    }
  }

  async deleteEmploymentInformationById(req: Request, res: ExpressResponse) {
    try {
      const { id } = req.params;
      await this.model.deleteEmploymentInformationById(Number(id));
      return res
        .status(HttpStatus.NO_CONTENT.code)
        .send(
          new Response(
            HttpStatus.NO_CONTENT.code,
            HttpStatus.NO_CONTENT.status,
            'Employment information deleted successfully',
            null,
          ),
        );
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(
          new Response(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            HttpStatus.INTERNAL_SERVER_ERROR.status,
            'Internal server error',
            null,
          ),
        );
    }
  }
}
