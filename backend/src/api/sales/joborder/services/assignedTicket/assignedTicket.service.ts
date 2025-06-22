import { and, eq, isNull } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { employee } from '@/drizzle/schema/ems';
import { assignedTicket, tickets } from '@/drizzle/schema/services';
import { SchemaType } from '@/drizzle/schema/type';
import { CreateAssignedTicket } from './assignedTicket.model';

export class AssignedTicketService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createAssignedTicket(data: CreateAssignedTicket) {
    await this.db.insert(assignedTicket).values(data);
  }

  async getAllAssignedTicket(
    ticket_id: string | undefined,
    employee_id: string | undefined,
  ) {
    const conditions = [isNull(assignedTicket.deleted_at)];
    if (ticket_id) {
      conditions.push(eq(assignedTicket.ticket_id, Number(ticket_id)));
    }
    if (employee_id) {
      conditions.push(eq(assignedTicket.employee_id, Number(employee_id)));
    }
    const result = await this.db
      .select()
      .from(assignedTicket)
      .leftJoin(tickets, eq(tickets.ticket_id, assignedTicket.ticket_id))
      .leftJoin(employee, eq(employee.employee_id, assignedTicket.employee_id))
      .where(and(...conditions));

    const assignedEmployeeDetails = result.map((row) => ({
      ...row.assigned_ticket,
      ticket: {
        ...row.tickets,
      },
      employee: {
        ...row.employee,
      },
    }));

    return assignedEmployeeDetails;
  }

  async getAssignTicketByID(assigned_ticket_id: string) {
    const result = await this.db
      .select()
      .from(assignedTicket)
      .leftJoin(tickets, eq(tickets.ticket_id, assignedTicket.ticket_id))
      .leftJoin(employee, eq(assignedTicket.employee_id, employee.employee_id))
      .where(eq(assignedTicket.assigned_ticket_id, Number(assigned_ticket_id)));

    const assignedEmployeeDetails = result.map((row) => ({
      ...row.assigned_ticket,
      ticket: {
        ...row.tickets,
      },
      employee: {
        ...row.employee,
      },
    }));

    return assignedEmployeeDetails;
  }

  async updateAssignedTicket(data: object, paramsId: number) {
    await this.db
      .update(assignedTicket)
      .set(data)
      .where(eq(assignedTicket.assigned_ticket_id, paramsId));
  }

  async deleteAssignedTicket(paramsId: number): Promise<void> {
    await this.db
      .update(assignedTicket)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(assignedTicket.assigned_ticket_id, paramsId));
  }
}
