import { and, eq, isNull, sql, asc, desc, inArray } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { CreateTickets } from './ticket.model';
import { tickets } from '@/drizzle/schema/services/schema/service/tickets.schema';
import { assignedTicket, service, ticketType } from '@/drizzle/schema/services';
import { serviceLog } from '@/drizzle/schema/records/schema/serviceLog';
import { employee } from '@/drizzle/schema/ems';

export class TicketsService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createTickets(data: CreateTickets) {
    await this.db.transaction(async (tx) => {
      const [newTicket] = await tx
        .insert(tickets)
        .values({ ...data })
        .returning({ ticket_id: tickets.ticket_id });

      await tx.insert(serviceLog).values({
        service_id: data.service_id,
        action: `User ID: ${data.user_id} created new ticket`,
        performed_by: data.user_id,
      });

      for (const employee of data.employees) {
        await tx.insert(assignedTicket).values({
          ticket_id: newTicket.ticket_id,
          employee_id: employee,
          service_id: data.service_id,
        });
        await tx.insert(serviceLog).values({
          service_id: data.service_id,
          action: `User ID: ${employee} has assigned employee to the ticket ID${newTicket.ticket_id}`,
          performed_by: data.user_id,
        });
      }
    });
  }

  async getAllTickets(
    no_pagination: boolean,
    service_id: string,
    ticket_status: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(tickets.deleted_at)];

    if (ticket_status) {
      const validStatuses = [
        'Pending',
        'In Review',
        'Approved',
        'Rejected',
        'Assigned',
        'In Progress',
        'On Hold',
        'Completed',
        'Cancelled',
        'Closed',
      ] as const;
      if (
        validStatuses.includes(ticket_status as (typeof validStatuses)[number])
      ) {
        conditions.push(
          eq(
            tickets.ticket_status,
            ticket_status as (typeof validStatuses)[number],
          ),
        );
      } else {
        throw new Error(`Invalid ticket status: ${ticket_status}`);
      }
    }
    if (service_id) {
      conditions.push(eq(tickets.service_id, Number(service_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(tickets)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(tickets)
      .leftJoin(
        ticketType,
        eq(ticketType.ticket_type_id, tickets.ticket_type_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(tickets.created_at) : desc(tickets.created_at),
      );

    // Control Pagination
    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;
    const ticketIds = result.map((s) => s.tickets.ticket_id);
    const assignedByTicket = await this.getAssignedTicketByTicketIDs(ticketIds);
    const ticketitemWithDetails = result.map((row) => ({
      ...row.tickets,
      ticket_type: row.ticketType,
      assigned: assignedByTicket.get(row.tickets.ticket_id),
    }));

    return { totalData, ticketitemWithDetails };
  }

  async getTicketsByID(ticket_id: string) {
    const result = await this.db
      .select()
      .from(tickets)
      .leftJoin(
        ticketType,
        eq(ticketType.ticket_type_id, tickets.ticket_type_id),
      )
      .leftJoin(service, eq(service.service_id, tickets.service_id))
      .where(eq(tickets.ticket_id, Number(ticket_id)));

    const ticketitemWithDetails = result.map((row) => ({
      ...row.tickets,
      ticketType: row.ticketType,
      service: row.service,
    }));

    return ticketitemWithDetails;
  }

  async updateTickets(data: object, paramsId: number) {
    await this.db
      .update(tickets)
      .set(data)
      .where(eq(tickets.ticket_id, paramsId));
  }

  async deleteTickets(paramsId: number): Promise<void> {
    await this.db
      .update(tickets)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(tickets.ticket_id, paramsId));
  }

  private async getAssignedTicketByTicketIDs(
    ticketIDs: number[],
  ): Promise<Map<number, unknown[]>> {
    const result = await this.db
      .select()
      .from(assignedTicket)
      .leftJoin(employee, eq(employee.employee_id, assignedTicket.employee_id))
      .where(inArray(assignedTicket.ticket_id, ticketIDs));

    const assignedTicketByTicketID = new Map<number, unknown[]>();

    result.forEach((record) => {
      const ticketID = record.assigned_ticket.ticket_id!;
      if (!assignedTicketByTicketID.has(ticketID)) {
        assignedTicketByTicketID.set(ticketID, []);
      }
      assignedTicketByTicketID.get(ticketID)!.push({
        ...record.assigned_ticket,
        employee: record.employee,
      });
    });
    return assignedTicketByTicketID;
  }
}
