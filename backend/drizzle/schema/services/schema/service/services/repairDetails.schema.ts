import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { service } from '../service.schema';
import { sql } from 'drizzle-orm';

export const repairDetails = pgTable('repair_details', {
  repair_details_id: serial('repair_details_id').primaryKey(),
  service_id: integer('service_id').references(() => service.service_id),
  parts_used: integer('parts_used')
    .array()
    .default(sql`'{}'::integer[]`),
  diagnostic_notes: varchar('diagnostic_notes'),
  work_done: varchar('work_done'),

  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
