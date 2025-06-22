import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { service } from './service.schema';

export const serviceReturn = pgTable('service_return', {
  return_id: serial('return_id').primaryKey(),
  original_service_id: integer('original_service_id').references(
    () => service.service_id,
  ),
  new_service_id: integer('new_service_id').references(
    () => service.service_id,
  ),
  reason: varchar('reason'),
  under_warranty: boolean('under_warranty'),
  returned_at: timestamp('returned_at'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
