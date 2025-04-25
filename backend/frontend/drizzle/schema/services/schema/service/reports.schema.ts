import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { service } from './service.schema';

export const reports = pgTable('reports', {
  reports_id: serial('reports_id').primaryKey(),
  service_id: integer('service_id').references(() => service.service_id),
  reports_title: varchar('reports_title', { length: 255 }),
  tickets: varchar('tickets', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
