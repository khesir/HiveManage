import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { ParticipantsService } from './participants.service';

export class ParticipantsController {
  private participantsService: ParticipantsService;

  constructor(pool: MySql2Database) {
    this.participantsService = new ParticipantsService(pool);
  }

  async getAllParticipants(req: Request, res: Response, next: NextFunction) {
    const id = (req.query.id as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.participantsService.getAllParticipants(
        id,
        limit,
        offset,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.length,
        limit: limit,
        offset: offset,
        data: data,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getParticipantsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { participants_id } = req.params;
      const data = await this.participantsService.getParticipantsById(
        Number(participants_id),
      );
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createParticipants(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id, channel_id, is_private } = req.body;

      // Check if is_private is a boolean and convert to 1(true) or 0(false)
      if (typeof is_private !== 'boolean') {
        return res.status(HttpStatus.BAD_REQUEST.code).json({
          status: 'Error',
          message: 'is_private must be a boolean (true or false)',
          statusCode: HttpStatus.BAD_REQUEST.code,
        });
      }

      const isPrivateValue = is_private ? 1 : 0;
      await this.participantsService.createParticipants({
        employee_id,
        channel_id,
        is_private: isPrivateValue, // Convert true/false to 1/0 before passing to the service
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Participants ',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error ',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateParticipants(req: Request, res: Response, next: NextFunction) {
    try {
      const { participants_id } = req.params;
      const { employee_id, channel_id, is_private } = req.body;

      await this.participantsService.updateParticipants(
        {
          employee_id,
          channel_id,
          is_private,
        },
        Number(participants_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Participants Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteParticipants(req: Request, res: Response, next: NextFunction) {
    try {
      const { participants_id } = req.params;
      await this.participantsService.deleteParticipants(
        Number(participants_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Participants ID:${participants_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
