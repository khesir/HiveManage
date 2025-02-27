import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const productDetails = pgTable('product_details', {
  p_details_id: serial('p_details_id').primaryKey(),
  description: varchar('description', { length: 255 }),
  color: varchar('color'),
  size: varchar('size'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
