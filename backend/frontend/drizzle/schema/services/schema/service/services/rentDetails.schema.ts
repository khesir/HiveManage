import {
  boolean,
  integer,
  pgTable,
  real,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { service } from '../service.schema';
import { sql } from 'drizzle-orm';

export const rentDetails = pgTable('rent_details', {
  rent_id: serial('rent_id').primaryKey(),
  service_id: integer('service_id').references(() => service.service_id),
  rented_items: integer('rented_items')
    .array()
    .default(sql`'{}'::integer[]`),
  start_date: timestamp('start_date'),
  end_date: timestamp('end_date'),
  deposit: real('deposit'),
  returned: boolean('returned'),

  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
