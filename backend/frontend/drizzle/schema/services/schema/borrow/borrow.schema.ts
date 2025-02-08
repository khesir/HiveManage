import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { customer } from '@/drizzle/schema/customer';

export const borrowStatusEnum = pgEnum('borrow_status', [
  'Borrowed',
  'Confirmed',
  'Cancelled',
  'Pending',
  'Completed',
]);

export const borrow = pgTable('borrow', {
  borrow_id: serial('borrow_id').primaryKey(),
  customer_id: integer('customer_id').references(() => customer.customer_id),
  borrow_date: varchar('borrow_date'),
  return_date: varchar('return_date'),
  fee: integer('fee'),
  status: borrowStatusEnum('borrow_status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
