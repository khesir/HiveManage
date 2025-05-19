import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { service_Type } from './serviceType.schema';
import { joborder } from './joborder.schema';

export const service_status = pgEnum('service_status', [
  'Cancelled',
  'In Progress',
  'Pending',
  'Completed',
]);

export const service = pgTable('service', {
  service_id: serial('service_id').primaryKey(),
  service_type_id: integer('service_type_id').references(
    () => service_Type.service_type_id,
  ),
  joborder_id: integer('joborder_id').references(() => joborder.joborder_id),
  uuid: varchar('uuid').notNull(),
  fee: integer('fee'),
  service_status: service_status('service_status').notNull(),
  total_cost_price: integer('total_cost_price'),
  is_returned: boolean('is_returned').default(false),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
