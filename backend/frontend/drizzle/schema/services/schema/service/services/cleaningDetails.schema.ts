import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { service } from '../service.schema';

export const cleaningDetails = pgTable('cleaning_details', {
  cleaning_id: serial('cleaning_id').primaryKey(),
  service_id: integer('service_id').references(() => service.service_id),
  method: varchar('method'),
  notes: varchar('notes'),

  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
