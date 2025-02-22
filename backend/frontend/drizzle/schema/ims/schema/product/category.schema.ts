import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const category = pgTable('category', {
  category_id: serial('category_id').primaryKey(),
  name: varchar('name', { length: 255 }),
  content: varchar('content', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
