import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { employee } from '../../ems';
import { joborder } from '../../services/schema/service/joborder.schema';

export const joborderLog = pgTable('joborder_Log', {
  joborder_log_id: serial('product_log_id').primaryKey(),
  joborder_id: integer('joborder_id').references(() => joborder.joborder_id),
  action: varchar('action', { length: 255 }),
  performed_by: integer('performed_by').references(() => employee.employee_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
