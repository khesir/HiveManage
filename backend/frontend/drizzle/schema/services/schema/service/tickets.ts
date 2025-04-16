import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { ticketType } from './ticketType';
import { service } from './service';

export const tickets_status = pgEnum('tickets_status', [
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
]);

export const tickets = pgTable('tickets', {
  ticket_id: serial('ticket_id').primaryKey(),
  ticket_type_id: integer('ticket_type_id').references(
    () => ticketType.ticket_type_id,
  ),
  service_id: integer('service_id').references(() => service.service_id),
  title: varchar('title'),
  description: varchar('description', { length: 255 }),
  content: varchar('content'),
  ticket_status: tickets_status('ticket_status').notNull(),
  deadline: varchar('deadline'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
