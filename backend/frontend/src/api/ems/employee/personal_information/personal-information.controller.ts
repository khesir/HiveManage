import { Request, Response as ExpressResponse } from 'express';
import { Pool } from 'mysql2/promise'; // Assuming you have this HttpStatus object
import { PersonalInformationModel } from './personal-information.model';
import { HttpStatus } from '../../../../../lib/config';
import Response from '../../../../lib/response';

export class PersonalInformationController {
  private model: PersonalInformationModel;

  constructor(pool: Pool) {
    this.model = new PersonalInformationModel(pool);
  }

  async createPersonalInformation(req: Request, res: ExpressResponse) {
    try {
      const {
        employee_id,
        birthday,
        gender,
        phone,
        email,
        address_line,
        postal_code,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_relationship,
      } = req.body;

      if (
        employee_id === undefined ||
        birthday === undefined ||
        gender === undefined ||
        phone === undefined ||
        email === undefined ||
        address_line === undefined ||
        postal_code === undefined ||
        emergency_contact_name === undefined ||
        emergency_contact_phone === undefined ||
        emergency_contact_relationship === undefined
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
        birthday,
        gender,
        phone,
        email,
        address_line,
        postal_code,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_relationship,
      };

      const insertId = await this.model.createPersonalInformation(info);
      return res
        .status(HttpStatus.CREATED.code)
        .send(
          new Response(
            HttpStatus.CREATED.code,
            HttpStatus.CREATED.status,
            'Personal information created successfully',
            { personal_information_id: insertId },
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

  async getPersonalInformationByEmployeeId(req: Request, res: ExpressResponse) {
    try {
      const { employeeId } = req.params;
      const personalInfo = await this.model.getPersonalInformationByEmployeeId(
        Number(employeeId),
      );

      if (!personalInfo) {
        return res
          .status(HttpStatus.NOT_FOUND.code)
          .send(
            new Response(
              HttpStatus.NOT_FOUND.code,
              HttpStatus.NOT_FOUND.status,
              'Personal information not found',
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
            'Personal information retrieved successfully',
            personalInfo,
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

  async updatePersonalInformationById(req: Request, res: ExpressResponse) {
    try {
      const { id } = req.params;
      const {
        employee_id,
        birthday,
        gender,
        phone,
        email,
        address_line,
        postal_code,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_relationship,
      } = req.body;

      if (
        employee_id === undefined ||
        birthday === undefined ||
        gender === undefined ||
        phone === undefined ||
        email === undefined ||
        address_line === undefined ||
        postal_code === undefined ||
        emergency_contact_name === undefined ||
        emergency_contact_phone === undefined ||
        emergency_contact_relationship === undefined
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
        birthday,
        gender,
        phone,
        email,
        address_line,
        postal_code,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_relationship,
      };

      await this.model.updatePersonalInformationById(Number(id), info);
      return res
        .status(HttpStatus.OK.code)
        .send(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            'Personal information updated successfully',
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

  async deletePersonalInformationById(req: Request, res: ExpressResponse) {
    try {
      const { id } = req.params;
      await this.model.deletePersonalInformationById(Number(id));
      return res
        .status(HttpStatus.NO_CONTENT.code)
        .send(
          new Response(
            HttpStatus.NO_CONTENT.code,
            HttpStatus.NO_CONTENT.status,
            'Personal information deleted successfully',
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
