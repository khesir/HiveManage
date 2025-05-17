import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { service } from '../service.schema';
import { sql } from 'drizzle-orm';

export const reserve_details_status = pgEnum('reserve_details_status', [
  'Pending',
  'Confirmed',
  'Cancelled',
]);

export const reserveDetails = pgTable('reserve_details', {
  reserve_id: serial('reserve_id').primaryKey(),
  service_id: integer('service_id').references(() => service.service_id),
  reserve_item_id: integer('reserve_item_id')
    .array()
    .default(sql`'{}'::integer[]`),

  reservation_date: timestamp('reservation_date'),
  status: reserve_details_status('status'),

  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
