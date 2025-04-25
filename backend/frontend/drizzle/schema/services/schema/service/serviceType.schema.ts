import {
  boolean,
  integer,
  pgTable,
  real,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const service_Type = pgTable('service_Type', {
  service_type_id: serial('service_type_id').primaryKey(),
  name: varchar('name').notNull(),
  customizable_fee: real('customizable_fee'),
  description: varchar('description', { length: 255 }),
  duration: integer('duration'),
  is_active: boolean('is_activate'),
  requires_serial: boolean('requires_serial'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
