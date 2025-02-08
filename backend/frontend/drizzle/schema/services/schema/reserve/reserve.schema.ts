import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { customer } from '@/drizzle/schema/customer';

export const reserveStatusEnum = pgEnum('reserveStatusEnum', [
  'Reserved',
  'Confirmed',
  'Cancelled',
  'Pending',
  'Completed',
]);

export const reserve = pgTable('reserve', {
  reserve_id: serial('reserve_id').primaryKey(),
  customer_id: integer('customer_id').references(() => customer.customer_id),
  reserve_status: reserveStatusEnum('reserve_status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
