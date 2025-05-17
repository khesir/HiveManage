import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { service } from './service.schema';

export const serviceOwnedItems = pgTable('service_owned_items', {
  service_owned_id: serial('service_owned_id').primaryKey(),
  service_id: integer('service_id').references(() => service.service_id),
  item_description: varchar('item_description'),
  serial_number: varchar('serial_number'),
  brand: varchar('brand'),
  model: varchar('model'),
  notes: varchar('notes '),

  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
