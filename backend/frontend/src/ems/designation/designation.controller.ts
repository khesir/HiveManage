import { Request, Response as ExpressResponse } from 'express';
import { Pool } from 'mysql2/promise';

import { DesignationModel } from './designation.model';
import Response from '../../../lib/response';
import { HttpStatus } from '../../../config/config';

export class DesignationController {
  private designationModel: DesignationModel;

  constructor(pool: Pool) {
    this.designationModel = new DesignationModel(pool);
  }

  async getAllDesignation(req: Request, res: ExpressResponse): Promise<void> {
    try {
      const designation = await this.designationModel.getAllDesignation();
      const response = new Response(
        HttpStatus.OK.code,
        HttpStatus.OK.status,
        'Designation retrieved successfully',
        designation,
      );
      res.status(HttpStatus.OK.code).send(response);
    } catch {
      const response = new Response(
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.status,
        'Failed to retrieve designations',
        null,
      );
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
    }
  }

  // Get a department by ID
  async getDepartmentById(req: Request, res: ExpressResponse): Promise<void> {
    try {
      const { designationId } = req.params;
      const designation = await this.designationModel.getDesignationById(
        Number(designationId),
      );
      if (designation) {
        const response = new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          'Designation retrieved successfully',
          designation,
        );
        res.status(HttpStatus.OK.code).send(response);
      } else {
        const response = new Response(
          HttpStatus.NOT_FOUND.code,
          HttpStatus.NOT_FOUND.status,
          'Designation not found',
          null,
        );
        res.status(HttpStatus.NOT_FOUND.code).send(response);
      }
    } catch {
      const response = new Response(
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.status,
        'Failed to retrieve Designation',
        null,
      );
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
    }
  }
}
