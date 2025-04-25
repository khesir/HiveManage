import { employee } from '@/drizzle/schema/ems/schema/employee.schema';
import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { tickets } from './tickets.schema';
import { service } from './service.schema';

export const assignedTicket = pgTable('assigned_ticket', {
  assigned_ticket_id: serial('assigned_ticket_id').primaryKey(),
  ticket_id: integer('ticket_id').references(() => tickets.ticket_id),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  service_id: integer('service_id').references(() => service.service_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
