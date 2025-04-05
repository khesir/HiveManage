import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const service_Type = pgTable('service_Type', {
  service_type_id: serial('service_type_id').primaryKey(),
  name: varchar('name').notNull(),
  description: varchar('description', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
