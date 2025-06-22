import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const designation = pgTable('designation', {
  designation_id: serial('designation_id').primaryKey(),
  title: varchar('title', { length: 255 }),
  status: varchar('status', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
