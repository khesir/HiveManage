import { eq, isNull } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { CreateTicketType } from './tickettype.model';
import { ticketType } from '@/drizzle/schema/services';

export class TicketTypeService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createTicketType(data: CreateTicketType) {
    await this.db.insert(ticketType).values(data);
  }

  async getAllTicketType() {
    const result = await this.db
      .select()
      .from(ticketType)
      .where(isNull(ticketType.deleted_at));
    return result;
  }

  async getTicketTypeById(paramsId: number) {
    const result = await this.db
      .select()
      .from(ticketType)
      .where(eq(ticketType.ticket_type_id, paramsId));
    return result[0];
  }

  async updateTicketType(data: object, paramsId: number) {
    await this.db
      .update(ticketType)
      .set(data)
      .where(eq(ticketType.ticket_type_id, paramsId));
  }

  async deleteTicketType(paramsId: number): Promise<void> {
    await this.db
      .update(ticketType)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(ticketType.ticket_type_id, paramsId));
  }
}
