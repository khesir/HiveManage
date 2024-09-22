import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { HttpStatus } from '../../../../lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { MessageService } from './message.service';

export class MessageController {
  private messageService: MessageService;

  constructor(pool: MySql2Database) {
    this.messageService = new MessageService(pool);
  }

  async getAllMessage(req: Request, res: Response, next: NextFunction) {
    const id = (req.query.id as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.messageService.getAllMessage(id, limit, offset);
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

  async getMessageById(req: Request, res: Response, next: NextFunction) {
    try {
      const { message_id } = req.params;
      const data = await this.messageService.getMessageById(Number(message_id));
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { inquiry_id, sender_id, sender_type, content } = req.body;

      await this.messageService.createMessage({
        inquiry_id,
        sender_id,
        sender_type,
        content,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ status: 'Success', message: 'Successfully Created Message ' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error ',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { message_id } = req.params;
      const { inquiry_id, sender_id, sender_type, content } = req.body;

      await this.messageService.updateMessage(
        {
          inquiry_id,
          sender_id,
          sender_type,
          content,
        },
        Number(message_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ status: 'Success', message: 'Message Updated Successfully ' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { message_id } = req.params;
      await this.messageService.deleteMessage(Number(message_id));
      res.status(200).json({
        status: 'Success',
        message: `Message ID:${message_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
