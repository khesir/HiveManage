import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { customer } from '../../customer';

export const salesStatus = pgEnum('sales_status', [
  'Completed',
  'Parially Completed',
  'Cancelled',
  'Pending',
]);

export const sales = pgTable('sales', {
  sales_id: serial('sales_id').primaryKey(),
  customer_id: integer('customer_id').references(() => customer.customer_id),
  status: salesStatus('sales_status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
