import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { HttpStatus } from '@/lib/HttpStatus';
import { employee } from '@/drizzle/schema/ems/schema/employee.schema';
import { ticketType } from '@/drizzle/schema/services';

// There's a globally used
// middleware like error handling and schema validation

export async function validateTicketTypeID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { ticket_type_id } = req.params;

  try {
    const TicketType = await db
      .select()
      .from(ticketType)
      .where(
        and(
          eq(ticketType.ticket_type_id, Number(ticket_type_id)),
          isNull(ticketType.deleted_at),
        ),
      );
    console.log(TicketType);
    if (!TicketType[0]) {
      return res.status(404).json({ message: 'Ticket Type not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}

export async function validateSalesByEmployeeID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { employee_id } = req.body;
  try {
    const data = await db
      .select()
      .from(employee)
      .where(
        and(
          eq(employee.employee_id, Number(employee_id)),
          isNull(employee.deleted_at),
        ),
      );
    console.log(data);
    if (!data[0]) {
      return res
        .status(HttpStatus.NOT_FOUND.code)
        .json({ message: 'Employee not found' });
    }
    next();
  } catch (error) {
    console.log(error);
    log.error(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ message: 'Internal server error' });
  }
}
