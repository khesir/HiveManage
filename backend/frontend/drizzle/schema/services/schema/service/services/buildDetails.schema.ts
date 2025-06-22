import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { service } from '../service.schema';
import { sql } from 'drizzle-orm';

export const buildDetails = pgTable('build_details', {
  build_id: serial('build_id').primaryKey(),
  service_id: integer('service_id').references(() => service.service_id),
  customer_items: integer('customer_items')
    .array()
    .default(sql`'{}'::integer[]`),
  parts_used: integer('parts_used')
    .array()
    .default(sql`'{}'::integer[]`),
  build_specs: varchar('build_specs'),
  checklist: varchar('checklist'),

  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
