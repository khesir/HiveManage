import { customer } from '@/drizzle/schema/customer';
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { payment } from '@/drizzle/schema/payment';

export const joborder_status = pgEnum('joborder_status', [
  'In Progress',
  'Pending',
  'Completed',
  'Turned Over',
  'Cancelled',
]);

export const joborder = pgTable('joborder', {
  joborder_id: serial('joborder_id').primaryKey(),
  customer_id: integer('customer_id').references(() => customer.customer_id),
  payment_id: integer('payment_id').references(() => payment.payment_id),
  joborder_uuid: varchar('joborder_uuid').unique(),
  expected_completion_date: timestamp('expected_completion_data'),
  completed_at: timestamp('completed_at'),
  turned_over_at: timestamp('turned_over_at'),
  status: joborder_status('status'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
