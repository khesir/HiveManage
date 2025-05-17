import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { service } from '../service.schema';
import { sql } from 'drizzle-orm';

export const upgradeDetails = pgTable('upgrade_details', {
  upgrade_id: serial('upgrade_id').primaryKey(),
  service_id: integer('service_id').references(() => service.service_id),
  before_specs: integer('before_specs')
    .array()
    .default(sql`'{}'::integer[]`),
  upgraded_components: integer('upgraded_components')
    .array()
    .default(sql`'{}'::integer[]`),
  notes: varchar('notes'),

  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
