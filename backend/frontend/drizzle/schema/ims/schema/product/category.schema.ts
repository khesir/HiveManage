import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const category = pgTable('category', {
  category_id: serial('category_id').primaryKey(),
  name: varchar('name', { length: 255 }), // Category name, up to 255 characters
  content: varchar('content', { length: 255 }), // Additional information about the category, up to 255 characters
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
