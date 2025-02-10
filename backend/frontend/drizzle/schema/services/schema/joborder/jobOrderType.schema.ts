import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const jobOrderType = pgTable('job_order_type', {
  joborder_type_id: serial('joborder_type_id').primaryKey(),
  name: varchar('name', { length: 255 }),
  description: varchar('description', { length: 255 }),
  joborder_types_status: varchar('status'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
