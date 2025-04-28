import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { employee } from '../../ems';
import { payment } from '../../payment';
import { service, tickets, transactionServiceItems } from '../../services';

export const serviceLog = pgTable('serviceLog', {
  service_log_id: serial('service_log_id').primaryKey(),
  service_id: integer('service_id').references(() => service.service_id),
  ticket_id: integer('ticket_id').references(() => tickets.ticket_id),
  transaction_service_item_id: integer(
    'transaction_service_item_id',
  ).references(() => transactionServiceItems.transaction_service_item_id),
  payment_id: integer('payment_id').references(() => payment.payment_id),
  action: varchar('action', { length: 255 }),
  performed_by: integer('performed_by').references(() => employee.employee_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
