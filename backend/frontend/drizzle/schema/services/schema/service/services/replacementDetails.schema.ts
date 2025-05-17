import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { service } from '../service.schema';
import { sql } from 'drizzle-orm';

export const replacementDetails = pgTable('replacement_details', {
  replacement_id: serial('replacement_id').primaryKey(),
  service_id: integer('service_id').references(() => service.service_id),
  owned_items: integer('owned_items')
    .array()
    .default(sql`'{}'::integer[]`),
  new_product: integer('new_product')
    .array()
    .default(sql`'{}'::integer[]`),
  reason: varchar('reason'),

  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
