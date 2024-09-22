import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { HttpStatus } from '../../../../lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { ChannelService } from './channel.service';

export class ChannelController {
  private channelService: ChannelService;

  constructor(pool: MySql2Database) {
    this.channelService = new ChannelService(pool);
  }

  async getAllChannel(req: Request, res: Response, next: NextFunction) {
    const id = (req.query.id as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.channelService.getAllChannel(id, limit, offset);
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

  async getChannelById(req: Request, res: Response, next: NextFunction) {
    try {
      const { channel_id } = req.params;
      const data = await this.channelService.getChannelById(Number(channel_id));
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createChannel(req: Request, res: Response, next: NextFunction) {
    try {
      const { inquiry_id, channel_name, is_private } = req.body;

      await this.channelService.createChannel({
        inquiry_id,
        channel_name,
        is_private,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ status: 'Success', message: 'Successfully Created Channel ' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error ',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateChannel(req: Request, res: Response, next: NextFunction) {
    try {
      const { channel_id } = req.params;
      const { inquiry_id, channel_name, is_private } = req.body;

      await this.channelService.updateChannel(
        {
          inquiry_id,
          channel_name,
          is_private,
        },
        Number(channel_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ status: 'Success', message: 'Channel Updated Successfully ' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteChannel(req: Request, res: Response, next: NextFunction) {
    try {
      const { channel_id } = req.params;
      await this.channelService.deleteChannel(Number(channel_id));
      res.status(200).json({
        status: 'Success',
        message: `Channel ID:${channel_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
