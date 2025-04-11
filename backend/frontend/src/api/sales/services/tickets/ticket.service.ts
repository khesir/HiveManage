import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { CreateTickets } from './ticket.model';
import { tickets } from '@/drizzle/schema/services/schema/service/tickets';
import { service, ticketType } from '@/drizzle/schema/services';

export class TicketsService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createTickets(data: CreateTickets) {
    await this.db.insert(tickets).values(data);
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
      // Define valid statuses as a string union type
      const validStatuses = ['Removed', 'Resolved', 'Pending'] as const; // 'as const' infers a readonly tuple of strings
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
      .leftJoin(service, eq(service.service_id, tickets.service_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(tickets.created_at) : desc(tickets.created_at),
      );

    // Control Pagination
    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const ticketitemWithDetails = result.map((row) => ({
      ticket_id: row.tickets.ticket_id,
      ticketType: {
        ticket_type_id: row.ticketType?.ticket_type_id,
        name: row.ticketType?.name,
        description: row.ticketType?.description,
        created_at: row.ticketType?.created_at,
        last_updated: row.ticketType?.last_updated,
        deleted_at: row.ticketType?.deleted_at,
      },
      service: {
        service_id: row.service?.service_id,
        service_type_id: row.service?.service_type_id,
        description: row.service?.description,
        uuid: row.service?.uuid,
        fee: row.service?.fee,
        customer_id: row.service?.customer_id,
        service_status: row.service?.service_status,
        total_cost_price: row.service?.total_cost_price,
        created_at: row.service?.created_at,
        last_updated: row.service?.last_updated,
        deleted_at: row.service?.deleted_at,
      },
      title: row.tickets.title,
      description: row.tickets?.description,
      content: row.tickets?.content,
      ticket_status: row.tickets?.ticket_status,
      deadline: row.tickets?.deadline,
      created_at: row.tickets?.created_at,
      last_updated: row.tickets?.last_updated,
      deleted_at: row.tickets?.deleted_at,
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
      ticket_id: row.tickets.ticket_id,
      ticketType: {
        ticket_type_id: row.ticketType?.ticket_type_id,
        name: row.ticketType?.name,
        description: row.ticketType?.description,
        created_at: row.ticketType?.created_at,
        last_updated: row.ticketType?.last_updated,
        deleted_at: row.ticketType?.deleted_at,
      },
      service: {
        service_id: row.service?.service_id,
        service_type_id: row.service?.service_type_id,
        description: row.service?.description,
        uuid: row.service?.uuid,
        fee: row.service?.fee,
        customer_id: row.service?.customer_id,
        service_status: row.service?.service_status,
        total_cost_price: row.service?.total_cost_price,
        created_at: row.service?.created_at,
        last_updated: row.service?.last_updated,
        deleted_at: row.service?.deleted_at,
      },
      title: row.tickets.title,
      description: row.tickets?.description,
      content: row.tickets?.content,
      ticket_status: row.tickets?.ticket_status,
      deadline: row.tickets?.deadline,
      created_at: row.tickets?.created_at,
      last_updated: row.tickets?.last_updated,
      deleted_at: row.tickets?.deleted_at,
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
}
