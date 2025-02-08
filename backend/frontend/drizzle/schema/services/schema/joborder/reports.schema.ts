import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const reports = pgTable('reports', {
  reports_id: serial('reports_id').primaryKey(),
  reports_title: varchar('reports_title', { length: 255 }),
  remarks: varchar('remarks', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
