import { Request, Response as ExpressResponse } from 'express';
import { Pool } from 'mysql2/promise';
import { IdentificationFinancialInformationModel } from './identification-financial-information.model';
import { HttpStatus } from '../../../../config/config';
import Response from '../../../../lib/response';
export class IdentificationFinancialInformationController {
  private model: IdentificationFinancialInformationModel;

  constructor(pool: Pool) {
    this.model = new IdentificationFinancialInformationModel(pool);
  }

  async createIdentificationFinancialInformation(
    req: Request,
    res: ExpressResponse,
  ) {
    try {
      const {
        employee_id,
        pag_ibig_id,
        sss_id,
        philhealth_id,
        tin,
        bank_account_number,
      } = req.body;

      if (
        employee_id === undefined ||
        pag_ibig_id === undefined ||
        sss_id === undefined ||
        philhealth_id === undefined ||
        tin === undefined ||
        bank_account_number === undefined
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
        pag_ibig_id,
        sss_id,
        philhealth_id,
        tin,
        bank_account_number,
      };

      const insertId =
        await this.model.createIdentificationFinancialInformation(info);
      return res
        .status(HttpStatus.CREATED.code)
        .send(
          new Response(
            HttpStatus.CREATED.code,
            HttpStatus.CREATED.status,
            'Identification financial information created successfully',
            { identification_id: insertId },
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

  async getIdentificationFinancialInformationByEmployeeId(
    req: Request,
    res: ExpressResponse,
  ) {
    try {
      const { employeeId } = req.params;
      const info =
        await this.model.getIdentificationFinancialInformationByEmployeeId(
          Number(employeeId),
        );

      if (!info) {
        return res
          .status(HttpStatus.NOT_FOUND.code)
          .send(
            new Response(
              HttpStatus.NOT_FOUND.code,
              HttpStatus.NOT_FOUND.status,
              'Identification financial information not found',
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
            'Identification financial information retrieved successfully',
            info,
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

  async updateIdentificationFinancialInformationById(
    req: Request,
    res: ExpressResponse,
  ) {
    try {
      const { id } = req.params;
      const {
        employee_id,
        pag_ibig_id,
        sss_id,
        philhealth_id,
        tin,
        bank_account_number,
      } = req.body;

      if (
        employee_id === undefined ||
        pag_ibig_id === undefined ||
        sss_id === undefined ||
        philhealth_id === undefined ||
        tin === undefined ||
        bank_account_number === undefined
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
        pag_ibig_id,
        sss_id,
        philhealth_id,
        tin,
        bank_account_number,
      };

      await this.model.updateIdentificationFinancialInformationById(
        Number(id),
        info,
      );
      return res
        .status(HttpStatus.OK.code)
        .send(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,
            'Identification financial information updated successfully',
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

  async deleteIdentificationFinancialInformationById(
    req: Request,
    res: ExpressResponse,
  ) {
    try {
      const { id } = req.params;
      await this.model.deleteIdentificationFinancialInformationById(Number(id));
      return res
        .status(HttpStatus.NO_CONTENT.code)
        .send(
          new Response(
            HttpStatus.NO_CONTENT.code,
            HttpStatus.NO_CONTENT.status,
            'Identification financial information deleted successfully',
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
