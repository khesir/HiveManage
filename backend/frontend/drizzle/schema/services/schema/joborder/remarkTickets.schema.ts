import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { jobOrder } from './jobOrder.schema';
import { remarkType } from './remarkType.schema';

export const remarktickets_status = pgEnum('remarktickets_status', [
  'Open',
  'In Progress',
  'Resolved',
  'Closed',
  'Pending',
  'Rejected',
]);

export const remarkTickets = pgTable('remark_tickets', {
  remark_id: serial('remark_id').primaryKey(),
  remark_type_id: integer('remark_type_id').references(
    () => remarkType.remark_type_id,
  ),
  job_order_id: integer('job_order_id').references(() => jobOrder.job_order_id),
  title: varchar('title'),
  description: varchar('description', { length: 255 }),
  content: varchar('content'),
  remarktickets_status: remarktickets_status('remark_tickets_status').notNull(),
  deadline: varchar('deadline'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
