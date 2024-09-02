import { Request, Response } from 'express';

import { HttpStatus } from '../lib/config';

export class BaseController {
  async TestAPI(req: Request, res: Response) {
    res.send({
      status: HttpStatus.OK.code,
      code: HttpStatus.OK.status,
      message: 'PCBEE Backend, v1.0.0 - All Systems Go',
    });
  }
}
